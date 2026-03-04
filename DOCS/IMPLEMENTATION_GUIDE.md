# Implementation Guide - TamsJam E-Commerce

**Quick reference for common development tasks on the TamsJam platform.**

---

## Local Development Setup

### Initial Setup (First Time)
```bash
# 1. Clone and install
git clone <repo>
cd TamsJam

# 2. Start database (if using Docker)
docker-compose up -d

# 3. Backend setup
cd backend
pnpm install
# Configure .env with DATABASE_URL
pnpm medusa develop
# ✅ Backend running on http://localhost:9000

# 4. Frontend setup (in new terminal)
cd ..
pnpm install
# Configure .env.local with NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
pnpm dev
# ✅ Frontend running on http://localhost:8000
```

### Starting Up (Daily)
```bash
# Backend
cd backend && pnpm medusa develop

# Frontend (in another terminal)
pnpm dev
```

---

## Product Management

### Add New Product
```bash
# 1. Edit product data file
vim backend/DOCS/product-data.json
# Add product entry with all fields

# 2. Update database
cd backend
pnpm update:metadata

# 3. Verify in API
curl "http://localhost:9000/store/products?handle=<product-handle>&fields=+metadata" \
  -H "x-publishable-api-key: pk_..."

# 4. Check storefront
# Visit http://localhost:8000/us/products/<product-handle>
```

### Update Product Metadata
Same as above — edit `backend/DOCS/product-data.json` and run `pnpm update:metadata`

### Product Data Structure
```typescript
{
  "title": "Product Name",
  "handle": "product-slug",
  "description": "Short description",
  "longDescription": "Brand story / detailed description",
  "flavor": "Flavor name",
  "sku": "SKU-CODE",
  "netWeight": { "oz": 12, "g": 340 },
  "ingredients": ["ingredient1", "ingredient2"],
  "attributes": ["attribute1", "attribute2"],
  "nutrition": {
    "servings": 20,
    "servingSize": "1 tbsp (18g)",
    "calories": 35,
    "totalFat": "0g",
    // ... all nutrition fields
  },
  "storage": "Refrigerate after opening"
}
```

---

## Frontend Development

### Add Product Display Field
**File**: `src/modules/products/templates/product-info/index.tsx`

```typescript
// Pattern to follow:
{metadata.fieldName && (
  <div>
    <Text className="text-sm font-semibold text-ui-fg-base">Field Label</Text>
    <Text className="text-sm text-ui-fg-subtle">{metadata.fieldName}</Text>
  </div>
)}
```

### Query Products with Metadata
**File**: `src/lib/data/products.ts`

```typescript
// IMPORTANT: Include +metadata in fields selector
const response = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
  `/store/products`,
  {
    query: {
      fields: "*variants.calculated_price,+metadata,+id,+title",
      ...otherParams,
    },
  }
)
```

### Create New Product Page
1. Create file: `src/app/[countryCode]/(main)/products/[handle]/page.tsx`
2. Fetch product: `const product = await getProduct(handle)`
3. Use `<ProductInfo product={product} />` component
4. Wrap with Suspense for streaming

### Common Components
- `ProductInfo` — Display all product metadata
- `ProductGallery` — Show product images
- `AddToCart` — Shopping cart integration
- `ProductRating` — Customer reviews

---

## Backend Development

### Create Seed Script
**File**: `backend/src/scripts/my-script.ts`

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function myScript({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)

  // Your script logic here

  logger.info("✅ Complete!")
}
```

**Run**: `pnpm medusa exec ./src/scripts/my-script.ts`

### Link Products to Collection
**Pattern**: See `backend/src/scripts/link-products-to-jam.ts`

```typescript
import { batchLinkProductsToCollectionWorkflow } from "@medusajs/medusa/core-flows"

// Link products to collection
await batchLinkProductsToCollectionWorkflow(container).run({
  input: {
    id: "jam",  // collection ID
    add: productIds,  // array of product IDs
  },
})
```

### Update Product Metadata
```typescript
const productService = container.resolve(Modules.PRODUCT)

await productService.updateProducts(
  productId,
  {
    metadata: {
      flavor: "Strawberry",
      nutrition: JSON.stringify(nutritionData),
      // ... other metadata
    },
  }
)
```

---

## Database Management

### Access Database
```bash
psql postgresql://user:password@localhost:5432/medusa
```

### Backup Database
```bash
pg_dump postgresql://user:password@localhost:5432/medusa > backup.sql
```

### Restore Database
```bash
psql postgresql://user:password@localhost:5432/medusa < backup.sql
```

### Check Product Data
```sql
SELECT id, title, metadata FROM products LIMIT 5;

-- Check specific product
SELECT title, metadata FROM products WHERE handle = 'tams-jams-raspberry';

-- Check nutrition data
SELECT title, metadata->>'nutrition' FROM products;
```

---

## API Testing

### List Products with Metadata
```bash
curl "http://localhost:9000/store/products?limit=5&fields=+metadata" \
  -H "x-publishable-api-key: pk_e1d1fcdfd84f7c2f5c0899f2c201fc5c34333a49b59ba5c6edbf2b1d9dce5e4b" \
  | jq '.products[] | {title, metadata}'
```

### Get Single Product
```bash
curl "http://localhost:9000/store/products/tams-jams-strawberry?fields=+metadata" \
  -H "x-publishable-api-key: pk_e1d1fcdfd84f7c2f5c0899f2c201fc5c34333a49b59ba5c6edbf2b1d9dce5e4b" \
  | jq '.products[0]'
```

### Check Collections
```bash
curl "http://localhost:9000/store/collections" \
  -H "x-publishable-api-key: pk_..."
```

---

## Debugging

### Product Not Showing on Frontend
1. ✅ **API returns product?**
   ```bash
   curl "http://localhost:9000/store/products/<handle>" -H "x-publishable-api-key: pk_..."
   ```

2. ✅ **Metadata included in response?**
   - Should have `fields=+metadata` in query

3. ✅ **Browser console errors?**
   - Open DevTools (F12) → Console tab
   - Check for JSON parsing errors

4. ✅ **Cache issue?**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Backend Connection Failed
1. ✅ **Backend running?** `curl http://localhost:9000/admin/health`
2. ✅ **Correct publishable key?** Check `.env.local`
3. ✅ **CORS configured?** Check `backend/medusa-config.ts`
4. ✅ **Database connected?** Check backend logs

### Metadata Not Updating
1. ✅ **Did you run `pnpm update:metadata`?**
2. ✅ **No JSON syntax errors in `product-data.json`?** Use `jq . < product-data.json` to validate
3. ✅ **Database changes committed?** Script should show success message
4. ✅ **Frontend fetching with `+metadata`?** Check network tab in DevTools

---

## Performance Tips

### Optimize Product Queries
```typescript
// ✅ Good: Only fetch needed fields
fields: "*variants.calculated_price,+metadata,+id,+title"

// ❌ Bad: Fetch everything
// No fields parameter = default limited set
```

### Optimize Frontend Rendering
```typescript
// ✅ Good: Conditional rendering
{metadata.field && <div>{metadata.field}</div>}

// ❌ Bad: Always render
<div>{metadata.field}</div>  // Shows undefined/null
```

### Pagination Best Practice
```typescript
// ✅ Good: Page-based pagination
listProducts({ pageParam: 1, limit: 12 })

// ✅ Good: Offset-based pagination
listProducts({ offset: 0, limit: 12 })
```

---

## Code Patterns to Follow

### Server Component (Fetch Data)
```typescript
export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle)
  return <ProductInfo product={product} />
}
```

### Client Component (Interactivity)
```typescript
"use client"

export default function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    await addToCart(productId)
    setLoading(false)
  }

  return <button onClick={handleClick}>{loading ? "..." : "Add"}</button>
}
```

### Error Handling
```typescript
// ✅ Good: Graceful JSON parsing
try {
  const nutrition = JSON.parse(metadata.nutrition)
} catch (e) {
  // Handle invalid JSON
  console.warn("Invalid nutrition JSON")
}

// ✅ Good: Conditional rendering
{metadata.nutrition && <NutritionTable nutrition={nutrition} />}
```

### API Routes (if needed)
```typescript
// backend/src/api/routes/[method]/[path].ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Your route logic
  res.json({ success: true })
}
```

---

## Deployment Preparation

### Pre-Deployment Checklist
- [ ] All products have complete metadata
- [ ] No console errors in frontend
- [ ] API responses include `+metadata`
- [ ] Database backups created
- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] SSL certificates ready (for HTTPS)

### Environment Variables to Configure
**Frontend (.env.local)**:
```env
MEDUSA_BACKEND_URL=https://your-backend.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_BASE_URL=https://your-storefront.com
```

**Backend (.env)**:
```env
DATABASE_URL=postgresql://...
STORE_CORS=https://your-storefront.com
ADMIN_CORS=https://your-admin.com
JWT_SECRET=<secure-random-string>
COOKIE_SECRET=<secure-random-string>
```

---

## Additional Resources

- **CLAUDE.md** — Complete architecture guide
- **AGENTS.md** — Specialized agent roles
- **DEVELOPER_PERSONA.md** — How to think about the codebase
- **SESSION_TRANSCRIPT_2026_03_04.md** — What was built and why
- **Medusa Docs** — https://docs.medusajs.com/
- **Next.js Docs** — https://nextjs.org/docs

---

## Quick Command Reference

```bash
# Development
pnpm dev              # Start frontend
pnpm medusa develop   # Start backend

# Scripts
pnpm seed:products
pnpm update:metadata
pnpm link:products-to-jam

# Debugging
curl "http://localhost:9000/store/products?fields=+metadata" \
  -H "x-publishable-api-key: pk_..."

# Database
psql postgresql://user:pass@localhost:5432/medusa
pg_dump postgresql://... > backup.sql
```

---

**Last Updated**: March 4, 2026
**Maintainer**: TamsJam Development Team
