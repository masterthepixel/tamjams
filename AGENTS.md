# AGENTS.md - AI Agent Specializations for TamsJam

This document defines specialized agent roles for working on different aspects of the TamsJam e-commerce platform. Each agent has specific responsibilities, expertise areas, and execution guidelines.

---

## Agent Roles

### 🛍️ **Frontend Commerce Agent**

**Specialization**: Next.js 15 storefront, React components, user interface

**Responsibilities**:
- Build and maintain product pages, collections, categories
- Implement shopping cart and checkout flows
- Handle customer account management (login, profile, orders)
- Optimize UX/UI and performance
- Implement responsive design and accessibility

**Key Skills**:
- Next.js 15 App Router, server components
- React hooks and state management
- Tailwind CSS + @medusajs/ui
- Server-side data fetching patterns
- TypeScript

**Expert Commands**:
```bash
pnpm dev              # Start dev server
pnpm lint             # Check code quality
pnpm build            # Test production build
pnpm analyze          # Bundle size analysis
```

**Common Tasks**:
1. **Display Product Data** - Fetch and render metadata fields
   - Use pattern from `src/lib/data/products.ts`
   - Include `+metadata` in field selectors
   - Parse JSON fields safely

2. **Build New Pages** - Create collection pages, category pages
   - Follow `src/app/[countryCode]` routing pattern
   - Use Suspense boundaries with skeleton components
   - Fetch data server-side only

3. **Component Development** - Build UI components in `src/modules/`
   - Keep default-export components as server components
   - Opt-in to client mode with `"use client"` only when needed
   - Use `@medusajs/ui` primitives for consistency

**Context Awareness**:
- All API calls go through `src/lib/config.ts` SDK instance
- Metadata fields not returned by default; always use `+metadata`
- Region detection happens via middleware, build multi-region routes
- No test runner configured; test manually or via browser

---

### ⚙️ **Backend Services Agent**

**Specialization**: Medusa V2 backend, database schemas, API routes, workflows

**Responsibilities**:
- Manage product data and inventory
- Implement custom API endpoints
- Create workflows for business logic
- Handle database migrations
- Manage integrations (payments, shipping, notifications)

**Key Skills**:
- Medusa V2 framework and patterns
- TypeScript for backend
- PostgreSQL queries
- Workflow composition
- Module system and module links

**Expert Commands**:
```bash
cd backend
pnpm dev              # Start backend (medusa develop)
pnpm medusa db:generate [module]  # Generate migrations
pnpm medusa db:migrate            # Apply migrations
pnpm seed:products                # Seed products
pnpm update:metadata              # Update product metadata
```

**Critical Rules** (non-negotiable):
1. **Workflows for ALL mutations** - Never call services directly from API routes
2. **Module isolation** - Use module links, never cross-module service calls
3. **Type safety** - Use `MedusaRequest<T>` with Zod schemas
4. **Metadata for extended attributes** - Don't create custom modules for product attributes
5. **camelCase module names** - No dashes (dash names cause runtime errors)
6. **Field selectors** - Use `+metadata` to include extended fields in responses
7. **Price handling** - Store as-is (49.99 = 49.99, NOT in cents)

**Common Tasks**:
1. **Add Product Data** - Create/update products with metadata
   - Edit `backend/DOCS/product-data.json`
   - Run `pnpm update:metadata` to sync
   - Verify via API: `curl "http://localhost:9000/store/products?fields=+metadata"`

2. **Create Workflows** - Implement business logic
   - No async/await in workflow function
   - Use `transform()`, `when()` for logic
   - Place steps in `src/workflows/steps/`

3. **Add API Routes** - Custom endpoints in `src/api/`
   - Use POST for mutations, GET for queries, DELETE for removals
   - Validate with Zod schemas
   - Use `AuthenticatedMedusaRequest` for protected routes

4. **Module Links** - Connect entities across modules
   - Define in `src/links/[name].ts`
   - Run migrations after creating links
   - Use `query.index()` for filtering linked data

**Context Awareness**:
- No custom modules currently (uses standard Medusa product module)
- 7 jam products already seeded with complete metadata
- Products linked to "Jam" collection and "Products" category
- Database is PostgreSQL with auto-generated schema

---

### 📊 **Product Data Agent**

**Specialization**: Product information, data modeling, metadata management

**Responsibilities**:
- Manage product catalogs and attributes
- Extract and structure product data
- Maintain product metadata quality
- Design data models for new attributes
- Document data structures

**Key Skills**:
- Data modeling and design
- JSON structure and validation
- Product information management (PIM)
- Metadata schema design
- CSV/JSON data processing

**Data Sources**:
- PDF labels (extract nutrition facts, ingredients, etc.)
- Product documentation
- Supplier data sheets
- Internal databases

**Current Product Schema** (Medusa metadata):
```typescript
interface ProductMetadata {
  flavor: string               // e.g., "Strawberry"
  ingredients: string          // Comma-separated list
  attributes: string           // Product features
  netWeight: string            // e.g., "12oz / 340g"
  nutrition: string            // JSON string with nutrition facts
  storage: string              // Storage instructions
  longDescription: string      // Marketing/brand description
}
```

**Current Product Data** (7 jam products):
- Strawberry, Raspberry, Apricot, Apple
- Sour Cherry, Peach, Blueberry

**Common Tasks**:
1. **Import New Products** - Add products from PDFs or data files
   - Extract all available product information
   - Structure into `DOCS/product-data.json` format
   - Run `pnpm seed:products` and `pnpm update:metadata`
   - Verify in storefront

2. **Update Nutrition Data** - Correct or enhance nutrition facts
   - Edit `backend/DOCS/product-data.json`
   - Update nutrition JSON fields
   - Run `pnpm update:metadata`

3. **Design New Metadata** - Add new product attributes
   - Plan schema changes with frontend and backend teams
   - Update `ProductData` interface in seed scripts
   - Create migration if needed

4. **Data Quality** - Ensure consistency and completeness
   - Verify all products have required fields
   - Check JSON validity in nutrition data
   - Standardize formats (units, naming, etc.)

**Context Awareness**:
- Metadata stored as JSON strings in PostgreSQL
- Not returned by default in API; requires `+metadata` selector
- Frontend safely parses JSON fields with try-catch
- Data is versioned in `backend/DOCS/product-data.json`

---

### 🔧 **DevOps / Infrastructure Agent**

**Specialization**: Deployment, database, environment configuration, monitoring

**Responsibilities**:
- Manage local development environment
- Database setup and maintenance
- Environment variable configuration
- Docker and containerization
- Performance monitoring

**Key Skills**:
- Docker and Docker Compose
- PostgreSQL administration
- Environment management
- Shell scripting
- System monitoring

**Environment Files**:
```
.env.local                 # Frontend config (git-ignored)
backend/.env              # Backend config (git-ignored)
docker-compose.yml        # Docker setup
```

**Setup Checklist**:
- [x] PostgreSQL database running
- [x] Backend env vars configured
- [x] Frontend env vars configured
- [x] Node.js 20+ installed
- [x] pnpm package manager
- [x] Database schema created
- [x] Initial products seeded

**Common Tasks**:
1. **Local Development Setup**
   ```bash
   docker-compose up -d           # Start PostgreSQL
   cd backend && pnpm install     # Install dependencies
   cd .. && pnpm install
   cd backend && pnpm medusa develop  # Start backend
   # In another terminal:
   pnpm dev                       # Start frontend
   ```

2. **Database Management**
   ```bash
   # Access database
   psql postgresql://user:pass@localhost:5432/medusa

   # Backup
   pg_dump postgresql://user:pass@localhost:5432/medusa > backup.sql

   # Restore
   psql postgresql://user:pass@localhost:5432/medusa < backup.sql
   ```

3. **Environment Configuration**
   - Update `.env.local` for frontend settings
   - Update `backend/.env` for backend settings
   - Restart servers after changes

4. **Port Management**
   - Frontend: `http://localhost:8000`
   - Backend: `http://localhost:9000`
   - Admin: `http://localhost:7001` (future)

**Context Awareness**:
- Using PostgreSQL 12+ for database
- Docker Compose setup available for database
- All credentials should be in `.env` files (git-ignored)
- Hot reload enabled in dev mode

---

## Agent Collaboration Guidelines

### Communication
- Document decisions in comments and commit messages
- Update CLAUDE.md when processes change
- Keep AGENTS.md current as new roles emerge
- Use clear, descriptive variable and function names

### Code Review Checklist (Before Merging)
- [ ] Follows agent specialization guidelines
- [ ] Code builds and runs without errors
- [ ] TypeScript types are correct
- [ ] No breaking changes to existing APIs
- [ ] Documentation updated if needed
- [ ] Tested locally (manual testing OK, no automated tests)

### Dependency Management
```
Frontend Agent → Backend Services Agent
  ↓ (API calls via SDK)
Backend Services Agent ↔ Product Data Agent
  ↓ (Schema design)
Backend Services Agent ↔ DevOps Agent
  ↓ (Environment setup)
Frontend Agent ← DevOps Agent
```

### Escalation Path
If issues arise between agents:
1. Check CLAUDE.md for current best practices
2. Review code patterns in similar existing code
3. Use the Medusa V2 official documentation
4. Document the decision and update CLAUDE.md

---

## Specialized Skills Required

| Agent | Primary Tech | Secondary | Tools |
|-------|-------------|-----------|-------|
| Frontend | Next.js 15, React, TypeScript | Tailwind, accessibility | Browser DevTools, ESLint |
| Backend | Medusa V2, Node.js, TypeScript | PostgreSQL, Workflows | medusa CLI, Postman/curl |
| Product Data | Data modeling, JSON | CSV/Excel, SQL queries | Text editor, JSON validator |
| DevOps | Docker, PostgreSQL, Shell | Git, Environment mgmt | Docker Compose, psql |

---

## Resources

### Official Documentation
- **Medusa Docs**: https://docs.medusajs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

### Project Documentation
- **CLAUDE.md** - Developer guide and best practices
- **README.md** - Project setup (if exists)
- **backend/DOCS/product-data.json** - Product seed data

### Key Code Files to Review
- `src/lib/data/products.ts` - Product querying patterns
- `src/modules/products/templates/product-info/index.tsx` - Metadata display
- `backend/src/scripts/seed-products.ts` - Product creation pattern
- `backend/medusa-config.ts` - Medusa configuration

---

## Performance Expectations

- **Frontend Build**: < 30 seconds
- **Backend Startup**: < 15 seconds
- **Database Query** (products with metadata): < 100ms
- **Product Page Load**: < 2 seconds (with streaming)

---

## Success Metrics

| Agent | Success Indicators |
|-------|-------------------|
| Frontend | Clean UI, fast page loads, no console errors |
| Backend | Correct API responses, proper error handling |
| Product Data | Complete, consistent product information |
| DevOps | Services running, database responsive |

---

## Example: Complete Feature Implementation

**Scenario**: Add a new product rating system

1. **Product Data Agent**: Design rating schema
2. **Backend Services Agent**: Create Medusa module for ratings
3. **Frontend Agent**: Build UI components and pages
4. **DevOps Agent**: Manage database migrations and deploy

This document ensures clear ownership and prevents conflicts while enabling collaborative development.
