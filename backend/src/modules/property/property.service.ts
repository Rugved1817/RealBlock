import prisma from '../../prisma/client.js';

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

        // 2. Calculate available sqft (assuming soldTokens tracks sqft sold)
        // Note: In schema, soldTokens is defined as Float @default(0) but likely meant to be sqftSold?
        // Wait, schema has `sqftSold Float`. But interface had `soldTokens`.
        // Let's use `sqftSold`.
        // Actually, property.sqftSold relates to property.totalSqft

        const availableSqft = property.totalSqft - property.sqftSold;

        if (sqftAmount > availableSqft) {
            throw new Error(`Insufficient units available. Only ${availableSqft} sqft remaining.`);
        }

        // 3. Create Transaction and Update Property in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create Transaction Record
            const transaction = await tx.transaction.create({
                data: {
                    userId,
                    propertyId,
                    sqft: sqftAmount,
                    amount: sqftAmount * property.pricePerSqft, // Calculate total amount
                    status: 'COMPLETED' // Simplified flow
                }
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

            return { transaction, updatedProperty };
        });

        return result;
    }
}

export const propertyService = new PropertyService();
