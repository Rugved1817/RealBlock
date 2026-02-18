# RealBlock - Real Estate Token Investment Platform

Complete full-stack application for tokenized real estate investments with KYC verification.

## 📁 Project Structure

```
RealBlock/
├── backend/           # Express + tRPC API
│   ├── src/
│   │   ├── modules/   # Auth, KYC, Token modules
│   │   ├── prisma/    # Database schema
│   │   └── trpc/      # tRPC configuration
│   └── README.md
│
├── frontend/          # Next.js Application
│   ├── app/
│   │   ├── auth/      # Login & Signup
│   │   ├── dashboard/ # Main dashboard
│   │   └── kyc/       # KYC verification
│   └── README.md
│
└── README.md          # This file
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run build
npm start
```
Runs on: `http://localhost:4000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on: `http://localhost:3000`

## ✨ Features

### Authentication
- ✅ User signup & login
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes

### KYC Verification
- ✅ PAN verification (Cashfree)
- 🔜 Aadhaar verification
- 🔜 Bank account verification
- ✅ Real-time status tracking

### Token System
- 🔜 Property token listings
- 🔜 Token purchase flow
- 🔜 Investment tracking

### Tech Stack

**Backend:**
- Express.js
- tRPC
- Prisma (PostgreSQL)
- Cashfree API
- JWT + bcrypt

**Frontend:**
- Next.js 15
- TypeScript
- Tailwind CSS
- React Hooks

## 📖 Documentation

- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)
- [Frontend Features](./FRONTEND_SETUP.md)

## 🧪 Test Credentials

**For Signup:**
```
Email: test@example.com
Password: password123
```

**For PAN Verification:**
```
PAN: ABCPV1234D
Name: Test User
```

## 🌐 Deployment

- **Backend**: Render.com (configured)
- **Frontend**: Vercel (recommended)

## 🎯 User Flow

1. Visit `http://localhost:3000`
2. Sign up / Login
3. Navigate to KYC page
4. Verify PAN
5. Browse properties (coming soon)
6. Purchase tokens (coming soon)

## 📝 Environment Variables

### Backend (`.env`)
```bash
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CASHFREE_CLIENT_ID=...
CASHFREE_CLIENT_SECRET=...
```

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 🛠️ Development

### Install All Dependencies
```bash
# Backend
cd backend && npm install

# Frontend  
cd frontend && npm install
```

### Run Both Simultaneously
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 📦 Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 🐛 Troubleshooting

**Backend not starting?**
```bash
cd backend
npx prisma migrate deploy --schema=src/prisma/schema.prisma
npx prisma generate --schema=src/prisma/schema.prisma
```

**Frontend errors?**
```bash
cd frontend
rm -rf .next node_modules
npm install
```

## 🎉 What's Working

✅ User authentication  
✅ Login/Signup flow  
✅ JWT tokens  
✅ PAN verification  
✅ KYC status tracking  
✅ Protected routes  
✅ Beautiful UI  

## 🔜 Coming Soon

- Aadhaar verification
- Bank account verification
- Property listings
- Token purchase
- Investment dashboard
- Transaction history

---

Made with ❤️ for RealBlock
