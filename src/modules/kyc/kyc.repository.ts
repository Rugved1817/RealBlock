import { Prisma, VerificationStatus, VerificationType, OverallKycStatus } from '@prisma/client';
import prisma from '../../prisma/client.js';

export class KycRepository {
    async getProfileByUserId(userId: string) {
        return prisma.kycProfile.findUnique({
            where: { userId },
            include: { verifications: true },
        });
    }

    async createProfile(userId: string) {
        return prisma.kycProfile.create({
            data: { userId },
            include: { verifications: true },
        });
    }

    async createVerification(data: {
        userId: string;
        profileId: string;
        type: VerificationType;
        status: VerificationStatus;
        providerRefId?: string;
        metadata?: any;
    }) {
        return prisma.kycVerification.create({
            data,
        });
    }

    async updateVerification(id: string, data: Partial<Prisma.KycVerificationUpdateInput>) {
        return prisma.kycVerification.update({
            where: { id },
            data,
        });
    }

    async findVerificationByProviderRef(providerRefId: string) {
        return prisma.kycVerification.findFirst({
            where: { providerRefId },
        });
    }

    async updateProfileStatus(profileId: string, status: OverallKycStatus, completedAt?: Date) {
        return prisma.kycProfile.update({
            where: { id: profileId },
            data: {
                overallStatus: status,
                completedAt: completedAt || undefined,
            },
        });
    }

    async markUserVerified(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { isKycVerified: true },
        });
    }

    async getVerificationsByProfileId(profileId: string) {
        return prisma.kycVerification.findMany({
            where: { profileId },
        });
    }
}

export const kycRepository = new KycRepository();
