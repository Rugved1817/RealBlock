import { VerificationStatus, VerificationType } from '@prisma/client';

export interface VerificationResult {
    status: 'VERIFIED' | 'FAILED' | 'PENDING' | 'INITIATED';
    message?: string;
    referenceId?: string;
}

export interface KycStatusResponse {
    status: string;
    verifications: {
        type: VerificationType;
        status: VerificationStatus;
    }[];
}
