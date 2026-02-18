import { router, protectedProcedure } from '../../trpc/trpc.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import prisma from '../../prisma/client.js';

export const tokenRouter = router({
    purchase: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/token/purchase', tags: ['token'] } })
        .input(z.object({
            amount: z.number().positive(),
            tokenId: z.string(),
        }))
        .output(z.object({
            success: z.boolean(),
            transactionHash: z.string(),
            message: z.string(),
        }))
        .mutation(async ({ input, ctx }) => {
            // 1. Check user.isKycVerified
            const user = await prisma.user.findUnique({
                where: { id: ctx.user.id }
            });

            if (!user || !user.isKycVerified) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'KYC_REQUIRED',
                });
            }

            // 2. Logic for token purchase (simulated)
            return {
                success: true,
                transactionHash: "0x" + Math.random().toString(16).slice(2, 66),
                message: "Purchase successful"
            };
        }),
});
