import { z } from 'zod';
import { router, adminProcedure } from '../../trpc/trpc.js';
import prisma from '../../prisma/client.js';

const PropertyInputSchema = z.object({
    name: z.string().min(2),
    location: z.string().min(2),
    type: z.enum(['COMMERCIAL', 'WAREHOUSING', 'RESIDENTIAL', 'WAREHOUSE']),
    assetValue: z.string(),
    irr: z.string(),
    yield: z.string(),
    minInvestment: z.string(),
    image: z.string().url(),
    totalSqft: z.number().positive(),
    pricePerSqft: z.number().positive(),
    isFeatured: z.boolean().default(false),
    description: z.string().default('Premium property with high appreciation potential.'),
    locationMap: z.string().default('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'),
    tenantName: z.string().default(''),
    tenantDescription: z.string().default(''),
    tenantLogo: z.string().default('T'),
    highlights: z.array(z.string()).default([]),
});

export const adminRouter = router({
    // ── Properties ─────────────────────────────────────────────────────────────

    addProperty: adminProcedure
        .meta({ openapi: { method: 'POST', path: '/admin/properties', tags: ['admin'] } })
        .input(PropertyInputSchema)
        .output(z.any())
        .mutation(async ({ input }) => {
            const property = await prisma.property.create({
                data: {
                    ...input,
                    status: 'OPEN',
                    progress: 0,
                    sqftSold: 0,
                },
            });
            return property;
        }),

    updateProperty: adminProcedure
        .meta({ openapi: { method: 'PATCH', path: '/admin/properties/{id}', tags: ['admin'] } })
        .input(z.object({ id: z.string() }).merge(PropertyInputSchema.partial()))
        .output(z.any())
        .mutation(async ({ input }) => {
            const { id, ...data } = input;
            return await prisma.property.update({ where: { id }, data });
        }),

    deleteProperty: adminProcedure
        .meta({ openapi: { method: 'DELETE', path: '/admin/properties/{id}', tags: ['admin'] } })
        .input(z.object({ id: z.string() }))
        .output(z.any())
        .mutation(async ({ input }) => {
            return await prisma.property.delete({ where: { id: input.id } });
        }),

    // ── Transactions ────────────────────────────────────────────────────────────

    getAllTransactions: adminProcedure
        .meta({ openapi: { method: 'GET', path: '/admin/transactions', tags: ['admin'] } })
        .output(z.any())
        .query(async () => {
            return await prisma.transaction.findMany({
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    property: { select: { id: true, name: true, type: true, image: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }),

    // ── Users ────────────────────────────────────────────────────────────────────

    getAllUsers: adminProcedure
        .meta({ openapi: { method: 'GET', path: '/admin/users', tags: ['admin'] } })
        .output(z.any())
        .query(async () => {
            return await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isKycVerified: true,
                    totalInvestment: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        }),

    setUserRole: adminProcedure
        .meta({ openapi: { method: 'PATCH', path: '/admin/users/{id}/role', tags: ['admin'] } })
        .input(z.object({ id: z.string(), role: z.enum(['USER', 'ADMIN']) }))
        .output(z.any())
        .mutation(async ({ input }) => {
            return await prisma.user.update({
                where: { id: input.id },
                data: { role: input.role } as any,
            });
        }),

    // ── Stats ────────────────────────────────────────────────────────────────────

    getStats: adminProcedure
        .meta({ openapi: { method: 'GET', path: '/admin/stats', tags: ['admin'] } })
        .output(z.any())
        .query(async () => {
            const [totalUsers, totalProperties, totalTransactions, transactions] = await Promise.all([
                prisma.user.count(),
                prisma.property.count(),
                prisma.transaction.count(),
                prisma.transaction.findMany({ select: { amount: true, status: true } }),
            ]);

            const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
            const totalVolume = completedTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

            return { totalUsers, totalProperties, totalTransactions, totalVolume };
        }),
});
