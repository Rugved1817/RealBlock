import { Request, Response } from 'express';
import { verifyCashfreeSignature } from '../../utils/crypto.js';
import { kycRepository } from './kyc.repository.js';
import { kycService } from '../../services/kyc.service.js';
import { VerificationStatus } from '@prisma/client';

export const handleCashfreeWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['x-cashfree-signature'] as string;
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || '';

    // Use raw body for signature verification
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    const isVerified = verifyCashfreeSignature(rawBody, signature, webhookSecret);
    console.log(`[Webhook] Signature verification: ${isVerified ? 'PASSED' : 'FAILED'}`);

    if (!isVerified) {
        console.error('Invalid signature for Cashfree webhook');
        return res.status(401).json({ message: 'Invalid signature' });
    }

    const { type, data } = req.body;
    const providerRefId = data?.reference_id;

    if (!providerRefId) {
        return res.status(200).send('OK'); // Still return 200 for idempotency
    }

    const verification = await kycRepository.findVerificationByProviderRef(providerRefId);
    if (!verification) {
        console.warn(`Verification record not found for ref: ${providerRefId}`);
        return res.status(200).send('OK');
    }

    // Already verified or handled? Avoid redundant updates
    if (verification.status === VerificationStatus.VERIFIED) {
        return res.status(200).send('OK');
    }

    const status = data.status === 'SUCCESS' ? VerificationStatus.VERIFIED : VerificationStatus.FAILED;

    await kycRepository.updateVerification(verification.id, {
        status,
        metadata: { ...((verification.metadata as object) || {}), webhookData: data },
        failureReason: status === VerificationStatus.FAILED ? data.reason : null,
    });

    if (status === VerificationStatus.VERIFIED) {
        await kycService.checkAndCompleteKyc(verification.profileId, verification.userId);
    }

    return res.status(200).send('OK');
};
