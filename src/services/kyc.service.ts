import { TRPCError } from '@trpc/server';
import { VerificationType, VerificationStatus, OverallKycStatus } from '@prisma/client';
import { kycRepository } from '../modules/kyc/kyc.repository.js';
import { cashfreeProvider } from '../modules/kyc/providers/cashfree.provider.js';

export class KycService {
    async getOrCreateProfile(userId: string) {
        let profile = await kycRepository.getProfileByUserId(userId);
        if (!profile) {
            profile = await kycRepository.createProfile(userId);
        }
        return profile;
    }

    async verifyPan(userId: string, panNumber: string, name: string) {
        const profile = await this.getOrCreateProfile(userId);

        // Check if already verified
        const existing = profile.verifications.find(v => v.type === VerificationType.PAN && v.status === VerificationStatus.VERIFIED);
        if (existing) throw new TRPCError({ code: 'BAD_REQUEST', message: 'PAN already verified' });

        const verification = await kycRepository.createVerification({
            userId,
            profileId: profile.id,
            type: VerificationType.PAN,
            status: VerificationStatus.INITIATED,
        });

        try {
            const result = await cashfreeProvider.verifyPan(panNumber, name);

            // Cashfree returns { valid: true/false } for PAN verification
            const isVerified = result.valid === true || result.status === 'VALID' || result.status === 'SUCCESS';

            await kycRepository.updateVerification(verification.id, {
                status: isVerified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
                metadata: result,
            });

            if (isVerified) {
                await this.checkAndCompleteKyc(profile.id, userId);
            }

            return {
                status: isVerified ? 'VERIFIED' : 'FAILED',
                referenceId: result.reference_id,
                registeredName: result.registered_name,
            };
        } catch (error: any) {
            await kycRepository.updateVerification(verification.id, {
                status: VerificationStatus.FAILED,
                failureReason: error.message,
            });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }

    async initiateAadhaar(userId: string, aadhaarNumber: string) {
        const profile = await this.getOrCreateProfile(userId);

        const verification = await kycRepository.createVerification({
            userId,
            profileId: profile.id,
            type: VerificationType.AADHAAR,
            status: VerificationStatus.INITIATED,
        });

        try {
            const result = await cashfreeProvider.initiateAadhaarOtp(aadhaarNumber);

            await kycRepository.updateVerification(verification.id, {
                status: VerificationStatus.PENDING,
                providerRefId: result.reference_id,
                metadata: result,
            });

            return { referenceId: result.reference_id };
        } catch (error: any) {
            await kycRepository.updateVerification(verification.id, {
                status: VerificationStatus.FAILED,
                failureReason: error.message,
            });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }

    async confirmAadhaar(userId: string, otp: string, referenceId: string) {
        const profile = await this.getOrCreateProfile(userId);
        const verification = await kycRepository.findVerificationByProviderRef(referenceId);

        if (!verification || verification.userId !== userId) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Verification record not found' });
        }

        try {
            const result = await cashfreeProvider.confirmAadhaarOtp(otp, referenceId);
            const isVerified = result.status === 'SUCCESS' || result.status === 'VALID';

            await kycRepository.updateVerification(verification.id, {
                status: isVerified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
                metadata: result,
            });

            if (isVerified) {
                await this.checkAndCompleteKyc(profile.id, userId);
            }

            return { status: isVerified ? 'VERIFIED' : 'FAILED' };
        } catch (error: any) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }

    async verifyBank(userId: string, accountNumber: string, ifsc: string, accountHolderName: string) {
        const profile = await this.getOrCreateProfile(userId);

        const verification = await kycRepository.createVerification({
            userId,
            profileId: profile.id,
            type: VerificationType.BANK,
            status: VerificationStatus.INITIATED,
        });

        try {
            const result = await cashfreeProvider.verifyBankAccount(accountNumber, ifsc);
            const isVerified = result.status === 'SUCCESS' || result.status === 'VALID';

            // Basic name match score check (simulated if provider doesn't give one directly)
            const nameMatchScore = result.name_match_score || (result.name === accountHolderName ? 100 : 0);

            await kycRepository.updateVerification(verification.id, {
                status: isVerified ? VerificationStatus.VERIFIED : VerificationStatus.FAILED,
                metadata: { ...result, nameMatchScore },
            });

            if (isVerified) {
                await this.checkAndCompleteKyc(profile.id, userId);
            }

            return { status: isVerified ? 'VERIFIED' : 'FAILED' };
        } catch (error: any) {
            await kycRepository.updateVerification(verification.id, {
                status: VerificationStatus.FAILED,
                failureReason: error.message,
            });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message });
        }
    }

    async checkAndCompleteKyc(profileId: string, userId: string) {
        const verifications = await kycRepository.getVerificationsByProfileId(profileId);

        const panVerified = verifications.some(v => v.type === VerificationType.PAN && v.status === VerificationStatus.VERIFIED);
        const aadhaarVerified = verifications.some(v => v.type === VerificationType.AADHAAR && v.status === VerificationStatus.VERIFIED);
        const bankVerified = verifications.some(v => v.type === VerificationType.BANK && v.status === VerificationStatus.VERIFIED);

        if (panVerified && aadhaarVerified && bankVerified) {
            await kycRepository.updateProfileStatus(profileId, OverallKycStatus.COMPLETED, new Date());
            await kycRepository.markUserVerified(userId);
        } else {
            await kycRepository.updateProfileStatus(profileId, OverallKycStatus.IN_PROGRESS);
        }
    }

    async getStatus(userId: string) {
        const profile = await kycRepository.getProfileByUserId(userId);
        if (!profile) return { status: OverallKycStatus.NOT_STARTED, verifications: [] };

        return {
            status: profile.overallStatus,
            verifications: profile.verifications.map(v => ({
                type: v.type,
                status: v.status,
            })),
        };
    }
}

export const kycService = new KycService();
