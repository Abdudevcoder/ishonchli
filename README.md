# Ishonchli.uz

**Information System for Prevention of Fraud in Online Market Activities**

A full-stack Next.js 15 web application that helps users identify potentially fraudulent sellers in Uzbekistan's online marketplaces.

## Features

- **Seller Search** — Search by phone number, Telegram username, or marketplace username
- **Trust Score Engine** — Algorithmic 0–100 score based on community reports
- **Fraud Reporting** — Submit detailed fraud reports with evidence screenshots
- **Positive Reviews** — Leave reviews with ratings to build seller reputation
- **Anti-Fraud Detection** — Automatic suspicious/fraudster flags
- **Evidence Upload** — Cloudinary-powered image uploads (PNG/JPG, max 10MB)
- **Comments & Voting** — Community discussion on reports
- **Favorites** — Save sellers for quick access
- **Admin Dashboard** — Moderate reports, manage users, view statistics with charts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: Auth.js (NextAuth v5)
- **File Storage**: Cloudinary
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### 1. Clone and install

```bash
git clone <repo>
cd ishonchliuz
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

After seeding:

- **Email**: `admin@ishonchli.uz`
- **Password**: `Password123!`

## Trust Score Formula

```
Score = 50
      + (positive reviews × 3)
      - (fraud reports × 5)
      - (confirmed fraud × 10)

Clamped to [0, 100]
```

| Score   | Risk Level    |
|---------|--------------|
| 80–100  | Safe         |
| 50–79   | Moderate     |
| 20–49   | High Risk    |
| 0–19    | Dangerous    |

## Anti-Fraud Rules

- **Suspicious**: >3 complaints in 7 days
- **Potential Fraudster**: >5 confirmed fraud reports

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The project is fully compatible with Vercel's Next.js build system.

## Database Commands

```bash
npm run db:generate   # Regenerate Prisma client
npm run db:migrate    # Run migrations
npm run db:push       # Push schema without migration
npm run db:seed       # Seed demo data
npm run db:studio     # Open Prisma Studio
```

## Project Structure

```
src/
├── app/
│   ├── api/           # Route handlers
│   ├── admin/         # Admin pages
│   ├── auth/          # Login & register
│   ├── reports/       # Report pages
│   ├── sellers/       # Seller profiles
│   ├── search/        # Search page
│   ├── submit-report/ # Submit form
│   ├── favorites/     # Saved sellers
│   ├── my-reports/    # User's reports
│   └── profile/       # User profile
├── components/
│   ├── layout/        # Navbar, Footer
│   ├── report/        # Report components
│   ├── seller/        # Seller components
│   └── ui/            # Reusable UI
└── lib/
    ├── auth.ts        # NextAuth config
    ├── prisma.ts      # Database client
    ├── trust-score.ts # Trust score logic
    ├── cloudinary.ts  # Image upload
    └── validations.ts # Zod schemas
```
