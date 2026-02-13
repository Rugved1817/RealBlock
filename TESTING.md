# How to Test the KYC Module

## 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cashfree API credentials (optional for logic testing)

## 2. Setup
1. Clone the repository and navigate to the root.
2. Install dependencies: `npm install`
3. Configure `.env` file with your database URL and Cashfree credentials.
4. Generate Prisma client: `npm run prisma:generate`
5. Run migrations: `npm run prisma:migrate` (or `npx prisma db push` for quick setup)
6. Start the development server: `npm run dev`

## 3. Testing tRPC Endpoints
The tRPC endpoints are exposed via OpenAPI and documented with Swagger at:
`http://localhost:4000/docs`

### User Simulation
To simulate a user, pass the User ID in the `Authorization` header.
Example: `Authorization: <uuid-from-user-table>`

### KYC Flow:
1. **PAN Verification**:
   - `POST /api/kyc/pan-verify`
   - Payload: `{ "panNumber": "ABCDE1234F", "name": "John Doe" }`

2. **Aadhaar Initiation**:
   - `POST /api/kyc/aadhaar-initiate`
   - Payload: `{ "aadhaarNumber": "123456789012" }`
   - Returns `referenceId`.

3. **Aadhaar Confirmation**:
   - `POST /api/kyc/aadhaar-confirm`
   - Payload: `{ "referenceId": "...", "otp": "123456" }`

4. **Bank Verification**:
   - `POST /api/kyc/bank-verify`
   - Payload: `{ "accountNumber": "123456789", "ifsc": "HDFC0001234", "accountHolderName": "John Doe" }`

5. **KYC Status**:
   - `GET /api/kyc/status`
   - Returns the current overall status and step-by-step verification status.

## 4. Testing Token Purchase (Gating)
- `POST /api/token/purchase`
- Payload: `{ "amount": 100, "tokenId": "token-123" }`
- Behavior:
  - If KYC is NOT COMPLETED → Returns `403 FORBIDDEN (KYC_REQUIRED)`
  - If KYC is COMPLETED → Returns `200 OK`

## 5. Webhook Testing
- `POST /webhooks/cashfree/kyc`
- Headers: `x-cashfree-signature: <hmac-sha256-signature>`
- Payload: `{ "type": "verification_completed", "data": { "reference_id": "...", "status": "SUCCESS" } }`
- Note: Requires valid HMAC signature or temporary bypass in code for testing.
