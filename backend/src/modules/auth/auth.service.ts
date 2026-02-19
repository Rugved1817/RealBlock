import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthService {
    async signup(email: string, password: string, name?: string) {
        // Check if user already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                isKycVerified: false,
            },
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    async login(email: string, password: string) {
        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        // Verify password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isKycVerified: user.isKycVerified,
            },
        };
    }

    verifyToken(token: string) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                email: string;
            };
            return decoded;
        } catch {
            throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid token' });
        }
    }

    async getUserById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                isKycVerified: true,
            }
        });
        return user;
    }

    async getDashboardStats(userId: string) {
        // Cast to any to avoid TS errors until client regenerates fully
        const prismaClient = prisma as any;
        const transactions = await prismaClient.transaction.findMany({
            where: { userId },
            include: {
                property: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalInvestment = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);

        // SYNC: Update User table with total investment as requested
        await prismaClient.user.update({
            where: { id: userId },
            data: { totalInvestment }
        });

        const totalSqft = transactions.reduce((sum: number, t: any) => sum + t.sqft, 0);
        const uniqueProperties = new Set(transactions.map((t: any) => t.propertyId)).size;

        return {
            totalInvestment,
            totalSqft,
            propertyCount: uniqueProperties,
            transactions: transactions.map((t: any) => ({
                id: t.id,
                date: t.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                property: t.property.name,
                type: 'Token Purchase', // For now only purchases
                status: t.status,
                amount: t.amount * -1, // Negative for outflow
                icon: t.property.type === 'COMMERCIAL' ? '🏢' : t.property.type === 'WAREHOUSING' ? '🏭' : '🏠'
            }))
        };
    }
    async getWallet(userId: string) {
        const prismaClient = prisma as any;
        let wallet = await prismaClient.wallet.findUnique({
            where: { userId }
        });

        if (!wallet) {
            // Create a default wallet if none exists
            wallet = await prismaClient.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    currency: 'INR'
                }
            });
        }

        return wallet;
    }
    async updateWalletBalance(userId: string, amount: number, type: 'DEPOSIT' | 'WITHDRAWAL') {
        const wallet = await this.getWallet(userId);

        if (type === 'WITHDRAWAL' && wallet.balance < amount) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient funds' });
        }

        const newBalance = type === 'DEPOSIT' ? wallet.balance + amount : wallet.balance - amount;

        const prismaClient = prisma as any;

        return await prisma.$transaction([
            prismaClient.wallet.update({
                where: { userId },
                data: { balance: newBalance }
            }),
            prismaClient.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount,
                    type: type, // Matches enum directly
                    status: 'COMPLETED',
                    reference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                }
            })
        ]);
    }
}


export const authService = new AuthService();
