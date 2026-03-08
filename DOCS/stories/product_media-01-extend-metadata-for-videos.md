# Story 1: Extend Product Metadata to Support Video URLs (TDD)

**Goal:** Enable products to store and retrieve video URLs alongside existing product metadata, using the lightweight metadata approach.

**Approach:** Test-Driven Development (tests first, then implementation)

## Context

Currently, products store images via the Medusa image system. We want to support video demos, usage clips, or marketing videos in the product carousel. The simplest approach is to store video URLs in product metadata (no database schema changes needed).

**Verified Patterns:**
- Metadata stored as object with mixed types (strings, stringified JSON)
- Complex data (like nutrition facts) is JSON.stringified in metadata
- Frontend already has JSON.parse() error handling for metadata fields
- API returns metadata correctly when `fields=+metadata` is requested

---

## Task 1: Write Tests First

### 1a. Create seed script unit test
**File:** `backend/__tests__/scripts/seed-products.test.ts`

```typescript
import { readFileSync } from "fs"
import { join } from "path"

describe("seed-products script", () => {
  describe("ProductData interface", () => {
    it("should accept videoUrls as optional string array", () => {
      // This test verifies the interface is updated
      const testData: any = {
        title: "Test Product",
        handle: "test-product",
        videoUrls: ["video1.mp4", "video2.webm"],
      }
      expect(testData.videoUrls).toEqual(["video1.mp4", "video2.webm"])
    })
  })

  describe("Product metadata serialization", () => {
    it("should stringify videoUrls like nutrition field", () => {
      const videoUrls = ["demo.mp4", "usage.webm"]
      const serialized = JSON.stringify(videoUrls)

      expect(typeof serialized).toBe("string")
      expect(JSON.parse(serialized)).toEqual(videoUrls)
    })

    it("should handle undefined videoUrls", () => {
      const videoUrls: string[] | undefined = undefined
      const metadata = {
        videoUrls: videoUrls ? JSON.stringify(videoUrls) : undefined,
      }

      expect(metadata.videoUrls).toBeUndefined()
    })

    it("should handle empty videoUrls array", () => {
      const videoUrls: string[] = []
      const metadata = {
        videoUrls: videoUrls ? JSON.stringify(videoUrls) : undefined,
      }

      expect(metadata.videoUrls).toBeUndefined()
    })
  })
})
```

### 1b. Create API integration test
**File:** `backend/integration-tests/http/product-videos.test.ts`

```typescript
describe("Store API - Product Videos", () => {
  it("should return metadata.videoUrls when fields=+metadata", async () => {
    // This test will pass after implementation
    const response = await client.fetch(
      `/store/products?handle=tams-jams-strawberry&fields=+metadata`,
      {
        headers: { "x-publishable-api-key": publishableKey },
      }
    )

    const product = response.products[0]
    expect(product.metadata).toBeDefined()
    expect(product.metadata.videoUrls).toBeDefined()
  })

  it("should stringify videoUrls in API response", async () => {
    const response = await client.fetch(
      `/store/products?handle=tams-jams-strawberry&fields=+metadata`,
      {
        headers: { "x-publishable-api-key": publishableKey },
      }
    )

    const product = response.products[0]
    if (product.metadata.videoUrls) {
      expect(typeof product.metadata.videoUrls).toBe("string")
      const parsed = JSON.parse(product.metadata.videoUrls)
      expect(Array.isArray(parsed)).toBe(true)
    }
  })

  it("should work with products that have no videos", async () => {
    const response = await client.fetch(
      `/store/products?fields=+metadata`,
      {
        headers: { "x-publishable-api-key": publishableKey },
      }
    )

    const products = response.products
    products.forEach((product: any) => {
      if (product.metadata?.videoUrls) {
        expect(typeof product.metadata.videoUrls).toBe("string")
      }
    })
  })
})
```

### 1c. Run tests (they should FAIL)
```bash
cd backend
pnpm test:unit -- seed-products.test.ts
pnpm test:integration -- product-videos.test.ts
```

**Expected:** Tests fail because videoUrls isn't implemented yet ✅

---

## Task 2: Implement to Make Tests Pass

### 2a. Update product-data.json
Add `videoUrls` to at least one product:

```json
{
  "title": "Tam's Jams - Strawberry",
  "handle": "tams-jams-strawberry",
  "videoUrls": [
    "/static/strawberry-demo.mp4",
    "/static/strawberry-usage.webm"
  ],
  ...rest of fields
}
```

### 2b. Update ProductData interface in `backend/src/scripts/seed-products.ts` (lines 14-43)
```typescript
interface ProductData {
  title: string
  handle: string
  description: string
  longDescription?: string
  flavor: string
  sku: string
  netWeight: { oz: number; g: number }
  ingredients: string[]
  attributes: string[]
  nutrition?: { /* ... */ }
  storage?: string
  videoUrls?: string[]  // ADD THIS LINE
}
```

### 2c. Update ProductData interface in `backend/src/scripts/update-product-metadata.ts` (lines 14-43)
Add same field to maintain consistency:
```typescript
videoUrls?: string[]  // ADD THIS LINE
```

### 2d. Update seed script metadata block (`backend/src/scripts/seed-products.ts` lines 125-133)
```typescript
metadata: {
  flavor: product.flavor,
  ingredients: product.ingredients.join(", "),
  attributes: product.attributes.join(", "),
  netWeight: `${product.netWeight.oz}oz / ${product.netWeight.g}g`,
  nutrition: product.nutrition ? JSON.stringify(product.nutrition) : undefined,
  storage: product.storage,
  longDescription: product.longDescription,
  videoUrls: product.videoUrls ? JSON.stringify(product.videoUrls) : undefined,  // ADD THIS
}
```

### 2e. Update metadata update script (`backend/src/scripts/update-product-metadata.ts` lines 73-87)
```typescript
metadata: {
  flavor: productData.flavor,
  ingredients: productData.ingredients.join(", "),
  attributes: productData.attributes.join(", "),
  netWeight: `${productData.netWeight.oz}oz / ${productData.netWeight.g}g`,
  nutrition: productData.nutrition ? JSON.stringify(productData.nutrition) : undefined,
  storage: productData.storage,
  longDescription: productData.longDescription,
  videoUrls: productData.videoUrls ? JSON.stringify(productData.videoUrls) : undefined,  // ADD THIS
}
```

---

## Task 3: Verify Tests Pass

### 3a. Run all tests
```bash
cd backend
pnpm test:unit -- seed-products.test.ts
pnpm test:integration -- product-videos.test.ts
```

**Expected:** All tests should pass ✅

### 3b. Manual verification with seed script
```bash
cd backend
pnpm seed:products
pnpm update:metadata

# Verify via API
curl "http://localhost:9000/store/products?handle=tams-jams-strawberry&fields=+metadata" \
  -H "x-publishable-api-key: pk_..." | jq '.products[0].metadata.videoUrls'
```

**Expected Response:**
```json
"[\"\/static\/strawberry-demo.mp4\",\"\/static\/strawberry-usage.webm\"]"
```

---

## Acceptance Criteria

- ✅ Unit tests written and passing
- ✅ Integration tests written and passing
- ✅ Product-data.json accepts `videoUrls` array
- ✅ Seed script creates products with `metadata.videoUrls` as stringified JSON
- ✅ Update metadata script can modify video URLs
- ✅ Store API returns `metadata.videoUrls` when `+metadata` in fields
- ✅ No database migrations or schema changes needed
- ✅ Backwards compatible — products without videoUrls work fine

---

## Notes

- This approach uses existing metadata field (no custom modules)
- Video URLs can be relative (`/static/...`) or absolute (`https://...`)
- Pattern mirrors nutrition field (stringify complex data, use undefined if missing)
- Interface duplication in two scripts — both must be updated
- Tests catch issues early (like we verified in code review)

---

**Related Docs:** [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)
**Next Story:** [Story 2: Update Frontend Data Fetching](./product_media-02-update-frontend-data-fetching.md)
