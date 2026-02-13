import { z } from 'zod';

export const PanVerifySchema = z.object({
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
    name: z.string().min(1, "Name is required"),
});

export const AadhaarInitiateSchema = z.object({
    aadhaarNumber: z.string().length(12, "Aadhaar must be 12 digits").regex(/^[0-9]+$/, "Aadhaar must contain only digits"),
});

export const AadhaarConfirmSchema = z.object({
    referenceId: z.string().min(1, "Reference ID is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export const BankVerifySchema = z.object({
    accountNumber: z.string().min(9).max(18),
    ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"),
    accountHolderName: z.string().min(1),
});

export const KycStatusSchema = z.object({
    status: z.string(),
    verifications: z.array(z.object({
        type: z.string(),
        status: z.string(),
    })),
});

export const GenericKycResponseSchema = z.object({
    status: z.string(),
});

export const AadhaarInitiateResponseSchema = z.object({
    referenceId: z.string(),
});
