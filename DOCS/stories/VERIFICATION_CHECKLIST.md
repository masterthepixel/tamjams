# Product Media Feature - Verification Checklist

**Last Verified:** March 7, 2026

This document tracks what has been verified about the codebase to ensure the Product Media Carousel stories will work correctly.

---

## ✅ VERIFIED - Backend Metadata Patterns

### Metadata Storage Pattern
- [x] Metadata is stored as a JavaScript object on products
- [x] Complex data types are JSON.stringified (e.g., nutrition facts)
- [x] Metadata can contain mixed field types (strings, stringified JSON, etc.)
- [x] API returns metadata when `fields=+metadata` is requested
- [x] `undefined` values in metadata are handled correctly (omitted from response)

**Evidence:**
- Location: `backend/src/scripts/seed-products.ts:125-133`
- Pattern: `nutrition: product.nutrition ? JSON.stringify(product.nutrition) : undefined`
- API Response: Verified metadata returns as JSON object with stringified nutrition field

### Metadata Update Script
- [x] Update script uses same pattern as seed script
- [x] ProductData interface defines what fields are supported
- [x] Script iterates products by handle and updates metadata
- [x] Undefined fields are handled gracefully

**Evidence:**
- Location: `backend/src/scripts/update-product-metadata.ts:49-100`
- Pattern: Uses `productModuleService.updateProducts(productId, { metadata: {...} })`

### ProductData Interface Consistency
- [x] `seed-products.ts` defines ProductData interface (lines 14-43)
- [x] `update-product-metadata.ts` defines same interface separately (lines 14-43)
- ⚠️ **WARNING:** Interfaces are duplicated — needs attention for videoUrls
- [x] Both scripts can be updated independently
- [x] New fields can be added to product-data.json without breaking existing products

**Recommendation:** Extract shared ProductData interface to `backend/src/types/product-data.ts` in future

---

## ✅ VERIFIED - Frontend Metadata Patterns

### Metadata Parsing
- [x] Frontend fetches metadata with `fields=+metadata`
- [x] ProductInfo component already parses JSON metadata fields
- [x] JSON.parse() has error handling (try/catch)
- [x] Type checking handles string vs object metadata values

**Evidence:**
- Location: `src/modules/products/templates/product-info/index.tsx:15-25`
- Pattern: Checks `typeof metadata.nutrition === "string"` before parsing
- Already handles: undefined, null, string, and object types

### Existing Utility Patterns
- [x] Utility functions are stored in `src/lib/util/`
- [x] Utilities import from `@medusajs/types` for types
- [x] Pattern example: `sort-products.ts` shows how to work with product arrays

**Evidence:**
- Location: `src/lib/util/` directory exists with 10 utilities
- File: `sort-products.ts` shows pattern for product manipulation

### Product Data Fetching
- [x] `src/lib/data/products.ts` is the central fetching module
- [x] It already requests `+metadata` in field selectors (line 66)
- [x] API response includes metadata field
- [x] No changes needed to data layer (already correct!)

**Evidence:**
- Location: `src/lib/data/products.ts:56-73`
- Field selector: `"title,handle,description,*variants.calculated_price,+variants.inventory_quantity,*variants.images,images,+metadata,+tags"`

---

## ✅ VERIFIED - Component Patterns

### Image Gallery Structure
- [x] `ImageGallery` is a client component (`"use client"`)
- [x] Uses React hooks (useState for carousel state)
- [x] Component accepts props with proper typing
- [x] Rendering pattern: conditional display of images
- [x] Navigation: Previous/Next buttons with state management
- [x] Thumbnails: clickable buttons to jump to media

**Evidence:**
- Location: `src/modules/products/components/image-gallery/index.tsx`
- Pattern: Component already has full carousel functionality

### Component Props Type Pattern
- [x] Props typed with interface: `type ImageGalleryProps = { images: HttpTypes.StoreProductImage[] }`
- [x] Pattern: Can be extended to `media: MediaItem[]`
- [x] No breaking changes if props are extended properly

**Evidence:**
- Location: `src/modules/products/components/image-gallery/index.tsx:7-9`

---

## ✅ VERIFIED - API Patterns

### Store API Responses
- [x] `/store/products` endpoint returns metadata when requested
- [x] Metadata is returned as JSON object (not wrapped)
- [x] Array fields in metadata are stringified
- [x] All products have metadata field (even if empty)

**Evidence:**
```json
{
  "metadata": {
    "nutrition": "{\"servings\":20,...}",
    "flavor": "Strawberry",
    ...
  }
}
```

### Query Patterns
- [x] `fields=+metadata` requests metadata
- [x] Multiple fields can be combined: `fields=title,handle,+metadata`
- [x] API returns all requested fields

**Evidence:**
- Tested: `curl "http://localhost:9000/store/products?handle=tams-jams-strawberry&fields=+metadata"`
- Response: Metadata object returned correctly

---

## ⚠️ NEEDS TESTING - Implementation Details

### Story 1: Backend Implementation
- [ ] Add `videoUrls?: string[]` to both ProductData interfaces
- [ ] Add videoUrls to seed-products.ts metadata block
- [ ] Add videoUrls to update-product-metadata.ts metadata block
- [ ] Run seed script and verify API returns `metadata.videoUrls`
- [ ] Test with sample videos in product-data.json

**Test Command:**
```bash
# After implementing Story 1:
cd backend
pnpm seed:products
pnpm update:metadata

# Verify
curl "http://localhost:9000/store/products?fields=+metadata" \
  -H "x-publishable-api-key: pk_..."
```

### Story 2: Frontend Utility
- [ ] Create `src/lib/util/combine-product-media.ts` with getCombinedMedia function
- [ ] Test parsing of stringified videoUrls JSON
- [ ] Test handling of missing videos
- [ ] Test handling of malformed JSON
- [ ] Test with actual products from API

**Test Pattern:**
```typescript
const media = getCombinedMedia(product)
console.log(media) // Should be array of { id, url, type }
```

### Story 3: Component Update
- [ ] Rename ImageGallery props/types or create MediaGallery wrapper
- [ ] Add conditional rendering for video elements
- [ ] Test carousel navigation with mixed media
- [ ] Test on mobile devices
- [ ] Test thumbnail generation for videos

### Story 4: Video Enhancements
- [ ] Test lazy loading of videos
- [ ] Test fullscreen playback
- [ ] Test poster images
- [ ] Test on slow network (throttle in DevTools)

### Story 5: Testing & Documentation
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Generate coverage report
- [ ] Review documentation for completeness

---

## 🔍 Code Review Findings

### Interface Duplication Alert
**Issue:** ProductData interface is defined in TWO places:
- `backend/src/scripts/seed-products.ts` (lines 14-43)
- `backend/src/scripts/update-product-metadata.ts` (lines 14-43)

**Impact:** When adding videoUrls, BOTH must be updated, or TypeScript will error

**Recommendation:**
```typescript
// Create: backend/src/types/product-data.ts
export interface ProductData {
  title: string
  handle: string
  // ... all fields ...
  videoUrls?: string[]
}

// Then in both scripts:
import { ProductData } from "../types/product-data"
```

### Metadata Field Assumptions Verified
- ✅ Stringified JSON works (nutrition is stringified)
- ✅ Optional fields work (nutrition is optional)
- ✅ Frontend parsing works (already implemented for nutrition)
- ✅ API returns metadata (verified with curl)

---

## 📋 Pre-Implementation Checklist

Before starting Story 1 implementation, ensure:

- [ ] Understand the interface duplication issue
- [ ] Have sample video URLs ready (local `/static/` or remote URL)
- [ ] Know which products to add videos to (Strawberry for testing?)
- [ ] Backend dev server is running (`cd backend && pnpm dev`)
- [ ] Frontend dev server is running (`pnpm dev`)
- [ ] Have curl/API testing tool ready

---

## 🚀 Ready to Implement?

**Start with:** [Story 1: Extend Product Metadata to Support Video URLs](./product_media-01-extend-metadata-for-videos.md)

**Key Implementation Points:**
1. Add `videoUrls?: string[]` to product-data.json schema
2. Update BOTH ProductData interfaces (seed-products.ts AND update-product-metadata.ts)
3. Follow JSON.stringify pattern (just like nutrition field)
4. Test API response with curl
5. Proceed to Story 2 once Story 1 is verified

**Questions?** Refer to Evidence sections above or check actual files in codebase.

---

## 📊 Summary

| Aspect | Status | Verified | Evidence |
|--------|--------|----------|----------|
| Metadata storage | ✅ | Yes | seed-products.ts |
| Metadata API | ✅ | Yes | curl test |
| JSON stringification | ✅ | Yes | nutrition field |
| Frontend parsing | ✅ | Yes | product-info.tsx |
| Utility patterns | ✅ | Yes | sort-products.ts |
| Component structure | ✅ | Yes | image-gallery.tsx |
| Interface consistency | ⚠️ | Duplicated | Two script files |

---

**Last Updated:** March 7, 2026
**Verified By:** Code review and API testing
**Status:** Ready for Story 1 implementation
