import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../../trpc/trpc.js';
import { TRPCError } from '@trpc/server';
import { LoginSchema, SignupSchema } from './auth.validator.js';
import { authService } from './auth.service.js';

export const authRouter = router({
    signup: publicProcedure
        .meta({ openapi: { method: 'POST', path: '/auth/signup', tags: ['auth'] } })
        .input(SignupSchema)
        .output(z.object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
        }))
        .mutation(async ({ input }) => {
            return await authService.signup(input.email, input.password, input.name);
        }),

    login: publicProcedure
        .meta({ openapi: { method: 'POST', path: '/auth/login', tags: ['auth'] } })
        .input(LoginSchema)
        .output(z.object({
            token: z.string(),
            user: z.object({
                id: z.string(),
                email: z.string(),
                name: z.string().nullable(),
                isKycVerified: z.boolean(),
            }),
        }))
        .mutation(async ({ input }) => {
            return await authService.login(input.email, input.password);
        }),

    me: protectedProcedure
        .meta({ openapi: { method: 'GET', path: '/auth/me', tags: ['auth'] } })
        .output(z.object({
            id: z.string(),
            email: z.string(),
            name: z.string().nullable(),
            isKycVerified: z.boolean(),
        }))
        .query(async ({ ctx }) => {
            const user = await authService.getUserById(ctx.user!.id);
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found',
                });
            }
            return user;
        }),

    dashboard: protectedProcedure
        .meta({ openapi: { method: 'GET', path: '/auth/dashboard', tags: ['auth'] } })
        .output(z.object({
            totalInvestment: z.number(),
            totalSqft: z.number(),
            propertyCount: z.number(),
            transactions: z.array(z.object({
                id: z.string(),
                date: z.string(),
                property: z.string(),
                type: z.string(),
                status: z.string(),
                amount: z.number(),
                icon: z.string(),
            })),
        }))
        .query(async ({ ctx }) => {
            return await authService.getDashboardStats(ctx.user!.id);
        }),

    wallet: protectedProcedure
        .meta({ openapi: { method: 'GET', path: '/auth/wallet', tags: ['auth'] } })
        .output(z.object({
            balance: z.number(),
            currency: z.string(),
        }))
        .query(async ({ ctx }) => {
            const wallet = await authService.getWallet(ctx.user!.id);
            return {
                balance: wallet.balance,
                currency: wallet.currency
            };
        }),

    addMoney: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/auth/wallet/add', tags: ['auth'] } })
        .input(z.object({ amount: z.number().min(1) }))
        .output(z.any())
        .mutation(async ({ ctx, input }) => {
            return await authService.updateWalletBalance(ctx.user!.id, input.amount, 'DEPOSIT');
        }),

    withdrawMoney: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/auth/wallet/withdraw', tags: ['auth'] } })
        .input(z.object({ amount: z.number().min(1) }))
        .output(z.any())
        .mutation(async ({ ctx, input }) => {
            return await authService.updateWalletBalance(ctx.user!.id, input.amount, 'WITHDRAWAL');
        }),
});
