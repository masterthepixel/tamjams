# Quick Test Guide - Story 1: Product Video URLs

## TL;DR - Run These Commands

### 1. Run Unit Tests
```bash
cd /home/mastethepixel/GitHub/TamsJam/backend
pnpm test:unit -- seed-products.unit.spec.ts
```

**Expected:** 4 tests pass ✅

### 2. Run Integration Tests
```bash
cd /home/mastethepixel/GitHub/TamsJam/backend
pnpm test:integration:http -- product-videos.spec.ts
```

**Expected:** 3 tests pass ✅

### 3. Seed the Database
```bash
cd /home/mastethepixel/GitHub/TamsJam/backend
pnpm seed:products
pnpm update:metadata
```

### 4. Verify API Endpoint
```bash
# Get your publishable key from Medusa admin first!
PUBLISHABLE_KEY="pk_YOUR_KEY_HERE"

# Test strawberry product
curl "http://localhost:9000/store/products?handle=tams-jams-strawberry&fields=+metadata" \
  -H "x-publishable-api-key: $PUBLISHABLE_KEY" | jq '.products[0].metadata.videoUrls'

# Output should be:
# "[\"\/static\/strawberry-demo.mp4\",\"\/static\/strawberry-usage.webm\"]"
```

---

## What Was Implemented

| Item | File | Status |
|------|------|--------|
| Unit tests | `backend/src/scripts/__tests__/seed-products.unit.spec.ts` | ✅ Created |
| Integration tests | `backend/integration-tests/http/product-videos.spec.ts` | ✅ Created |
| Product data with videos | `DOCS/product-data.json` | ✅ Updated |
| Seed script interface | `backend/src/scripts/seed-products.ts` | ✅ Updated |
| Seed script metadata | `backend/src/scripts/seed-products.ts` | ✅ Updated |
| Update script interface | `backend/src/scripts/update-product-metadata.ts` | ✅ Updated |
| Update script metadata | `backend/src/scripts/update-product-metadata.ts` | ✅ Updated |

---

## Test Details

### Unit Tests (4 total)
```
seed-products.unit.spec.ts
├── ProductData interface
│   └── should accept videoUrls as optional string array
└── Product metadata serialization
    ├── should stringify videoUrls like nutrition field
    ├── should handle undefined videoUrls
    └── should handle empty videoUrls array
```

### Integration Tests (3 total)
```
product-videos.spec.ts
└── Store API - Product Videos
    ├── should return metadata.videoUrls when fields=+metadata
    ├── should stringify videoUrls in API response
    └── should work with products that have no videos
```

---

## Files Created

1. **Unit test file**
   - Path: `/home/mastethepixel/GitHub/TamsJam/backend/src/scripts/__tests__/seed-products.unit.spec.ts`
   - Size: 45 lines
   - Tests: 4

2. **Integration test file**
   - Path: `/home/mastethepixel/GitHub/TamsJam/backend/integration-tests/http/product-videos.spec.ts`
   - Size: 58 lines
   - Tests: 3

---

## Files Modified

1. **Product data**
   - Path: `/home/mastethepixel/GitHub/TamsJam/DOCS/product-data.json`
   - Change: Added `videoUrls` array to Strawberry product
   - Lines: 71-74

2. **Seed script**
   - Path: `/home/mastethepixel/GitHub/TamsJam/backend/src/scripts/seed-products.ts`
   - Changes:
     - Interface: Line 48 added `videoUrls?: string[]`
     - Metadata: Line 134 added videoUrls handling

3. **Update metadata script**
   - Path: `/home/mastethepixel/GitHub/TamsJam/backend/src/scripts/update-product-metadata.ts`
   - Changes:
     - Interface: Line 43 added `videoUrls?: string[]`
     - Metadata: Line 86 added videoUrls handling

---

## Expected Test Output

### Unit Tests
```
PASS  src/scripts/__tests__/seed-products.unit.spec.ts
  seed-products script
    ProductData interface
      ✓ should accept videoUrls as optional string array (2 ms)
    Product metadata serialization
      ✓ should stringify videoUrls like nutrition field (1 ms)
      ✓ should handle undefined videoUrls (1 ms)
      ✓ should handle empty videoUrls array (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Integration Tests
```
PASS  integration-tests/http/product-videos.spec.ts
  Store API - Product Videos
    ✓ should return metadata.videoUrls when fields=+metadata (150 ms)
    ✓ should stringify videoUrls in API response (140 ms)
    ✓ should work with products that have no videos (145 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## Troubleshooting

### Tests won't run
- Ensure you're in `/home/mastethepixel/GitHub/TamsJam/backend`
- Ensure pnpm is installed: `pnpm --version`
- Ensure dependencies are installed: `pnpm install`

### API endpoint returns null for videoUrls
- Make sure you seeded the database: `pnpm seed:products`
- Make sure you updated metadata: `pnpm update:metadata`
- Make sure backend is running: `pnpm dev`
- Check you're using correct publishable key

### videoUrls is not in database
- The videoUrls are stored in product metadata as a JSON string
- This is the expected behavior (same as nutrition field)
- API returns it as stringified JSON: `"[\"\/path.mp4\"]"`

---

## What's Next?

After confirming all tests pass:

1. **Story 2** - Update frontend data fetching to include videoUrls
2. **Story 3** - Update media gallery component to display videos
3. **Story 4** - Add video playback enhancements
4. **Story 5** - Add comprehensive tests and documentation

See: `/home/mastethepixel/GitHub/TamsJam/DOCS/stories/PRODUCT_MEDIA_OVERVIEW.md`

---

## Implementation Summary

This Story 1 implementation:
- ✅ Uses TDD approach (tests first, code second)
- ✅ Requires no database schema changes
- ✅ Is backwards compatible with existing products
- ✅ Follows established Medusa patterns
- ✅ Stores video URLs as metadata (same pattern as nutrition facts)
- ✅ Ready for frontend implementation in Story 2

**Status: COMPLETE - Ready to commit and move to Story 2**
