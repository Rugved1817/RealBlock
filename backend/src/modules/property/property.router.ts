import { z } from 'zod';
import { router, publicProcedure } from '../../trpc/trpc.js';
import { propertyService } from './property.service.js';

export const propertyRouter = router({
    getAll: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties', tags: ['property'] } })
        .output(z.array(z.any()))
        .query(async () => {
            return await propertyService.getAllProperties();
        }),

    getFeatured: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties/featured', tags: ['property'] } })
        .output(z.array(z.any()))
        .query(async () => {
            return await propertyService.getFeaturedProperties();
        }),

    getById: publicProcedure
        .meta({ openapi: { method: 'GET', path: '/properties/{id}', tags: ['property'] } })
        .input(z.object({ id: z.string() }))
        .output(z.any().nullable())
        .query(async ({ input }) => {
            return await propertyService.getPropertyById(input.id);
        }),
});
