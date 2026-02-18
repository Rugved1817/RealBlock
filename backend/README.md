# RealBlock Backend API

Express + tRPC backend for RealBlock KYC and token platform.

## Features

- ✅ JWT Authentication
- ✅ KYC Verification (PAN, Aadhaar, Bank)
- ✅ Token Purchase API
- ✅ Cashfree Integration
- ✅ PostgreSQL Database (Neon)

## Setup

### Install Dependencies
```bash
npm install
```

### Environment Variables
Create `.env`:
```bash
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CASHFREE_CLIENT_ID=...
CASHFREE_CLIENT_SECRET=...
CASHFREE_WEBHOOK_SECRET=...
CASHFREE_BASE_URL=https://sandbox.cashfree.com/verification/...
```

### Run Database Migrations
```bash
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT

### KYC
- `POST /api/kyc/pan-verify` - Verify PAN
- `GET /api/kyc/status` - Get KYC status

### Token
- `POST /api/token/purchase` - Purchase tokens

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/      # Authentication
│   │   ├── kyc/       # KYC verification
│   │   └── token/     # Token purchase
│   ├── prisma/        # Database schema
│   ├── trpc/          # tRPC setup
│   ├── app.ts         # Express app
│   └── server.ts      # Server entry
├── dist/              # Compiled output
└── package.json
```

## Tech Stack

- **Framework**: Express.js
- **API**: tRPC
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **KYC Provider**: Cashfree

## Deployment

Configured for Render.com deployment. Just push to GitHub!
