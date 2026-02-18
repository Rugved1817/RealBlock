> ## Documentation Index
> Fetch the complete documentation index at: https://www.cashfree.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Verify

> Use this API to check the existence of a PAN. If the PAN is valid, the response returns the registered name and the PAN type (Individual or Business).

View the [test data](https://www.cashfree.com/docs/api-reference/vrs/data-to-test-integration#pan) and use the information to trigger the validations. The test data can be used only in the sandbox environment.

<Note>
  The name returned by the API may differ from the name printed on the physical PAN card. The API returns the registered name from the Income Tax Department's records, which is the authoritative source and may not match the name displayed on the card.
</Note>


## OpenAPI

````yaml post /pan
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
  /pan:
    post:
      tags:
        - PAN
      summary: Verify
      description: >-
        Use this API to check the existence of a PAN. If the PAN is valid, the
        response returns the registered name and the PAN type (Individual or
        Business).


        View the [test
        data](https://www.cashfree.com/docs/api-reference/vrs/data-to-test-integration#pan)
        and use the information to trigger the validations. The test data can be
        used only in the sandbox environment.
      operationId: VrsPanVerification
      parameters:
        - $ref: '#/components/parameters/x_cf_signature'
        - $ref: '#/components/parameters/x_api_version'
      requestBody:
        $ref: '#/components/requestBodies/PanVerificationRequest'
      responses:
        '200':
          $ref: '#/components/responses/GetVerifyPanResponse'
        '400':
          $ref: '#/components/responses/Response400Pan'
        '401':
          $ref: '#/components/responses/Response401'
        '403':
          $ref: '#/components/responses/Response403'
        '422':
          $ref: '#/components/responses/Response422'
        '429':
          $ref: '#/components/responses/Response429'
        '500':
          $ref: '#/components/responses/Response500AllCases'
        '502':
          $ref: '#/components/responses/Response502V2AuthorizedSourceDown'
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
    x_api_version:
      description: >-
        It is the API version. To receive the aadhaar seeding status in the
        response, use any date after 2022-09-12
      name: x-api-version
      in: header
      required: false
      schema:
        type: string
      example: '2022-10-26'
  requestBodies:
    PanVerificationRequest:
      description: Find the request parameters to verify PAN.
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/PanRequestSchema'
  responses:
    GetVerifyPanResponse:
      description: Success response for verifiying PAN information
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GetVerifyPanResponseSchema'
          examples:
            Valid PAN Individual:
              value:
                pan: ABCPV1234D
                type: Individual
                reference_id: 161
                name_provided: JOHN DOE
                registered_name: JOHN DOE
                valid: true
                message: PAN verified successfully
                name_match_score: 100
                name_match_result: DIRECT_MATCH
                aadhaar_seeding_status: 'Y'
                last_updated_at: 01/01/2019
                name_pan_card: JOHN DOE
                pan_status: VALID
                aadhaar_seeding_status_desc: Aadhaar is linked to PAN
            Valid PAN Business:
              value:
                pan: AAOCS4553K
                type: Company
                reference_id: 1318808
                name_provided: saanchi
                registered_nam: SAANCHI ENERGY PRIVATE LIMITED
                valid: true
                message: PAN verified successfully
                name_match_score: 60
                name_match_result: MODERATE_PARTIAL_MATCH
                aadhaar_seeding_status: NA
                last_updated_at: 25/05/2017
                name_pan_card: null
                pan_status: VALID
                aadhaar_seeding_status_desc: Aadhar Seeding is not Applicable
            Invalid PAN:
              value:
                pan: ABCPV1234D
                reference_id: 17974435
                name_provided: null
                valid: false
                message: Invalid PAN
                name_match_score: 0
                name_match_result: '-'
    Response400Pan:
      description: Validation errors for Verify PAN Sync API
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Invalid PAN Format:
              $ref: '#/components/examples/InvalidPanFormat'
            Empty PAN field:
              $ref: '#/components/examples/EmptyPanField'
            Client ID/Client Secret in Missing:
              $ref: '#/components/examples/XClientIdMissing'
            Using-Test-Credentials-in-Prod:
              $ref: '#/components/examples/UsingTestCredentialsInProd'
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
    Response500AllCases:
      description: Internal errors
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponseSchema'
          examples:
            Internal Server Error:
              value:
                type: internal_error
                code: verification_failed
                message: Unable to validate, please retry later
                error:
                  refId: 209
            Unknown Error Occured:
              value:
                type: internal_error
                code: api_error
                message: something went wrong, please try after some time
    Response502V2AuthorizedSourceDown:
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
                message: >-
                  Authorised source is temporarily unavailable, please try again
                  shortly
  schemas:
    PanRequestSchema:
      type: object
      example:
        pan: ABCPV1234D
        name: Gurav
      required:
        - pan
      properties:
        pan:
          description: >-
            It is the unique 10-character alphanumeric identifier of the
            individual issued by the Income Tax Department. The first 5 should
            be alphabets followed by 4 numbers and the 10th character should
            again be an alphabet.
          type: string
          example: ABCPV1234D
          default: ABCPV1234D
        name:
          description: >-
            It is the name of the individual as per the PAN records. In case of
            special characters, only space, dot (.), hyphen (-), slash (/), and
            ampersand (&) are allowed.
          type: string
          example: John Doe
          default: John Doe
    GetVerifyPanResponseSchema:
      type: object
      properties:
        pan:
          type: string
          example: ABCPV1234D
          description: >-
            It displays the unique 10-character alphanumeric identifier issued
            by the Income Tax Department.
        type:
          type: string
          description: It displays the type of the PAN issued.
          example: Individual
        reference_id:
          type: integer
          description: >-
            It displays the unique ID created by Cashfree Payments for reference
            purposes.

            format: `int64`
          format: int64
          example: 161
        name_provided:
          type: string
          description: It displays the name entered in the API request.
          example: JOHN DOE
        registered_name:
          type: string
          description: It displays the PAN registered name.
          example: JOHN DOE
        valid:
          type: boolean
          description: It displays the status of the PAN card.
          example: true
        father_name:
          type: string
          description: It displays the father's name of the PAN card holder.
          example: ''
        message:
          type: string
          description: It displays details about the success or failure of the API request.
          example: PAN verified successfully
        name_match_score:
          type: string
          description: It displays the score for the name match verification.
          example: '100.00'
        name_match_result:
          type: string
          description: >-
            It displays the result of the name match verification. Possible
            values are:

            - `DIRECT_MATCH`

            - `GOOD_PARTIAL_MATCH`

            - `MODERATE_PARTIAL_MATCH`

            - `POOR_PARTIAL_MATCH`

            - `NO_MATCH`
          example: DIRECT_MATCH
        aadhaar_seeding_status:
          type: string
          description: >-
            It displays additional information of the linking of aadhaar and PAN
            card. Possible values are:

            - `Y`: "Aadhaar is linked to pan"

            - `R`: "Aadhaar is not linked to pan"

            - `NA`: "Not applicable, in case of business pan"
          example: 'Y'
        last_updated_at:
          type: string
          description: It displays the last updated date.
          example: 01/01/2019
        name_pan_card:
          type: string
          description: It displays the name displayed on the PAN card.
          example: JOHN DOE
        pan_status:
          type: string
          description: |-
            It displays the status of the PAN card. Possible values are:
            - `VALID`
            - `INVALID`
            - `DELETED`
            - `DEACTIVATED`
          example: VALID
        aadhaar_seeding_status_desc:
          type: string
          description: >-
            It displays additional information of the linking of aadhaar and PAN
            card.
          example: Aadhaar is linked to PAN
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
    InvalidPanFormat:
      value:
        type: validation_error
        code: pan_length_short
        message: Enter valid PAN.
    EmptyPanField:
      value:
        type: validation_error
        code: pan_missing
        message: pan is missing in the request.
    XClientIdMissing:
      value:
        type: validation_error
        code: x-client-id_missing
        message: x-client-id is missing in the request.
    UsingTestCredentialsInProd:
      value:
        type: validation_error
        code: x-client-secret_value_invalid
        message: Client secret belongs to test environment
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