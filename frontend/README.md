# RealBlock Frontend

Modern Next.js frontend for Real BlockKYC and token investment platform.

## Features

✅ **Authentication System**
- Login & Signup pages
- JWT-based authentication
- Protected routes

✅ **KYC Verification**
- PAN verification flow
- Status tracking
- Beautiful UI/UX

✅ **Dashboard**
- User profile
- KYC status
- Quick actions

## Getting Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Signup page
│   ├── dashboard/page.tsx       # Main dashboard
│   ├── kyc/page.tsx            # KYC verification
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home (redirects to login)
│   └── globals.css             # Global styles
├── public/                      # Static assets
└── package.json
```

## Pages

### `/auth/login`
- Email/password login
- Redirects to dashboard on success

### `/auth/signup`
- User registration
- Password validation
- Redirects to login after signup

### `/dashboard`
- Protected route (requires authentication)
- Shows KYC status
- Quick navigation

### `/kyc`
- PAN verification form
- Real-time status updates
- Test credentials provided

## Test Credentials

**For PAN Verification:**
- PAN: `ABCPV1234D`
- Name: `Test User`

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks
- **Authentication:** localStorage (JWT)

## API Integration

Backend API: `https://realblock.onrender.com/api`

Endpoints used:
- `POST /auth/login`
- `POST /auth/signup`
- `POST /kyc/pan-verify`

## Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://realblock.onrender.com/api
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```bash
docker build -t realblock-frontend .
docker run -p 3000:3000 realblock-frontend
```

## License

MIT
