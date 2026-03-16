import { ethers } from 'ethers';
import prisma from '../../prisma/client.js';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.WALLET_ENCRYPTION_KEY!;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    console.error('⚠️  WALLET_ENCRYPTION_KEY is missing or invalid in .env. Custodial wallets will not work.');
}

export class CustodialWalletService {

    /**
     * Creates a fresh random Ethereum wallet for a user during signup.
     * The private key is AES-256-GCM encrypted before being stored in the database.
     * This is called automatically on new user registration — the user never sees this.
     */
    async createWalletForUser(userId: string): Promise<{ address: string }> {
        // Always check if one already exists (idempotent)
        const existing = await (prisma as any).custodialWallet.findUnique({ where: { userId } });
        if (existing) return { address: existing.address };

        // Generate a brand new random wallet
        const wallet = ethers.Wallet.createRandom();
        const encryptedKey = this.encrypt(wallet.privateKey);

        const created = await (prisma as any).custodialWallet.create({
            data: {
                userId,
                address: wallet.address,
                encryptedKey,
                network: process.env.RPC_URL?.includes('127') ? 'localhost' : 'polygon-amoy',
            }
        });

        console.log(`✅ Custodial wallet created for user ${userId}: ${wallet.address}`);
        return { address: created.address };
    }

    /**
     * Returns the user's public Ethereum address. Safe to expose via API.
     */
    async getWalletAddress(userId: string): Promise<string> {
        const cw = await (prisma as any).custodialWallet.findUnique({ where: { userId } });
        if (!cw) {
            // Auto-create if missing (for existing users)
            const created = await this.createWalletForUser(userId);
            return created.address;
        }
        return cw.address;
    }

    /**
     * Returns the full wallet info (address, network). Safe for "Technical Details" page.
     */
    async getWalletInfo(userId: string): Promise<{ address: string; network: string; createdAt: Date }> {
        const cw = await (prisma as any).custodialWallet.findUnique({ where: { userId } });
        if (!cw) {
            await this.createWalletForUser(userId);
            return this.getWalletInfo(userId);
        }
        return {
            address: cw.address as string,
            network: cw.network as string,
            createdAt: cw.createdAt as Date,
        };
    }

    /**
     * ⚠️ INTERNAL USE ONLY — Never expose this to any API endpoint.
     * Decrypts the private key and returns a ready-to-sign ethers.Wallet instance.
     */
    async getSignerForUser(userId: string, provider: ethers.providers.Provider): Promise<ethers.Wallet> {
        const cw = await (prisma as any).custodialWallet.findUnique({ where: { userId } });
        if (!cw) throw new Error('Custodial wallet not found for user ' + userId);
        const privateKey = this.decrypt(cw.encryptedKey);
        return new ethers.Wallet(privateKey, provider);
    }

    // ─── Encryption Helpers (AES-256-GCM) ────────────────────────────────────

    private encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            Buffer.from(ENCRYPTION_KEY, 'hex'),
            iv
        );
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();
        // Format: iv:authTag:ciphertext (all hex-encoded)
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
    }

    private decrypt(encryptedText: string): string {
        const [ivHex, authTagHex, encryptedHex] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            Buffer.from(ENCRYPTION_KEY, 'hex'),
            iv
        );
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encryptedHex, 'hex')),
            decipher.final()
        ]);
        return decrypted.toString('utf8');
    }
}

export const custodialWalletService = new CustodialWalletService();
