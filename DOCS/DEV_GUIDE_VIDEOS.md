# Product Media Developer Guide

This guide covers how to add, test, and manage product videos in the TamsJam storefront.

## Quick Start

### Adding videos to a product

1. **Edit product data file**
   ```bash
   cd /home/mastethepixel/GitHub/TamsJam
   # Edit DOCS/product-data.json
   ```

2. **Add videoUrls array to the product**
   ```json
   {
     "title": "Tam's Jams - Strawberry",
     "handle": "tams-jams-strawberry",
     "videoUrls": [
       "/static/strawberry-demo.mp4",
       "/static/strawberry-usage.webm"
     ],
     // ... other fields
   }
   ```

3. **Run seed and update scripts**
   ```bash
   cd backend
   pnpm seed:products     # Create/update products
   pnpm update:metadata   # Update metadata including videos
   ```

4. **Verify in browser**
   ```
   http://localhost:8000/us/products/tams-jams-strawberry
   ```

## Architecture

### Backend: Data Storage (Story 1)

**Location:** `backend/src/scripts/`

**Pattern:** Video URLs stored in `product.metadata.videoUrls` as stringified JSON array.

**Why metadata?**
- No schema changes needed
- Leverages existing Medusa pattern (like nutrition facts)
- Simple and maintainable
- Works with existing SDK

**Example metadata:**
```typescript
metadata: {
  flavor: "Strawberry",
  ingredients: "Strawberries, Cane Sugar, ...",
  videoUrls: JSON.stringify(["/video1.mp4", "/video2.webm"]),
  nutrition: "{...}",
  storage: "Refrigerate after opening"
}
```

**Key files:**
- `backend/src/scripts/seed-products.ts` — Creates products with videoUrls
- `backend/src/scripts/update-product-metadata.ts` — Updates product metadata
- `backend/DOCS/product-data.json` — Product data including videoUrls

### Frontend: Data Fetching (Story 2)

**Location:** `src/lib/data/products.ts`

**Current implementation:**
```typescript
// Already includes +metadata in field selector
fields: "title,handle,description,*variants.calculated_price,+metadata"
```

The `+metadata` field selector ensures the API returns the metadata object including videoUrls.

### Frontend: Media Utility (Story 2)

**Location:** `src/lib/util/combine-product-media.ts`

**Purpose:** Combine images and video URLs into a single array for the gallery.

**Usage:**
```typescript
import { getCombinedMedia, type MediaItem } from "@lib/util/combine-product-media"

const product = await fetchProduct()
const media = getCombinedMedia(product)

// Result: [
//   { id: "img-1", url: "...", type: "image" },
//   { id: "video-0", url: "...", type: "video", poster?: "..." }
// ]

media.forEach(item => {
  if (item.type === 'video') {
    // Render <video>
  } else {
    // Render <Image>
  }
})
```

**MediaItem Type:**
```typescript
type MediaItem = {
  id: string
  url: string
  type: "image" | "video"
  poster?: string // Optional: video thumbnail
}
```

### Frontend: Component (Stories 3 & 4)

**Location:** `src/modules/products/components/image-gallery/index.tsx`

**Features:**
- Renders mixed media carousel (images + videos)
- Lazy-loaded videos (no preload by default)
- Video controls with fullscreen support
- Play button overlay
- Thumbnail navigation
- Mobile responsive
- Dark mode support

**Props:**
```typescript
type ImageGalleryProps = {
  images: MediaItem[]
}
```

**Usage in product detail page:**
```typescript
import { getCombinedMedia } from "@lib/util/combine-product-media"
import ImageGallery from "@modules/products/components/image-gallery"

const product = await getProduct(handle)
const media = getCombinedMedia(product)

return <ImageGallery images={media} />
```

## Testing

### Running Tests

**Frontend tests:**
```bash
# All frontend tests
pnpm test

# Specific test file
pnpm test -- combine-product-media.test.ts
pnpm test -- image-gallery

# Watch mode
pnpm test -- --watch

# Coverage report
pnpm test:coverage
```

**Backend tests:**
```bash
cd backend

# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# All tests
pnpm test
```

### Test Files

**Frontend:**
- `src/lib/util/__tests__/combine-product-media.test.ts` — Utility tests
- `src/modules/products/components/image-gallery/__tests__/index.test.tsx` — Component tests
- `src/modules/products/components/image-gallery/__tests__/video-features.test.tsx` — Video feature tests
- `__tests__/integration/product-media-e2e.test.ts` — End-to-end tests

**Backend:**
- `backend/__tests__/scripts/seed-products.test.ts` — Seed script tests
- `backend/__tests__/integration/product-videos.test.ts` — API integration tests

### Writing New Tests

**Test the utility:**
```typescript
import { getCombinedMedia } from "@lib/util/combine-product-media"

describe("getCombinedMedia", () => {
  it("should combine images and videos", () => {
    const product = {
      images: [{ id: "img-1", url: "/image.jpg" }],
      metadata: { videoUrls: JSON.stringify(["/video.mp4"]) }
    }

    const media = getCombinedMedia(product)
    expect(media).toHaveLength(2)
    expect(media[0].type).toBe("image")
    expect(media[1].type).toBe("video")
  })
})
```

**Test the component:**
```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import ImageGallery from "@modules/products/components/image-gallery"

describe("ImageGallery", () => {
  it("should navigate between media", () => {
    const images = [
      { id: "img-1", url: "/image.jpg", type: "image" as const },
      { id: "video-1", url: "/video.mp4", type: "video" as const }
    ]

    render(<ImageGallery images={images} />)

    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    expect(screen.getByText(/2 \/ 2/)).toBeInTheDocument()
  })
})
```

## Common Issues & Troubleshooting

### Videos not showing

**Check 1: API includes +metadata**
```bash
curl "http://localhost:9000/store/products?handle=tams-jams-strawberry&fields=+metadata" \
  -H "x-publishable-api-key: pk_..." | jq '.products[0].metadata.videoUrls'
```

Expected output:
```json
"[\"/static/strawberry-demo.mp4\",\"/static/strawberry-usage.webm\"]"
```

**Check 2: Frontend utility parses metadata**
Open browser console and test:
```javascript
const product = { metadata: { videoUrls: '["url1.mp4"]' } }
const parsed = JSON.parse(product.metadata.videoUrls)
console.log(parsed) // Should be array
```

**Check 3: Video files exist**
```bash
# Check if video files are in the static directory
ls -la backend/static/
```

### Component not rendering

**Check 1: Component receives media array**
```typescript
const media = getCombinedMedia(product)
console.log(media) // Should have at least one item
```

**Check 2: MediaItem types are correct**
```typescript
media.forEach(item => {
  console.log(item.type) // Should be "image" or "video"
  console.log(item.url)  // Should be non-empty string
})
```

### Tests failing

**Check Jest config:**
```bash
# Verify jest.config.js exists
cat jest.config.js
```

**Check test dependencies:**
```bash
# Reinstall dev dependencies
pnpm install
```

**Run specific test with debug output:**
```bash
pnpm test -- combine-product-media.test.ts --verbose
```

## Best Practices

### 1. Video Format & Size
- **Formats:** MP4 (widely supported), WebM (modern browsers)
- **Size:** < 50MB per video recommended
- **Resolution:** 720p minimum for quality
- **Duration:** 30 seconds - 5 minutes ideal

### 2. Video URLs
- **Relative paths:** `/static/demo.mp4` (hosted on your server)
- **Absolute URLs:** `https://example.com/video.mp4` (external CDN)
- **Always use HTTPS** for absolute URLs

### 3. Poster Images
- **Purpose:** Shows before video loads
- **Recommended:** 1-3 seconds into the video
- **Format:** JPEG or WebP (smallest file size)
- **Size:** Same aspect ratio as video
- **Example:** `poster="/static/demo-poster.jpg"`

### 4. Accessibility
- **Captions:** Not currently supported (consider future enhancement)
- **Audio:** Test on mute (many users watch videos without sound)
- **Controls:** Native HTML5 video controls are accessible by default

### 5. Performance
- **Lazy loading:** Videos don't preload by default (good for page speed)
- **Hover preload:** Videos preload metadata when thumbnail is hovered
- **Auto preload:** Full video loads only when user presses play
- **Images first:** Load images before videos for better perceived performance

### 6. Testing Workflow

```bash
# 1. Make changes
# Edit product-data.json or seed scripts

# 2. Test changes locally
pnpm dev  # Frontend
cd backend && pnpm dev  # Backend (separate terminal)

# 3. Run test suite
pnpm test              # Frontend
cd backend && pnpm test # Backend

# 4. Check coverage
pnpm test:coverage

# 5. Build for production
pnpm build

# 6. Visual testing
# Visit http://localhost:8000/us/products/[handle]
```

## Future Enhancements

### Near-term
1. **Admin UI** — Drag-and-drop video upload in Medusa admin
2. **Poster auto-generation** — Extract first frame automatically
3. **Video transcoding** — Auto-convert to multiple formats

### Medium-term
1. **Adaptive streaming** — HLS/DASH for large files
2. **Video captions** — WebVTT subtitle support
3. **Analytics** — Track video plays, completion rates

### Long-term
1. **3D models** — Extension to product-3d-model epic
2. **360° videos** — Immersive product views
3. **User-generated videos** — Customer review videos

## Related Documentation

- **Feature Spec:** [DOCS/FEATURES/product-media-carousel.md](../FEATURES/product-media-carousel.md)
- **Merchant Guide:** [DOCS/MERCHANT_GUIDE_VIDEOS.md](./MERCHANT_GUIDE_VIDEOS.md)
- **API Reference:** [DOCS/API_REFERENCE.md](./API_REFERENCE.md) (Product Media section)
- **Story Overview:** [DOCS/stories/PRODUCT_MEDIA_OVERVIEW.md](../stories/PRODUCT_MEDIA_OVERVIEW.md)

## Questions?

If you run into issues or have questions:

1. Check this guide (troubleshooting section)
2. Review the test files for usage examples
3. Check git commit history for recent changes
4. Open an issue with detailed reproduction steps

---

**Last Updated:** 2026-03-05
**Status:** Production Ready
**Coverage:** > 80% (see coverage report)
