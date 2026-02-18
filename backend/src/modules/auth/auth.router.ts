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
});
