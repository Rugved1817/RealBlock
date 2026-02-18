import prisma from '../../prisma/client.js';

export class PropertyService {
    async getAllProperties() {
        console.log('Fetching all properties...');
        const props = await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        console.log(`Found ${props.length} properties`);
        return props;
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
