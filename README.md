<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>

<h1 align="center">
  Medusa Next.js Starter Template
</h1>

<p align="center">
Combine Medusa's modules for your commerce backend with the newest Next.js 15 features for a performant storefront.</p>

<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

### Prerequisites

This project requires:
- **Node.js** 18+
- **PostgreSQL** 14+ (running locally or via Docker)
- **pnpm** package manager

# Overview

The Medusa Next.js Starter is built with:

- [Next.js](https://nextjs.org/) 15 with App Router
- [Tailwind CSS](https://tailwindcss.com/) v3
- [TypeScript](https://www.typescriptlang.org/)
- [Medusa](https://medusajs.com/) V2 (headless commerce backend)
- [Stripe](https://stripe.com/) payment integration

Features include:

- Full ecommerce support:
  - Product Detail Page & Product Overview Page
  - Product Collections & Categories
  - Shopping Cart & Multi-step Checkout
  - User Accounts & Order History
  - Stripe Payment Processing
- Next.js 15 advanced features:
  - Server Components by default
  - Server Actions for mutations
  - Streaming with Suspense
  - Static Pre-Rendering with ISR
  - Multi-region routing support

# Getting Started Locally

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Set Up Database

Ensure PostgreSQL is running. If using Docker:

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432 with credentials:
- Database: `medusa_db`
- User: `medusa`
- Password: `medusa`

## 3. Configure Environment Variables

**Frontend** — Create `.env.local` in the root directory:

```bash
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_publishable_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
REVALIDATE_SECRET=supersecret
```

**Backend** — Already configured in `backend/.env` (check file for details)

## 4. Start the Services

Open two terminal windows:

**Terminal 1 — Backend (port 9000):**

```bash
cd backend
pnpm dev
```

**Terminal 2 — Frontend (port 8000):**

```bash
pnpm dev
```

### Access the Storefront

Your site is now running at **http://localhost:8000**

The Medusa backend API is available at **http://localhost:9000**

## Customer Accounts

**To create a customer account:**
1. Navigate to http://localhost:8000
2. Click "Account" → "Sign Up"
3. Enter your email and password
4. You can now browse products, add to cart, and checkout

**Admin Credentials** (for managing products/orders via Medusa Admin):
- Email: `admin@example.com`
- Password: `adminpass123`

# Payment integrations

By default this starter supports the following payment integrations

- [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

# Resources

## Learn more about Medusa

- [Website](https://www.medusajs.com/)
- [GitHub](https://github.com/medusajs)
- [Documentation](https://docs.medusajs.com/)

## Learn more about Next.js

- [Website](https://nextjs.org/)
- [GitHub](https://github.com/vercel/next.js)
- [Documentation](https://nextjs.org/docs)
