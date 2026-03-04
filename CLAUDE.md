# CLAUDE.md - TamsJam E-Commerce Platform

**Developer Guidance for Claude Code & AI Agents**

---

## 📚 Documentation Index

**Start here to find what you need:**

### Core Project Files (This Repo)
- **[CLAUDE.md](CLAUDE.md)** — This file. Main architecture and setup guide
- **[AGENTS.md](AGENTS.md)** — AI agent specializations and roles
- **[DOCS/README.md](DOCS/README.md)** — Documentation hub with reading path

### Developer Guides (in DOCS/ folder)
- **[DEVELOPER_PERSONA.md](DOCS/DEVELOPER_PERSONA.md)** — Developer mindset and philosophy
- **[IMPLEMENTATION_GUIDE.md](DOCS/IMPLEMENTATION_GUIDE.md)** — Quick reference for common tasks
- **[SESSION_TRANSCRIPT_2026_03_04.md](DOCS/SESSION_TRANSCRIPT_2026_03_04.md)** — What was built and why
- **[PRODUCT_IMPORT.md](DOCS/PRODUCT_IMPORT.md)** — Product data documentation

**New to the project?** Read in this order:
1. This file (CLAUDE.md) — 10 minutes
2. [DEVELOPER_PERSONA.md](DOCS/DEVELOPER_PERSONA.md) — 10 minutes
3. [IMPLEMENTATION_GUIDE.md](DOCS/IMPLEMENTATION_GUIDE.md) — As needed

---

## Project Overview

**TamsJam** is a full-stack e-commerce platform for artisanal jam products, built with:
- **Frontend**: Next.js 15 storefront with App Router, server components, server actions
- **Backend**: Medusa V2 headless commerce platform (Node.js, PostgreSQL)
- **Architecture**: Multi-region support, server-side data fetching, streaming with Suspense

This document guides AI developers on how to work with the codebase, patterns to follow, and implementation best practices.

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- PostgreSQL 12+
- pnpm (package manager)

### Backend Setup
```bash
cd backend
pnpm install
# Configure .env with DATABASE_URL and MEDUSA_ADMIN_SEED_PRODUCTS=false
pnpm medusa develop
# Runs on http://localhost:9000
```

### Frontend Setup
```bash
cd .
pnpm install
# Uses .env.local for Medusa API key and backend URL
pnpm dev
# Runs on http://localhost:8000
```

### Database & Seeding
```bash
# If using Docker:
docker-compose up -d

# Seed initial products (jam products with full metadata):
cd backend
pnpm seed:products           # Create products from DOCS/product-data.json
pnpm update:metadata         # Update existing products with nutrition facts
pnpm create:jam-collection   # Create "Jam" collection
pnpm link:products-to-jam    # Link all products to Jam collection
pnpm update:products         # Link to categories and other relationships
```

---

## What Has Been Implemented

### ✅ Product Import Workflow
**Status**: Complete and working end-to-end

**What was accomplished**:
1. **PDF Label Processing** - Extracted product data from jam label PDFs (7 products: Strawberry, Raspberry, Apricot, Apple, Sour Cherry, Peach, Blueberry)
2. **Database Seeding** - Created products with complete metadata via Medusa workflows
3. **Metadata Structure** - Implemented proper Medusa pattern for storing extended attributes:
   - Flavor, ingredients, attributes, net weight
   - Complete nutrition facts (servings, calories, macros, micronutrients)
   - Storage instructions, long product descriptions
4. **Collection Linking** - Linked all products to "Jam" collection and "Products" category
5. **Frontend Display** - Enhanced product detail page to parse and display all metadata fields

**Data Storage Pattern** (Medusa Best Practice):
```typescript
product.metadata = {
  flavor: "Strawberry",
  ingredients: "Strawberries, Cane Sugar, Lemon Juice, Water",
  attributes: "Real Fruit, Non-GMO, Homemade, No Additives",
  netWeight: "12oz / 340g",
  nutrition: "{JSON string with complete nutrition facts}",
  storage: "Refrigerate after opening",
  longDescription: "Marketing description / brand story"
}
```

**API Verification**:
- All metadata confirmed to be stored in database
- Returns correctly via REST API when fields include `+metadata`
- Example: `GET /store/products?fields=+metadata`

**Frontend Rendering**:
- Component: [src/modules/products/templates/product-info/index.tsx](src/modules/products/templates/product-info/index.tsx)
- Safely parses JSON nutrition data
- Displays organized sections: flavor, ingredients, attributes, nutrition table, storage, long description
- Handles missing fields gracefully with conditional rendering

---

## Frontend Architecture

### Routing
- All routes nested under `src/app/[countryCode]/` for multi-region support
- Middleware at `src/middleware.ts` detects region and redirects appropriately
- Two layout groups: `(main)/` for storefront, `(checkout)/` for checkout flow

### Data Layer (`src/lib/data/`)
- **products.ts** — Product listing, search, filtering (with pagination & sorting)
- **collections.ts** — Collection pages and navigation
- **categories.ts** — Category listing
- **cart.ts, checkout.ts, payment.ts** — Purchase flow
- **customer.ts, orders.ts** — Account management
- **regions.ts** — Multi-region configuration
- **SDK Configuration** — `src/lib/config.ts` (Medusa JS SDK)

All data fetching is **server-side only** using `"use server"` directives and React Server Components.

### Module Structure (`src/modules/`)
```
modules/
├── account/        # Login, register, profile, address management
├── cart/           # Cart sidebar, line items, totals
├── checkout/       # Multi-step checkout (address → shipping → payment)
├── collections/    # Collection listing and pages
├── products/       # Product detail page, gallery, metadata display
├── categories/     # Category navigation and pages
├── home/           # Homepage hero and featured sections
├── layout/         # Nav, footer, breadcrumbs
├── order/          # Order confirmation, history
├── store/          # Product listing with filters and sorting
├── common/         # Shared UI primitives and icons
└── skeletons/      # Loading skeleton components
```

### Styling
- **Tailwind CSS v3** with `@medusajs/ui-preset`
- Custom color scale (grey), breakpoints (2xsmall–2xlarge), animations
- Uses `@medusajs/ui` component library and `@headlessui/react` for accessibility

### Key Patterns
- **Server Components by default** — Client components opted-in with `"use client"` only
- **Streaming & Suspense** — Skeleton fallbacks for progressive loading
- **Error handling** — Next.js and ESLint errors ignored during build (see next.config.js)

---

## Backend Architecture (Medusa V2)

### Structure
```
backend/
├── medusa-config.ts           # Framework configuration
├── src/
│   ├── modules/               # Custom modules (if needed)
│   ├── links/                 # Entity relationships (module links)
│   ├── scripts/               # Seed and migration scripts
│   │   ├── seed-products.ts               # Create products from JSON
│   │   ├── update-product-metadata.ts     # Update product metadata
│   │   ├── link-products-to-jam.ts        # Link to collection
│   │   └── update-products.ts             # Link to categories
│   ├── api/                   # Custom API routes (if needed)
│   └── workflows/             # Business logic workflows (if needed)
└── DOCS/
    └── product-data.json      # Product seed data
```

### Database
- **PostgreSQL** (configured via DATABASE_URL env var)
- **No custom modules** — Uses standard Medusa product module
- **Schema** — Generated from Medusa framework

### Environment Variables (Backend)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/medusa
MEDUSA_ADMIN_SEED_PRODUCTS=false  # Don't seed default products
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:7001
JWT_SECRET=your-secret-key
COOKIE_SECRET=your-secret-key
```

### Medusa Development Patterns
**Critical rules when implementing backend features:**

1. **Module Isolation** — Use module links to connect entities across modules, never direct service calls
2. **Workflows Required** — ALL mutations must go through workflows, never call services directly from API routes
3. **Type Safety** — Use `MedusaRequest<SchemaType>` and export Zod schema types
4. **Module Names** — Must be camelCase (no dashes) to avoid runtime errors
5. **Metadata Usage** — For extended product attributes, use `product.metadata` (not custom modules)
6. **Field Selectors** — Metadata not returned by default; use `+metadata` in query fields
7. **Price Formatting** — Prices stored as-is (49.99 = 49.99, NOT in cents)

See `src/lib/data/products.ts` for product querying examples with field selectors.

---

## Environment Variables

### Frontend (.env.local)
```env
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...  # From Medusa admin
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=us
NEXT_PUBLIC_STRIPE_KEY=pk_...  # Stripe public key (optional)
REVALIDATE_SECRET=supersecret
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
MEDUSA_ADMIN_SEED_PRODUCTS=false
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:7001
AUTH_CORS=http://localhost:7001
JWT_SECRET=supersecret
COOKIE_SECRET=supersecret
```

---

## Common Tasks for AI Developers

### Adding a New Product
Use the seed script pattern in `backend/src/scripts/seed-products.ts`:
```bash
# Add product to DOCS/product-data.json, then:
pnpm update:metadata
```

### Updating Product Metadata
Edit DOCS/product-data.json and run:
```bash
pnpm update:metadata
```

### Linking Products to Collections
Use `backend/src/scripts/link-products-to-jam.ts` pattern or create new linking scripts.

### Querying Products with Metadata
```typescript
// In src/lib/data/products.ts pattern:
const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
  `/store/products`,
  {
    query: {
      fields: "*variants.calculated_price,+metadata",  // Include metadata!
      ...otherParams,
    },
  }
)
```

### Displaying Product Data on Frontend
See `src/modules/products/templates/product-info/index.tsx` for patterns:
- Safely parse JSON metadata: `JSON.parse(metadata.nutrition)`
- Use conditional rendering for optional fields
- Format structured data (nutrition table example)

---

## Troubleshooting

### Backend not connecting to frontend
- Check `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is set correctly in `.env.local`
- Verify backend is running on port 9000
- Check `MEDUSA_BACKEND_URL` matches backend address

### Products not showing in storefront
- Ensure products are created: `pnpm seed:products`
- Verify products are linked to sales channel (done automatically in seed script)
- Check network tab shows `+metadata` in API response

### Nutrition facts not displaying
- Hard refresh browser (Ctrl+Shift+R)
- Verify API returns metadata via: `curl "http://localhost:9000/store/products?fields=+metadata" -H "x-publishable-api-key: ..."`
- Check browser console for JavaScript errors

### Database connection errors
- Verify PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Run `docker-compose up -d` if using Docker setup

---

## Project Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Storefront | ✅ Running | Next.js 15 with all features |
| Backend API | ✅ Running | Medusa V2 with 7 jam products |
| Product Data | ✅ Complete | All metadata, nutrition, descriptions |
| Display | ✅ Working | All product info rendering correctly |
| Collections | ✅ Linked | Products linked to "Jam" collection |
| Categories | ✅ Linked | Products linked to "Products" category |
| Multi-Region | ✅ Configured | Ready for US and additional regions |

---

## For Future Development

1. **Admin Dashboard** — Customize Medusa admin UI for easy product management
2. **Payment Processing** — Complete Stripe integration for checkout
3. **Inventory Management** — Track jam stock across regions
4. **Customer Reviews** — Implement review system for products
5. **Email Notifications** — Order confirmations, shipping updates
6. **Analytics** — Track product views, popular items, regional sales

---

## 📖 See Also

For more detailed guidance, see:
- **[AGENTS.md](AGENTS.md)** — AI agent specializations and collaboration
- **[DEVELOPER_PERSONA.md](DOCS/DEVELOPER_PERSONA.md)** — Developer mindset and decision-making
- **[IMPLEMENTATION_GUIDE.md](DOCS/IMPLEMENTATION_GUIDE.md)** — Common tasks and quick commands
- **[DOCS/README.md](DOCS/README.md)** — Documentation hub with learning path
- **[SESSION_TRANSCRIPT_2026_03_04.md](DOCS/SESSION_TRANSCRIPT_2026_03_04.md)** — What was accomplished and why

**Quick Links**:
- Product data: `backend/DOCS/product-data.json`
- Product queries: `src/lib/data/products.ts`
- Product display: `src/modules/products/templates/product-info/index.tsx`
- Backend config: `backend/medusa-config.ts`
