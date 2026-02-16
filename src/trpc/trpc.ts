import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-to-openapi';
import prisma from '../prisma/client.js';

export type Context = {
    user?: { id: string; email: string };
};

export const createContext = async ({
    req,
    res,
}: CreateExpressContextOptions): Promise<Context> => {
    // In a real app, you would verify a JWT here
    // For this implementation, we'll simulate a user for testing
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Extract token: handle both "Bearer token" and "token" formats
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;

        // For any test/dummy token, auto-create user with that token as ID
        if (token === 'dummy-id' || token.startsWith('test-')) {
            // Generate email based on token to ensure uniqueness
            const emailFromToken = token + '@realblock.com';

            const testUser = await prisma.user.upsert({
                where: { id: token },
                update: {},
                create: {
                    id: token,
                    email: emailFromToken,
                    isKycVerified: false,
                },
            });
            return { user: { id: testUser.id, email: testUser.email } };
        }

        // Basic simulation: token is the user ID
        const user = await prisma.user.findUnique({ where: { id: token } });
        if (user) {
            return { user: { id: user.id, email: user.email } };
        }
    }
    return {};
};

const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
    if (!opts.ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return opts.next({
        ctx: {
            user: opts.ctx.user,
        },
    });
});
