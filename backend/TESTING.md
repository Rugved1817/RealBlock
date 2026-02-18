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

> ## Documentation Index
> Fetch the complete documentation index at: https://www.cashfree.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# IFSC Verification V2

> Use this API to verify whether the IFSC information passed in the request is valid.

View the [test data](/docs/api-reference/vrs/data-to-test-integration#bank-numbers) and use the information to trigger the validations. The test data can be used only in the sandbox environment.



## OpenAPI

````yaml post /ifsc
openapi: 3.0.0
info:
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  contact:
    email: developers@cashfree.com
    name: API Support
    url: https://discord.com/invite/QdZkNSxXsB
  title: Cashfree Verification API's.
  version: '2023-12-18'
  description: >-
    Cashfree's Verification APIs provide different types of verification to our
    merchants.
servers:
  - description: Sandbox Server
    url: https://sandbox.cashfree.com/verification
  - description: Production Server
    url: https://api.cashfree.com/verification
security: []
tags:
  - name: Aadhaar
    description: Operations related to Aadhaar verification.
  - name: BAV V2
    description: Operations related to Bank account verification v2.
  - name: PAN
    description: Operations related to PAN verification.
  - name: Digilocker
    description: Operations related to Digilocker verification.
  - name: E-sign
    description: Operations related to E-sign verification.
  - name: Reverse Penny Drop
    description: Operations related to Reverse Penny Drop verification.
  - name: UPI Penny Drop
    description: Operations related to UPI Penny Drop verification.
  - name: IP
    description: Operation related to IP verification.
  - name: UPI
    description: Operations related to UPI verification.
  - name: Passport
    description: Operation related to Passport verification.
  - name: CIN
    description: Operation related to CIN verification.
  - name: Name Match
    description: Operation related to Name Match verification.
  - name: PAN to GSTIN
    description: Operation related to PAN to GSTIN.
  - name: Face Match
    description: Operation related to Face Match verification.
  - name: Voter ID
    description: Operation related to Voter ID verification.
  - name: Reverse Geocoding
    description: Operation related to Reverse Geocoding.
  - name: Vehicle RC
    description: Operation related to Vehicle RC verification.
  - name: Driving License
    description: Operation related to Driving License verification.
  - name: GSTIN
    description: Operation related to GSTIN verification.
  - name: Account Aggregator
    description: Operations related to Account aggregator.
  - name: OTPLess
    description: Operations related to OTPLess Verification.
  - name: 1-Click
    description: Operations related to 1-Click.
  - name: Smart OCR
    description: Operations related to Smart OCR.
  - name: Geocoding
    description: Operations related to Geocoding.
  - name: Udyam
    description: Operation related to Udyam verification.
  - name: PAN to Udyam
    description: Operation related to PAN to Udyam.
paths:
  /ifsc:
    post:
      tags:
        - IFSC
      summary: IFSC Verification V2
      description: >-
        Use this API to verify whether the IFSC information passed in the
        request is valid.


        View the [test
        data](/docs/api-reference/vrs/data-to-test-integration#bank-numbers) and
        use the information to trigger the validations. The test data can be
        used only in the sandbox environment.
      operationId: VrsIfscV2Verification
      parameters:
        - $ref: '#/components/parameters/x_cf_signature'
      requestBody:
        $ref: '#/components/requestBodies/IFSCv2RequestBody'
      responses:
        '200':
          $ref: '#/components/responses/IFSCv2ResponseBody'
        '400':
          $ref: '#/components/responses/400IFSCv2'
        '401':
          $ref: '#/components/responses/Response401'
        '403':
          $ref: '#/components/responses/Response403'
        '404':
          $ref: '#/components/responses/IfscVerification404Response'
        '409':
          $ref: '#/components/responses/Response409DuplicateId'
        '422':
          $ref: '#/components/responses/Response422'
        '429':
          $ref: '#/components/responses/Response429'
        '500':
          $ref: '#/components/responses/Response500V2'
        '502':
          $ref: '#/components/responses/Response502V2'
      security:
        - XClientID: []
          XClientSecret: []
components:
  parameters:
    x_cf_signature:
      description: >-
        Send the signature if two-factor authentication is selected as Public
        Key.  [More
        details](https://www.cashfree.com/docs/api-reference/vrs/getting-started#2fa-api-signature-generation)
      name: x-cf-signature
      in: header
      required: false
      schema:
        type: string
      example: ''
  requestBodies:
    IFSCv2RequestBody:
      description: Find the request parameters to retrieve the IFSC information
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IFSCv2RequestSchema'
  responses:
    IFSCv2ResponseBody:
      description: Success response for IFSC Verification V2
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/IFSCv2ResponseSchema'
          examples:
            VALID:
              value:
                verification_id: test_verification_id
                reference_id: 12345
                status: VALID
                bank: Bank Name
                ifsc: HDFC0000001
                neft: Live
                imps: Live
                rtgs: Live
                upi: Live
                ft: Live
                card: Live
                micr: 560751026
                nbin: 1234
                address: >-
                  GROUND FLOOR, 123, ABC CIRCLE, XYZ MAIN ROAD, BANGALORE -
                  560098
                city: BANGALORE
                state: KARNATAKA
                branch: BANGALORE - RAJA RAJESHWARI NAGAR BRANCH
                ifsc_subcode: HDFC0
                category: DIRECT_MEMBER
                swift_code: HDFCINBB
    400IFSCv2:
      description: Validation Errors IFSC V2 API.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Verification ID Missing:
              $ref: '#/components/examples/VerificationIdMissing'
            Verification ID With Special Chars:
              $ref: '#/components/examples/VerificationIdWithSpecialCharacter'
            Verification Id character limit exceeded:
              $ref: '#/components/examples/VerificationIDCharacterLimitExceeded'
            IFSC Missing:
              value:
                type: validation_error
                code: ifsc_missing
                message: ifsc is missing in the request.
            Invalid IFSC:
              value:
                type: validation_error
                code: ifsc_value_invalid
                message: ifsc should be valid.
            Client ID in Missing:
              value:
                type: validation_error
                code: x-client-id_missing
                message: x-client-id is missing in the request.
            Client Secret in Missing:
              value:
                type: validation_error
                code: x-client-secret_missing
                message: x-client-secret is missing in the request.
    Response401:
      description: Invalid client ID and client secret combination
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Invalid client ID and client secret combination:
              value:
                type: authentication_error
                code: authentication_failed
                message: Invalid clientId and clientSecret combination
    Response403:
      description: Authentication error (IP not whitelisted)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            IP not whitelisted:
              value:
                type: authentication_error
                code: ip_validation_failed
                message: >-
                  IP not whitelisted your current ip is 106.51.91.104.For IP
                  whitelisting assistance, visit our guide at
                  https://www.cashfree.com/docs/secure-id/get-started/integration/ip-whitelisting-verification
            x-cf-signature header missing:
              value:
                type: validation_error
                code: authentication_failed
                message: x-cf-signature missing in the request header
    IfscVerification404Response:
      description: 404 response for ifsc verification
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Ifsc not Found:
              value:
                type: not_found_error
                code: ifsc_not_found
                message: IFSC not found. Please try again with valid IFSC
    Response409DuplicateId:
      description: Conflict error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Conflict Error:
              value:
                type: validation_error
                code: verification_id_already_exists
                message: verification ID already exists
    Response422:
      description: Validation error because of insufficient balance to process this request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Insufficient balance:
              value:
                type: validation_error
                code: insufficient_balance
                message: Insufficient balance to process this request
    Response429:
      description: Rate limit exceed error.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Rate limit error per operation:
              value:
                type: rate_limit_error
                code: too_many_requests_per_operation
                message: Too many requests for this operation, rate limit reached
            Rate limit error per IP:
              value:
                type: rate_limit_error
                code: too_many_requests_per_ip
                message: Too many requests from the IP, rate limit reached
    Response500V2:
      description: Internal error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Internal Server Error:
              value:
                type: internal_error
                code: verification_failed
                message: something went wrong
    Response502V2:
      description: Gateway error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Bad Gateway:
              value:
                type: internal_error
                code: verification_failed
                message: verification attempt failed
  schemas:
    IFSCv2RequestSchema:
      type: object
      required:
        - verification_id
        - ifsc
      properties:
        verification_id:
          type: string
          description: >-
            It is the unique ID you create to identify the verification request.
            The maximum character limit is 50. Only alphaumeric, period (.),
            hyphen (-), and underscore ( _ ) are allowed.
          example: test_verification_id
          default: test_verification_id
        ifsc:
          description: >-
            It is the IFSC information of the bank account to be validated. It
            should be an alphanumeric value of 11 characters. The first 4
            characters should be alphabets, the 5th character should be a 0, and
            the remaining 6 characters should be numerals.
          type: string
          example: HDFC0000001
          default: HDFC0000001
    IFSCv2ResponseSchema:
      type: object
      properties:
        verification_id:
          type: string
          description: >-
            It displays the unique ID you created to identify the verification
            ID.
          example: test_verification_id
        reference_id:
          type: integer
          description: >-
            It displays the unique ID created by Cashfree Payments for reference
            purposes.

            format: `int64`
          example: 123
        status:
          type: string
          description: >-
            It displays the status of the IFSC information. Possible values are:
            - `VALID`: IFSC provided is valid.
          example: VALID
        bank:
          type: string
          description: It displays the name of the bank.
          example: Bank Name
        ifsc:
          type: string
          description: It displays the IFSC information.
          example: HDFC0000001
        neft:
          type: string
          description: It displays the status of NEFT.
          example: Live
        imps:
          type: string
          description: It displays the status of IMPS.
          example: Live
        rtgs:
          type: string
          description: It displays the status of RTGS.
          example: Live
        upi:
          type: string
          description: It displays the status of UPI.
          example: Live
        ft:
          type: string
          description: It displays the status of fund transfer.
          example: Live
        card:
          type: string
          description: It displays the status of card.
          example: Live
        micr:
          type: integer
          description: It displays the MICR code that can be used to identify the bank.
          example: 560751026
        nbin:
          type: integer
          description: >-
            It displays the National Bank Identification Number (NBIN)
            information.
          example: 1234
        address:
          type: string
          description: It displays the physical address information of the branch.
          example: GROUND FLOOR, 123, ABC CIRCLE, XYZ MAIN ROAD, BANGALORE - 560098
        city:
          type: string
          description: It displays the city name where the branch is located.
          example: BANGALORE
        state:
          type: string
          description: It displays the name of the state where the branch is located.
          example: KARNATAKA
        branch:
          type: string
          description: It displays the name of the branch.
          example: BANGALORE - RAJA RAJESHWARI NAGAR BRANCH
        ifsc_subcode:
          type: string
          description: It displays the subcode of the IFSC information.
          example: HDFC0
        category:
          type: string
          description: It displays the category of the bank.
          example: DIRECT_MEMBER
        swift_code:
          type: string
          description: >-
            It displays the code that identifies banks and financial
            institutions worldwide. The code helps pinpoint the specific bank.
          example: HDFCINBB
    ErrorResponseSchema:
      type: object
      properties:
        code:
          type: string
          example: x-client-id_missing
        error:
          type: object
          example:
            ref_id: 102
        message:
          type: string
          example: x-client-id is missing in the request.
          description: It displays the outcome of the error.
        type:
          type: string
          example: validation_error
          description: It displays the type of error.
  examples:
    VerificationIdMissing:
      value:
        type: validation_error
        code: verification_id_missing
        message: verification_id is missing in the request.
    VerificationIdWithSpecialCharacter:
      value:
        type: validation_error
        code: verification_id_value_invalid
        message: >-
          verification_id can include only alphanum, dot, hyphen and
          underscores.
    VerificationIDCharacterLimitExceeded:
      value:
        type: validation_error
        code: verification_id_length_exceeded
        message: verification_id can include a maximum of 50 characters.
  securitySchemes:
    XClientID:
      type: apiKey
      in: header
      name: x-client-id
      description: >-
        Your unique client identifier issued by Cashfree. You can find this in
        your [Merchant
        Dashboard](https://merchant.cashfree.com/verificationsuite/developers/api-keys).
    XClientSecret:
      type: apiKey
      in: header
      name: x-client-secret
      description: >-
        The secret key associated with your client ID. Use this to authenticate
        your API requests. You can find this in your [Merchant
        Dashboard](https://merchant.cashfree.com/verificationsuite/developers/api-keys).

````
