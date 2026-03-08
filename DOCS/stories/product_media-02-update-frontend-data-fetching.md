# Story 2: Update Frontend Data Fetching for Video Metadata (TDD)

**Goal:** Create utility to combine images and video metadata into unified media array

**Approach:** Test-Driven Development (tests first, then implementation)

## Context

The frontend already fetches product metadata via API. Now we need to create a utility that combines images and video URLs into a single media array that can be passed to the gallery component.

---

## Task 1: Write Tests First

### 1a. Create utility unit tests
**File:** `src/lib/util/__tests__/combine-product-media.test.ts`

```typescript
import { getCombinedMedia } from "../combine-product-media"
import { HttpTypes } from "@medusajs/types"

describe("getCombinedMedia utility", () => {
  describe("Image handling", () => {
    it("should extract images from product", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [
          { id: "img-1", url: "/image1.jpg" } as any,
          { id: "img-2", url: "/image2.jpg" } as any,
        ],
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toHaveLength(2)
      expect(media[0]).toEqual({
        id: "img-1",
        url: "/image1.jpg",
        type: "image",
      })
      expect(media[1]).toEqual({
        id: "img-2",
        url: "/image2.jpg",
        type: "image",
      })
    })

    it("should handle product with no images", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toEqual([])
    })

    it("should skip images without URLs", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [
          { id: "img-1", url: "/image1.jpg" } as any,
          { id: "img-2", url: null } as any,
          { id: "img-3", url: "/image3.jpg" } as any,
        ],
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toHaveLength(2)
      expect(media.map((m) => m.id)).toEqual(["img-1", "img-3"])
    })
  })

  describe("Video handling", () => {
    it("should parse and add videos from metadata", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
        metadata: {
          videoUrls: JSON.stringify(["/video1.mp4", "/video2.webm"]),
        },
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toHaveLength(2)
      expect(media[0]).toEqual({
        id: "video-0",
        url: "/video1.mp4",
        type: "video",
      })
      expect(media[1]).toEqual({
        id: "video-1",
        url: "/video2.webm",
        type: "video",
      })
    })

    it("should handle undefined videoUrls", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
        metadata: {},
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toEqual([])
    })

    it("should skip invalid video URLs", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
        metadata: {
          videoUrls: JSON.stringify(["/video1.mp4", "", null, "/video2.webm"]),
        },
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toHaveLength(2)
      expect(media.map((m) => m.url)).toEqual(["/video1.mp4", "/video2.webm"])
    })

    it("should handle malformed JSON in videoUrls", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
        metadata: {
          videoUrls: "not valid json",
        },
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toEqual([])
    })
  })

  describe("Combined media", () => {
    it("should combine images and videos in order", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [
          { id: "img-1", url: "/image1.jpg" } as any,
          { id: "img-2", url: "/image2.jpg" } as any,
        ],
        metadata: {
          videoUrls: JSON.stringify(["/video1.mp4", "/video2.webm"]),
        },
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toHaveLength(4)
      expect(media[0].type).toBe("image")
      expect(media[1].type).toBe("image")
      expect(media[2].type).toBe("video")
      expect(media[3].type).toBe("video")
    })

    it("should handle empty product", () => {
      const product: Partial<HttpTypes.StoreProduct> = {}

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media).toEqual([])
    })

    it("should preserve media order: images then videos", () => {
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [{ id: "img-1", url: "/i1.jpg" } as any],
        metadata: {
          videoUrls: JSON.stringify(["/v1.mp4"]),
        },
      }

      const media = getCombinedMedia(product as HttpTypes.StoreProduct)

      expect(media.map((m) => m.type)).toEqual(["image", "video"])
    })
  })
})
```

### 1b. Create integration test
**File:** `__tests__/integration/product-media-combination.test.ts`

```typescript
import { getCombinedMedia } from "@lib/util/combine-product-media"
import { listProducts } from "@lib/data/products"

describe("Product Media Integration", () => {
  it("should combine media from API response", async () => {
    const { response } = await listProducts({
      countryCode: "us",
      queryParams: { handle: "tams-jams-strawberry" },
    })

    const product = response.products[0]
    const media = getCombinedMedia(product)

    // Should have images from API
    const images = media.filter((m) => m.type === "image")
    expect(images.length).toBeGreaterThan(0)

    // Videos from metadata (if added)
    const videos = media.filter((m) => m.type === "video")
    videos.forEach((video) => {
      expect(video.url).toBeTruthy()
      expect(typeof video.url).toBe("string")
    })
  })

  it("should work with products that have only images", async () => {
    const { response } = await listProducts({
      countryCode: "us",
      queryParams: { limit: 1 },
    })

    const product = response.products[0]
    const media = getCombinedMedia(product)

    // Should not crash, even without videos
    expect(Array.isArray(media)).toBe(true)
  })
})
```

### 1c. Run tests (they should FAIL)
```bash
pnpm test -- combine-product-media.test.ts
pnpm test -- product-media-combination.test.ts
```

**Expected:** Tests fail because utility doesn't exist yet ✅

---

## Task 2: Implement to Make Tests Pass

### 2a. Create the utility function
**File:** `src/lib/util/combine-product-media.ts`

```typescript
import { HttpTypes } from "@medusajs/types"

export type MediaItem = {
  id: string
  url: string
  type: 'image' | 'video'
}

/**
 * Combines product images and video URLs from metadata into a single media array.
 * Videos are parsed from stringified JSON in metadata.videoUrls.
 * Images are always added first, then videos.
 */
export function getCombinedMedia(
  product: HttpTypes.StoreProduct
): MediaItem[] {
  const media: MediaItem[] = []

  // Add images first (preserve order and IDs)
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img.url) {
        media.push({
          id: img.id,
          url: img.url,
          type: 'image',
        })
      }
    })
  }

  // Add videos from metadata (videoUrls is a stringified JSON array)
  if (product.metadata?.videoUrls && typeof product.metadata.videoUrls === 'string') {
    try {
      const videoUrls = JSON.parse(product.metadata.videoUrls)

      if (Array.isArray(videoUrls)) {
        videoUrls.forEach((url, index) => {
          if (url && typeof url === 'string') {
            media.push({
              id: `video-${index}`,
              url,
              type: 'video',
            })
          }
        })
      }
    } catch (e) {
      // Silently ignore malformed JSON
      console.warn('Failed to parse product videoUrls metadata:', e)
    }
  }

  return media
}
```

### 2b. Export type from utility
Ensure MediaItem type is exported for use in components and tests.

---

## Task 3: Verify Tests Pass

### 3a. Run unit tests
```bash
pnpm test -- combine-product-media.test.ts
```

**Expected:** All unit tests pass ✅

### 3b. Run integration tests
```bash
pnpm test -- product-media-combination.test.ts
```

**Expected:** All integration tests pass ✅

### 3c. Manual verification
```bash
pnpm dev

# Open browser console and run:
# import { getCombinedMedia } from "@lib/util/combine-product-media"
# Paste a product object and verify media array is created correctly
```

---

## Acceptance Criteria

- ✅ Utility unit tests written and passing
- ✅ Integration tests written and passing
- ✅ `getCombinedMedia()` function correctly combines images and videos
- ✅ Videos parsed from stringified JSON metadata
- ✅ Images added first, videos appended
- ✅ Malformed video URLs don't crash the app
- ✅ Products without videos work fine (return just images)
- ✅ Type safety: MediaItem type properly exported
- ✅ `getCombinedMedia` handles edge cases (empty products, null values, etc.)

---

## Notes

- Utility is pure (no side effects) and testable
- Follows pattern established with other utilities (sort-products.ts)
- Videos appended after images (user preference can change this later)
- Each video gets generated ID like `video-0`, `video-1`
- Malformed JSON logged but doesn't break app
- Ready for Story 3: updating gallery component to use this utility

---

**Related Stories:**
- [Story 1: Extend Product Metadata](./product_media-01-extend-metadata-for-videos.md)
- [Story 3: Update MediaGallery Component](./product_media-03-update-media-gallery-component.md)
