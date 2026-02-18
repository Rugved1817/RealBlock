import { z } from 'zod';
import { router, publicProcedure } from '../../trpc/trpc.js';
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
});
