import { router, protectedProcedure } from '../../trpc/trpc.js';
import {
    PanVerifySchema, AadhaarInitiateSchema, AadhaarConfirmSchema, BankVerifySchema,
    GenericKycResponseSchema, AadhaarInitiateResponseSchema, KycStatusSchema
} from './kyc.validator.js';
import { kycService } from '../../services/kyc.service.js';

export const kycRouter = router({
    panVerify: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/kyc/pan-verify', tags: ['kyc'] } })
        .input(PanVerifySchema)
        .output(GenericKycResponseSchema)
        .mutation(async ({ input, ctx }) => {
            return kycService.verifyPan(ctx.user.id, input.panNumber, input.name);
        }),

    aadhaarInitiate: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/kyc/aadhaar-initiate', tags: ['kyc'] } })
        .input(AadhaarInitiateSchema)
        .output(AadhaarInitiateResponseSchema)
        .mutation(async ({ input, ctx }) => {
            return kycService.initiateAadhaar(ctx.user.id, input.aadhaarNumber);
        }),

    aadhaarConfirm: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/kyc/aadhaar-confirm', tags: ['kyc'] } })
        .input(AadhaarConfirmSchema)
        .output(GenericKycResponseSchema)
        .mutation(async ({ input, ctx }) => {
            return kycService.confirmAadhaar(ctx.user.id, input.otp, input.referenceId);
        }),

    bankVerify: protectedProcedure
        .meta({ openapi: { method: 'POST', path: '/kyc/bank-verify', tags: ['kyc'] } })
        .input(BankVerifySchema)
        .output(GenericKycResponseSchema)
        .mutation(async ({ input, ctx }) => {
            return kycService.verifyBank(ctx.user.id, input.accountNumber, input.ifsc, input.accountHolderName);
        }),

    status: protectedProcedure
        .meta({ openapi: { method: 'GET', path: '/kyc/status', tags: ['kyc'] } })
        .output(KycStatusSchema)
        .query(async ({ ctx }) => {
            return kycService.getStatus(ctx.user.id);
        }),
});
