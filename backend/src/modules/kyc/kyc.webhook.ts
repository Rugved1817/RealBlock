import { Request, Response } from 'express';
import { verifyCashfreeSignature } from '../../utils/crypto.js';
import { kycRepository } from './kyc.repository.js';
import { kycService } from '../../services/kyc.service.js';
import { VerificationStatus } from '@prisma/client';

export const handleCashfreeWebhook = async (req: Request, res: Response) => {
    // PRIORITY 1: Check for test/monitoring events FIRST
    const eventType = (req.body?.type || req.body?.event || '').toLowerCase();
    const isTestEvent =
        eventType.includes('test') ||
        eventType === 'low_balance_alert';

    if (isTestEvent) {
        console.log('[Webhook] Test/Alert event detected:', eventType);
        console.log('[Webhook] Responding 200 OK for URL verification.');
        return res.status(200).json({ message: 'Webhook URL verified', event: eventType });
    }

    // PRIORITY 2: For real KYC events, verify signatures
    const signatureHeaders = [
        'x-cashfree-signature',
        'x-webhook-signature',
        'x-cf-signature',
        'signature',
        'x-signature'
    ];

    let signature: string | undefined;
    for (const h of signatureHeaders) {
        if (req.headers[h]) {
            signature = req.headers[h] as string;
            console.log(`[Webhook] Found signature in header: ${h}`);
            break;
        }
    }

    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET || '';
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    console.log('[Webhook] Processing KYC event');
    console.log('[Webhook] Body:', JSON.stringify(req.body));
    console.log('[Webhook] Signature:', signature);

    if (!signature) {
        console.error('[Webhook] Signature missing for KYC event');
        return res.status(401).json({ message: 'Signature required for KYC events' });
    }

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
