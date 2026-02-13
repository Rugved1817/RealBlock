import { router } from './trpc.js';
import { kycRouter } from '../modules/kyc/kyc.router.js';
import { tokenRouter } from '../modules/token/token.router.js';

export const appRouter = router({
    kyc: kycRouter,
    token: tokenRouter,
});

export type AppRouter = typeof appRouter;
