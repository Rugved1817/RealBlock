import crypto from 'crypto';

export function verifyCashfreeSignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('base64');

    return expectedSignature === signature;
}
