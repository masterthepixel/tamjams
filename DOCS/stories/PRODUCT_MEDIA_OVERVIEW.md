# Product Media Carousel Feature - Story Overview

## Epic Goal

Add support for video and mixed-media carousels to product pages, allowing merchants to showcase product demonstrations, usage clips, and marketing videos alongside product images.

**Epic Reference:** [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)

---

## Story Breakdown (TDD Approach)

Each story follows **Test-Driven Development**: write tests first, implement to make tests pass, verify with manual testing.

### Story 1: [Extend Product Metadata to Support Video URLs](./product_media-01-extend-metadata-for-videos.md) (TDD)
**Sprint:** Backend Foundation
**Effort:** 3 hours (includes tests)
**Goal:** Enable storing video URLs in product metadata

**Task 1 - Write Tests:**
- Unit test for ProductData interface
- Unit tests for metadata serialization
- Integration test for API responses

**Task 2 - Implement:**
- Update product-data.json with videoUrls
- Update ProductData interfaces (both scripts)
- Update seed and metadata scripts
- Add videoUrls to metadata objects

**Task 3 - Verify:**
- Run tests (all should pass)
- Manual verification with curl

**Acceptance:** ✅ Tests passing, API returns videoUrls correctly

---

### Story 2: [Update Frontend Data Fetching for Video Metadata](./product_media-02-update-frontend-data-fetching.md) (TDD)
**Sprint:** Frontend - Data Layer
**Effort:** 3 hours (includes tests)
**Depends on:** Story 1
**Goal:** Create utility to combine images + videos

**Task 1 - Write Tests:**
- Unit tests for getCombinedMedia() utility
- Tests for image handling, video handling, combined media
- Integration tests with API responses

**Task 2 - Implement:**
- Create combine-product-media.ts utility
- Export MediaItem type
- Handle all edge cases

**Task 3 - Verify:**
- Run unit and integration tests
- Manual browser console verification

**Acceptance:** ✅ Utility tests passing, handles all edge cases

---

### Story 3: [Update MediaGallery Component to Support Videos](./product_media-03-update-media-gallery-component.md) (TDD)
**Sprint:** Frontend - Components
**Effort:** 5 hours (includes tests)
**Depends on:** Story 2
**Goal:** Render mixed media carousel

**Task 1 - Write Tests:**
- Component tests for image rendering
- Component tests for video rendering
- Navigation tests (next/prev/thumbnails)
- Edge case tests (empty, single item, missing URLs)

**Task 2 - Implement:**
- Update ImageGallery component
- Update product page to use combined media
- Update template
- Conditional rendering for video/image

**Task 3 - Verify:**
- Component tests pass
- Browser visual verification

**Acceptance:** ✅ Tests passing, carousel works with mixed media

---

### Story 4: [Add Video Playback Enhancements](./product_media-04-add-video-playback-enhancements.md) (TDD)
**Sprint:** Frontend - Polish
**Effort:** 3 hours (includes tests)
**Depends on:** Story 3
**Goal:** Polish video experience

**Task 1 - Write Tests:**
- Lazy loading behavior tests
- Poster image tests
- Fullscreen tests
- Performance tests

**Task 2 - Implement:**
- Add poster support to MediaItem type
- Implement lazy loading
- Add play button overlay
- Update metadata structure

**Task 3 - Verify:**
- Video feature tests pass
- Performance testing
- Mobile fullscreen testing

**Acceptance:** ✅ Video enhancements working, tests passing

---

### Story 5: [Ensure Tests Pass & Complete Documentation](./product_media-05-add-tests-and-documentation.md) (TDD Final)
**Sprint:** Testing & Docs
**Effort:** 5 hours (tests + docs)
**Depends on:** Stories 1-4
**Goal:** Validate and document

**Task 1 - Run All Tests:**
- Backend tests (unit + integration)
- Frontend tests (unit + integration)
- Coverage report (target > 80%)

**Task 2 - Write E2E Tests:**
- End-to-end flow tests
- Mobile viewport tests
- Variant selection with videos

**Task 3 - Complete Documentation:**
- Update feature documentation
- Create developer guide
- Create merchant guide
- Update API reference
- Document media examples

**Task 4 - Verification:**
- All tests passing
- Coverage > 80%
- Manual testing checklist
- Build verification

**Acceptance:** ✅ Full test coverage, complete documentation, zero warnings

---

## Implementation Timeline (TDD Approach)

```
Week 1:
  Day 1-2: Story 1 (Backend + unit + integration tests) → PR Review
  Day 3-4: Story 2 (Utility + comprehensive tests) → PR Review

Week 2:
  Day 1-2: Story 3 (Component + component tests) → PR Review
  Day 3: Story 4 (Enhancements + video tests) → PR Review
  Day 4-5: Story 5 (E2E tests + full documentation) → PR Review

Estimated Total: 19 hours (includes test writing)
- Story 1: 3 hours (1.5 tests + 1.5 impl)
- Story 2: 3 hours (1.5 tests + 1.5 impl)
- Story 3: 5 hours (2 tests + 3 impl)
- Story 4: 3 hours (1 tests + 2 impl)
- Story 5: 5 hours (2 E2E tests + 3 docs)

TDD adds ~30% time upfront but saves debugging/rework later.
```

---

## Technology Stack

**Backend:**
- Medusa V2 (product metadata)
- TypeScript
- Jest (testing)

**Frontend:**
- React (hooks: useState)
- Next.js 15 (Image component, SSR)
- Tailwind CSS (styling)
- Native HTML5 `<video>` element

**No new dependencies needed** — uses existing tech stack

---

## Key Design Decisions

### 1. Metadata Approach (Not Custom Module)
- **Why:** Lightweight, no migrations, leverages existing metadata field
- **Trade-off:** No separate querying of video data; queries must fetch metadata
- **Future:** If we need video-specific queries/filtering, can migrate to custom module

### 2. Native `<video>` (Not Third-Party)
- **Why:** Excellent browser support, accessibility out-of-box, no dependencies
- **Trade-off:** Limited custom styling of controls (can be worked around with CSS)
- **Future:** Can add HLS/DASH streaming for adaptive bitrate

### 3. Lazy Loading Videos
- **Why:** Reduces page load time and bandwidth for users with slow connections
- **Trade-off:** Videos don't start immediately; requires user interaction
- **Benefit:** Better Core Web Vitals scores

### 4. Carousel-First Design
- **Why:** Consistent with existing image gallery; familiar to users
- **Alternative considered:** Separate video section below images (rejected: less engaging)

---

## File Structure After Completion

```
src/
├── lib/
│   ├── data/
│   │   └── products.ts (updated: requests +metadata)
│   └── util/
│       ├── combine-product-media.ts (new)
│       └── __tests__/
│           └── combine-product-media.test.ts
├── modules/
│   └── products/
│       └── components/
│           └── image-gallery/
│               ├── index.tsx (renamed to MediaGallery)
│               └── __tests__/
│                   └── index.test.tsx
└── app/
    └── [countryCode]/
        └── (main)/
            └── products/
                └── [handle]/
                    └── page.tsx (updated: uses combined media)

backend/
├── src/
│   └── scripts/
│       ├── seed-products.ts (updated: handle videos)
│       └── update-product-metadata.ts (updated: handle videos)
├── static/
│   ├── sample-video.mp4 (new: example video)
│   └── sample-video-poster.jpg (new: example poster)
└── __tests__/
    ├── scripts/
    │   └── seed-products.test.ts (updated: test videos)
    └── integration/
        └── store-products.test.ts (updated: test video API responses)

DOCS/
├── stories/
│   ├── product_media-01-*.md
│   ├── product_media-02-*.md
│   ├── product_media-03-*.md
│   ├── product_media-04-*.md
│   ├── product_media-05-*.md
│   └── PRODUCT_MEDIA_OVERVIEW.md (this file)
├── DEV_GUIDE_VIDEOS.md (new)
├── MERCHANT_GUIDE_VIDEOS.md (new)
└── MEDIA_EXAMPLES.md (new)
```

---

## Success Metrics

After completing all stories, you'll have:

✅ **Product videos stored** in database (metadata.videoUrls)
✅ **Videos fetched** from API alongside images
✅ **Mixed-media carousel** on product pages (images + videos)
✅ **Video playback controls** with fullscreen support
✅ **Lazy-loaded videos** for performance
✅ **Full test coverage** (unit + integration tests)
✅ **Complete documentation** (dev guide + merchant guide)
✅ **Example seed data** with sample videos

---

## Known Limitations & Future Work

### Current Implementation
- Video URLs stored in metadata (not searchable)
- No video admin UI (API/manual management only)
- No captions/subtitles support
- No adaptive bitrate streaming (HLS/DASH)
- No video analytics tracking
- No YouTube/Vimeo embed support

### Potential Future Enhancements
1. **Admin Dashboard** — UI for uploading/managing videos
2. **Advanced Streaming** — HLS/DASH for large files
3. **Captions** — WebVTT support for accessibility
4. **Analytics** — Track video plays, completion rates
5. **External Videos** — YouTube/Vimeo embed support
6. **User-Generated Content** — Allow customer video uploads
7. **Video Comparison** — Side-by-side videos for variants
8. **3D Models** — Extension to product-3d-model epic

---

## Questions & Decisions Needed

Before starting Story 1, clarify:

1. **Video Sources:**
   - Should merchants host videos (our servers)?
   - Or link to external CDN/YouTube?
   - Or both (with preference)?

2. **Video Formats:**
   - Just MP4, or also WebM?
   - Size limits?
   - Duration limits?

3. **Admin Workflow:**
   - Manual API/script (stories assume this)?
   - Or implement admin UI later?

4. **Analytics:**
   - Track video engagement?
   - Store video metrics (plays, completion)?

5. **Accessibility:**
   - Add captions requirement?
   - Or nice-to-have for future?

---

## Starting the Work

Ready to begin? Follow these steps:

1. **Review** verification: [VERIFICATION_CHECKLIST.md](./VERIFICATION_CHECKLIST.md) ← Read this first!
2. **Read** the product media carousel epic: [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)
3. **Start** with Story 1: [product_media-01-extend-metadata-for-videos.md](./product_media-01-extend-metadata-for-videos.md)
4. **Create PR** when Story 1 is complete
5. **Proceed** to Story 2 after Story 1 is merged
6. Continue through Stories 3, 4, 5 in order

Each story has clear acceptance criteria and implementation examples. Use them as your working specification.

## Important Notes from Verification

**Interface Duplication ⚠️**
- ProductData interface is defined in TWO scripts:
  - `backend/src/scripts/seed-products.ts`
  - `backend/src/scripts/update-product-metadata.ts`
- When adding `videoUrls`, **update BOTH interfaces** or TypeScript will error
- See Story 1 for exact locations and what to add

**Metadata Stringification ✅ VERIFIED**
- Complex metadata (like nutrition) is JSON.stringified
- Frontend already has JSON.parse() with error handling
- Pattern is proven and working — videoUrls will follow same pattern
- No schema changes needed — all happens in scripts

**Frontend Already Requests Metadata ✅ VERIFIED**
- `src/lib/data/products.ts` already includes `+metadata` in field selectors
- No data fetching changes needed in Story 2
- Only need to create the utility to combine images + videos

---

**Questions?** Refer to the feature epic or individual story files for more context.

Happy coding! 🎬
