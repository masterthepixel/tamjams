# Story 5: Ensure Tests Pass & Complete Documentation (TDD Final)

**Goal:** Validate all tests pass, ensure coverage > 80%, complete documentation

**Approach:** Test consolidation and verification

---

## Task 1: Run All Tests

### 1a. Backend tests
```bash
cd backend

# Unit tests
pnpm test:unit -- seed-products.test.ts
pnpm test:unit -- product-videos.test.ts

# Integration tests
pnpm test:integration -- product-videos.test.ts
pnpm test:integration -- product-media-combination.test.ts

# All tests
pnpm test
```

### 1b. Frontend tests
```bash
# Unit tests
pnpm test -- combine-product-media.test.ts
pnpm test -- image-gallery.test.tsx
pnpm test -- video-features.test.tsx

# All tests
pnpm test
```

### 1c. Generate coverage report
```bash
pnpm test:coverage
# Ensure > 80% coverage for new code
```

---

## Task 2: Write Remaining Integration Tests

### 2a. End-to-end flow test
**File:** `__tests__/integration/product-media-e2e.test.ts`

```typescript
describe("Product Media - End-to-End", () => {
  it("should load product with videos and display in carousel", async () => {
    // 1. Seed product with videos
    // 2. Fetch product via API
    // 3. Combine media with utility
    // 4. Render in component
    // 5. Verify videos display
    // 6. Test navigation
  })

  it("should handle videos across different product variants", () => {
    // Test that variant selection works with videos
  })

  it("should work on mobile viewport", () => {
    // Verify responsive behavior
  })
})
```

---

## Task 3: Complete Documentation

### 3a. Update feature documentation
**File:** `DOCS/FEATURES/product-media-carousel.md`

- Mark feature as "Implemented - MVP Complete"
- Add implementation notes
- Update with actual patterns used
- Document known limitations

### 3b. Create developer guide
**File:** `DOCS/DEV_GUIDE_VIDEOS.md`

```markdown
# Product Media Developer Guide

## Quick Start

### Adding videos to a product:
1. Edit `DOCS/product-data.json`
2. Add `videoUrls` array to product
3. Run `pnpm seed:products` and `pnpm update:metadata`

### Using the utility:
```typescript
import { getCombinedMedia, type MediaItem } from "@lib/util/combine-product-media"

const media = getCombinedMedia(product)
media.forEach(item => {
  if (item.type === 'video') {
    // Handle video
  } else {
    // Handle image
  }
})
```

### Testing:
- Unit tests: `src/**/__tests__/*.test.ts`
- Integration tests: `__tests__/integration/*.test.ts`
- Run: `pnpm test`

## Architecture

- Backend: Metadata storage in product.metadata.videoUrls
- Frontend: getCombinedMedia() utility combines images + videos
- Component: ImageGallery supports both media types
- Tests: Full coverage for critical paths

## Common Issues

**Videos not showing**: Verify `+metadata` in API field selector
**Carousel not working**: Check MediaItem types match
**Tests failing**: Ensure Story 1 ran successfully (seed videos)
```

### 3c. Create merchant guide
**File:** `DOCS/MERCHANT_GUIDE_VIDEOS.md`

```markdown
# How to Add Videos to Products

## Video Requirements
- Format: MP4 (.mp4), WebM (.webm)
- Size: < 50MB recommended
- Duration: 30 seconds - 5 minutes ideal
- Resolution: 720p minimum

## Adding Videos

### Via JSON (Current Method)
1. Place video file in `/backend/static/`
2. Edit `DOCS/product-data.json`:
```json
{
  "title": "Product Name",
  "videoUrls": [
    "/static/demo.mp4",
    "/static/usage.webm"
  ]
}
```
3. Run seed script: `pnpm seed:products`

### Via Admin UI (Future)
- Coming soon: Admin dashboard UI for video management

## Best Practices
- Show product in use (demo video)
- Keep videos under 3 minutes
- No sound needed (caption recommended for accessibility)
- Test on mobile before publishing
```

### 3d. Create API documentation
**File:** `DOCS/API_REFERENCE.md` (append section)

```markdown
## Product Media (Videos)

### Metadata Structure
Products can include video URLs in their metadata:

```json
{
  "metadata": {
    "videoUrls": "[\"\/static\/demo.mp4\",\"\/static\/usage.webm\"]",
    "flavor": "Strawberry",
    ...other fields
  }
}
```

### Querying Videos
```
GET /store/products?fields=+metadata

Returns:
{
  "products": [
    {
      "id": "prod_123",
      "title": "Product Name",
      "metadata": {
        "videoUrls": "[\"url1.mp4\",\"url2.webm\"]",
        ...
      }
    }
  ]
}
```

### Frontend Utility
```typescript
import { getCombinedMedia } from "@lib/util/combine-product-media"

const media = getCombinedMedia(product)
// Returns: MediaItem[] = [
//   { id: "img-1", url: "...", type: "image" },
//   { id: "video-0", url: "...", type: "video" }
// ]
```
```

### 3e. Create README for media examples
**File:** `DOCS/MEDIA_EXAMPLES.md`

- Links to example videos used in testing
- Instructions for replacing with real videos
- Video specs and recommendations
- Troubleshooting video playback issues

---

## Task 4: Documentation Review Checklist

- [ ] Feature doc updated and links work
- [ ] Developer guide covers all main use cases
- [ ] Merchant guide is clear for non-technical users
- [ ] API reference has correct examples
- [ ] Code comments are clear
- [ ] Test coverage > 80% for new code
- [ ] No console warnings or errors
- [ ] Peer review completed

---

## Task 5: Final Verification

### 5a. Manual testing checklist
```bash
cd backend && pnpm dev &
pnpm dev

# Visit http://localhost:8000/us/products/tams-jams-strawberry
- [ ] Images display in carousel
- [ ] Videos display with controls
- [ ] Navigation works (arrows + thumbnails)
- [ ] Video plays smoothly
- [ ] Fullscreen works
- [ ] Works on mobile
- [ ] Works on slow network (throttle in DevTools)
```

### 5b. Run complete test suite
```bash
# Backend
cd backend
pnpm test

# Frontend
pnpm test

# Generate coverage
pnpm test:coverage

# Report
# Coverage should be > 80% for new code
```

### 5c. Build and verify no errors
```bash
pnpm build
pnpm start

# Verify no build warnings/errors
```

---

## Acceptance Criteria

- ✅ All tests written and passing (> 80% coverage)
- ✅ Backend tests: seed, update metadata, API responses
- ✅ Frontend tests: utility, component, video features
- ✅ Integration tests: E2E flows
- ✅ Feature documentation complete and accurate
- ✅ Developer guide ready for implementation
- ✅ Merchant guide ready for content managers
- ✅ API documentation updated
- ✅ Example videos and media documented
- ✅ No console errors or warnings
- ✅ Build passes without errors
- ✅ Manual testing checklist completed

---

## Summary

**What was accomplished:**

✅ Product metadata extended to support video URLs (no schema changes)
✅ Backend seed/update scripts handle video data
✅ API returns video metadata with images
✅ Frontend utility combines images + videos
✅ Gallery component renders mixed media carousel
✅ Videos have fullscreen, controls, lazy loading
✅ Complete test coverage (unit + integration)
✅ Full documentation for developers and merchants

**Lines of code added:** ~500 (Stories 1-4)
**Test coverage:** > 80% for new code
**Dependencies added:** 0 (uses native HTML5)
**Breaking changes:** None
**Database migrations:** None

---

**Related Stories:**
- [Story 1: Extend Product Metadata](./product_media-01-extend-metadata-for-videos.md)
- [Story 2: Update Frontend Data Fetching](./product_media-02-update-frontend-data-fetching.md)
- [Story 3: Update MediaGallery Component](./product_media-03-update-media-gallery-component.md)
- [Story 4: Add Video Playback Enhancements](./product_media-04-add-video-playback-enhancements.md)

**Epic Reference:** [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)
