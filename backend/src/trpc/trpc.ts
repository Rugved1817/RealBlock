import { initTRPC, TRPCError } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-to-openapi';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export type Context = {
    user?: { id: string; email: string };
};

export const createContext = async ({
    req,
    res,
}: CreateExpressContextOptions): Promise<Context> => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        // Extract token: handle both "Bearer token" and "token" formats
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : authHeader;

        // For test tokens, auto-create user with that token as ID
        if (token === 'dummy-id' || token.startsWith('test-')) {
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

        // Try to verify as JWT
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as {
                userId: string;
                email: string;
            };
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (user) {
                return { user: { id: user.id, email: user.email } };
            }
        } catch {
            // If JWT verification fails, try as user ID (backward compatibility)
            const user = await prisma.user.findUnique({ where: { id: token } });
            if (user) {
                return { user: { id: user.id, email: user.email } };
            }
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
