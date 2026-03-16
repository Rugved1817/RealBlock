import prisma from '../../prisma/client.js';
import { blockchainService } from '../blockchain/blockchain.service.js';
import { custodialWalletService } from '../blockchain/custodial-wallet.service.js';
import { ethers } from 'ethers';

export class PropertyService {
    async getAllProperties() {
        return await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getFeaturedProperties() {
        return await prisma.property.findMany({
            where: {
                isFeatured: true
            },
            take: 3,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getPropertyById(id: string) {
        return await prisma.property.findUnique({
            where: { id }
        });
    }

    async invest(userId: string, propertyId: string, sqftAmount: number) {
        // 1. Fetch property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            throw new Error('Property not found');
        }

        if (property.status !== 'OPEN') {
            throw new Error('Property is not open for investment');
        }

        const availableSqft = property.totalSqft - property.sqftSold;

        if (sqftAmount > availableSqft) {
            throw new Error(`Insufficient units available. Only ${availableSqft} sqft remaining.`);
        }

        // 3. Check and Deduct from Wallet (Simulated)
        const wallet = await (prisma as any).wallet.findUnique({ where: { userId } });
        const totalCost = sqftAmount * property.pricePerSqft;

        if (!wallet || wallet.balance < totalCost) {
            throw new Error('Insufficient wallet balance');
        }

        // Get custodial wallet address for this user (auto-creates if missing)
        const userAddress = await custodialWalletService.getWalletAddress(userId);

        // 4. Create Transaction and Update Property in a database transaction
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from wallet
            await (tx as any).wallet.update({
                where: { userId },
                data: { balance: { decrement: totalCost } }
            });

            // Create Transaction Record (Database)
            const dbTransaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    sqft: sqftAmount,
                    amount: totalCost,
                    type: 'BUY',
                    status: 'PENDING'
                } as any
            });

            // Update Property Stats
            const newSqftSold = property.sqftSold + sqftAmount;
            const newProgress = Math.round((newSqftSold / property.totalSqft) * 100);

            let newStatus = property.status;
            if (newSqftSold >= property.totalSqft) {
                newStatus = 'FULLY_FUNDED';
            }

            const updatedProperty = await tx.property.update({
                where: { id: propertyId },
                data: {
                    sqftSold: newSqftSold,
                    progress: newProgress,
                    status: newStatus
                }
            });

            return { transaction: dbTransaction, updatedProperty };
        });

        // 5. Always mark transaction as COMPLETED immediately (DB is source of truth in custodial model)
        await prisma.transaction.update({
            where: { id: result.transaction.id },
            data: { status: 'COMPLETED' }
        });
        (result.transaction as any).status = 'COMPLETED';

        // 6. Blockchain sync fires in the background (non-blocking — won't affect user response)
        if (property.contractAddress) {
            setImmediate(async () => {
                try {
                    const valueWei = ethers.utils.parseEther((totalCost / 100000).toString()).toString();
                    const txHash = await blockchainService.purchaseOnChain(
                        property.contractAddress!,
                        userAddress,
                        sqftAmount,
                        valueWei
                    );
                    // Update with the on-chain hash once confirmed
                    await prisma.transaction.update({
                        where: { id: result.transaction.id },
                        data: { transactionHash: txHash }
                    });
                    console.log(`✅ On-chain sync complete for transaction ${result.transaction.id}: ${txHash}`);
                } catch (error: any) {
                    // Log only — transaction is already COMPLETED in DB. No user impact.
                    console.warn(`⚠️  Background blockchain sync skipped for ${result.transaction.id}: ${error?.message}`);
                }
            });
        }

        return result;
    }


    async sell(userId: string, propertyId: string, sqftAmount: number) {
        // 1. Fetch property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            throw new Error('Property not found');
        }

        // 2. Check holdings
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                propertyId,
                status: 'COMPLETED'
            }
        });

        const sqftOwned = transactions.reduce((sum, t: any) => {
            return t.type === 'SELL' ? sum - t.sqft : sum + t.sqft;
        }, 0);

        if (sqftAmount > sqftOwned) {
            throw new Error(`Insufficient holdings. You only own ${sqftOwned} sqft.`);
        }

        // 3. Calculate sale price (usually there might be a spread, but let's use current price)
        const totalValue = sqftAmount * property.pricePerSqft;

        // 4. Update Database in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Add to wallet
            await (tx as any).wallet.update({
                where: { userId },
                data: { balance: { increment: totalValue } }
            });

            // Create Transaction Record
            const dbTransaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    sqft: sqftAmount,
                    amount: totalValue * -1, // Negative for inflow in our display logic
                    type: 'SELL',
                    status: 'COMPLETED' // For now, immediate completion
                } as any
            });

            // Update Property Stats (Reducing sold amount as it's being "returned" or sold back)
            // Note: In a real P2P marketplace, this wouldn't update the property's sqftSold unless it's a primary buy-back.
            // For this app, we'll treat it as liquidity provided by the platform.
            const newSqftSold = property.sqftSold - sqftAmount;
            const newProgress = Math.round((newSqftSold / property.totalSqft) * 100);

            await tx.property.update({
                where: { id: propertyId },
                data: {
                    sqftSold: newSqftSold,
                    progress: newProgress,
                    status: newSqftSold < property.totalSqft ? 'OPEN' : 'FULLY_FUNDED'
                }
            });

            return { transaction: dbTransaction };
        });

        return result;
    }
}

export const propertyService = new PropertyService();

