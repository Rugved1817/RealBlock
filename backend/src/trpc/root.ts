import { router } from './trpc.js';
import { authRouter } from '../modules/auth/auth.router.js';
import { kycRouter } from '../modules/kyc/kyc.router.js';
import { tokenRouter } from '../modules/token/token.router.js';
import { propertyRouter } from '../modules/property/property.router.js';
import { adminRouter } from '../modules/admin/admin.router.js';

export const appRouter = router({
    auth: authRouter,
    kyc: kycRouter,
    token: tokenRouter,
    property: propertyRouter,
    admin: adminRouter,
});

export type AppRouter = typeof appRouter;
