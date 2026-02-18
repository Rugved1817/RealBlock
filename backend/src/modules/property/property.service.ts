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
}

export const propertyService = new PropertyService();
