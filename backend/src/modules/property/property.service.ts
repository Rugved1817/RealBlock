import prisma from '../../prisma/client.js';
import { blockchainService } from '../blockchain/blockchain.service.js';
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

        // Determine recipient address (Custodial Fallback if missing)
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { walletAddress: true }
        });

        const userAddress = user?.walletAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

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

        // 5. Blockchain Transaction (Asynchronous / Best Effort for this demo)
        if (property.contractAddress) {
            try {
                // Mock ETH value (totalCost in Wei)
                // In production, this would involve a price feed OR the user pays directly.
                const valueWei = ethers.utils.parseEther((totalCost / 100000).toString()).toString();

                const txHash = await blockchainService.purchaseOnChain(
                    property.contractAddress,
                    userAddress,
                    sqftAmount,
                    valueWei
                );

                // Update transaction with hash and complete it
                await prisma.transaction.update({
                    where: { id: result.transaction.id },
                    data: {
                        transactionHash: txHash,
                        status: 'COMPLETED'
                    }
                });

                (result.transaction as any).transactionHash = txHash;
                (result.transaction as any).status = 'COMPLETED';
            } catch (error) {
                console.error('Blockchain purchase failed:', error);
                // Keep DB record but mark as failed or leave pending for manual review
                await prisma.transaction.update({
                    where: { id: result.transaction.id },
                    data: { status: 'FAILED' }
                });
                (result.transaction as any).status = 'FAILED';
            }
        } else {
            // No contract associated, just complete in DB
            await prisma.transaction.update({
                where: { id: result.transaction.id },
                data: { status: 'COMPLETED' }
            });
            (result.transaction as any).status = 'COMPLETED';
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

