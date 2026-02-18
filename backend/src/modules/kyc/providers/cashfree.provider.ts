import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class CashfreeKycProvider {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.CASHFREE_BASE_URL || 'https://sandbox.cashfree.com/verification',
            headers: {
                'x-client-id': process.env.CASHFREE_CLIENT_ID || '',
                'x-client-secret': process.env.CASHFREE_CLIENT_SECRET || '',
                'Content-Type': 'application/json',
            },
        });
    }

    async verifyPan(pan: string, name: string) {
        try {
            console.log('[Cashfree] Verifying PAN:', { pan, name });
            const response = await this.client.post('/pan', {
                pan,
                name,
            });
            console.log('[Cashfree] PAN Response:', JSON.stringify(response.data, null, 2));
            return response.data;
        } catch (error: any) {
            console.error('[Cashfree] PAN Error:', error.response?.data || error.message);
            throw new Error(`Cashfree PAN Verification failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async initiateAadhaarOtp(aadhaarNumber: string) {
        try {
            const response = await this.client.post('/aadhaar/otp/initiate', {
                aadhaar_number: aadhaarNumber,
            });
            return response.data; // Should return referenceId
        } catch (error: any) {
            throw new Error(`Cashfree Aadhaar OTP Initiation failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async confirmAadhaarOtp(otp: string, referenceId: string) {
        try {
            const response = await this.client.post('/aadhaar/otp/verify', {
                otp,
                reference_id: referenceId,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`Cashfree Aadhaar OTP Verification failed: ${error.response?.data?.message || error.message}`);
        }
    }

    async verifyBankAccount(accountNumber: string, ifsc: string) {
        try {
            const response = await this.client.get('/bank-account', {
                params: {
                    bank_account: accountNumber,
                    ifsc: ifsc,
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`Cashfree Bank Account Verification failed: ${error.response?.data?.message || error.message}`);
        }
    }
}

export const cashfreeProvider = new CashfreeKycProvider();
