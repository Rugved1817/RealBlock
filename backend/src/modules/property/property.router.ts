import { z } from 'zod';
import { router, publicProcedure } from '../../trpc/trpc.js';
import { propertyService } from './property.service.js';

const PropertySchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    type: z.string(),
    assetValue: z.string(),
    irr: z.string(),
    yield: z.string(),
    progress: z.number(),
    minInvestment: z.string(),
    image: z.string(),
    status: z.string(),
    isFeatured: z.boolean(),
    totalSqft: z.number(),
    pricePerSqft: z.number(),
    sqftSold: z.number(),
    description: z.string(),
    locationMap: z.string(),
    tenantName: z.string(),
    tenantDescription: z.string(),
    tenantLogo: z.string(),
    highlights: z.array(z.string()),
    financials: z.any().nullable(),
    documents: z.any().nullable(),
    priceHistory: z.any().nullable(),
    createdAt: z.date().or(z.string()),
    updatedAt: z.date().or(z.string()),
});

export const propertyRouter = router({
    getAll: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties', tags: ['property'] } })
        .output(z.array(PropertySchema))
        .query(async () => {
            return await propertyService.getAllProperties();
        }),

    getFeatured: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties/featured', tags: ['property'] } })
        .output(z.array(PropertySchema))
        .query(async () => {
            return await propertyService.getFeaturedProperties();
        }),

    getById: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties/{id}', tags: ['property'] } })
        .input(z.object({ id: z.string() }))
        .output(PropertySchema.nullable())
        .query(async ({ input }) => {
            return await propertyService.getPropertyById(input.id);
        }),

    invest: publicProcedure
        .meta({ openapi: { method: 'POST', path: '/properties/{id}/invest', tags: ['property'] } })
        .input(z.object({ id: z.string(), userId: z.string(), sqftAmount: z.number() }))
        .output(z.any())
        .mutation(async ({ input }) => {
            return await propertyService.invest(input.userId, input.id, input.sqftAmount);
        }),
});
