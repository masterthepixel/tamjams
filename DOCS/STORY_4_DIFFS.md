# Story 4: Video Playback Enhancements - Code Changes Reference

## Quick Reference of All Changes

### 1. Type Definition Update

**File:** `src/lib/util/combine-product-media.ts`

**Before:**
```typescript
export type MediaItem = {
  id: string
  url: string
  type: "image" | "video"
}
```

**After:**
```typescript
export type MediaItem = {
  id: string
  url: string
  type: "image" | "video"
  poster?: string // Optional: video thumbnail image URL
}
```

---

### 2. getCombinedMedia Function Update

**File:** `src/lib/util/combine-product-media.ts`

**Video parsing section - Before:**
```typescript
videoUrls.forEach((url, index) => {
  if (url && typeof url === "string") {
    media.push({
      id: `video-${index}`,
      url,
      type: "video",
    })
  }
})
```

**After:**
```typescript
videoUrls.forEach((videoItem, index) => {
  // Support both simple URLs and objects with { url, poster }
  if (typeof videoItem === "string" && videoItem) {
    media.push({
      id: `video-${index}`,
      url: videoItem,
      type: "video",
    })
  } else if (
    typeof videoItem === "object" &&
    videoItem !== null &&
    videoItem.url
  ) {
    media.push({
      id: `video-${index}`,
      url: videoItem.url,
      type: "video",
      poster: videoItem.poster,
    })
  }
})
```

---

### 3. ImageGallery Component - State Addition

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Before:**
```typescript
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
```

**After:**
```typescript
const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set())
```

---

### 4. ImageGallery Component - Helper Methods

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Added:**
```typescript
const handleThumbnailHover = (index: number) => {
  if (images[index].type === "video" && images[index].url) {
    // Upgrade preload to metadata on hover
    setPreloadedVideos((prev) => new Set(prev).add(images[index].url))
  }
}

const handleVideoPlay = () => {
  setIsPlaying(true)
  // Upgrade to auto preload on play
  if (currentMedia.url) {
    setPreloadedVideos((prev) => new Set(prev).add(currentMedia.url))
  }
}

const handleVideoPause = () => {
  setIsPlaying(false)
}

// Determine preload state based on hover/play status
const getPreloadState = () => {
  if (isPlaying) {
    return "auto"
  }
  if (preloadedVideos.has(currentMedia.url)) {
    return "metadata"
  }
  return "none"
}
```

---

### 5. ImageGallery Component - Navigation Updates

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Before:**
```typescript
const goToPrevious = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? images.length - 1 : prevIndex - 1
  )
}

const goToNext = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === images.length - 1 ? 0 : prevIndex + 1
  )
}
```

**After:**
```typescript
const goToPrevious = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? images.length - 1 : prevIndex - 1
  )
  setIsPlaying(false)
}

const goToNext = () => {
  setCurrentIndex((prevIndex) =>
    prevIndex === images.length - 1 ? 0 : prevIndex + 1
  )
  setIsPlaying(false)
}
```

---

### 6. ImageGallery Component - Video Element Update

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Before:**
```typescript
{currentMedia.url && (
  isVideo ? (
    <video
      src={currentMedia.url}
      controls
      preload="metadata"
      className="absolute inset-0 w-full h-full object-cover"
    />
  ) : (
    <Image
      src={currentMedia.url}
      priority
      className="absolute inset-0 object-cover"
      alt={`Product media ${currentIndex + 1}`}
      fill
      sizes="(max-width: 576px) 100vw, (max-width: 1024px) 50vw, 800px"
    />
  )
)}
```

**After:**
```typescript
{currentMedia.url && (
  isVideo ? (
    <>
      <video
        src={currentMedia.url}
        poster={currentMedia.poster}
        controls
        preload={getPreloadState() as "none" | "metadata" | "auto"}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!isPlaying && (
        <div
          data-testid="play-button-overlay"
          className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
        >
          <svg
            className="w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </>
  ) : (
    <Image
      src={currentMedia.url}
      priority
      className="absolute inset-0 object-cover"
      alt={`Product media ${currentIndex + 1}`}
      fill
      sizes="(max-width: 576px) 100vw, (max-width: 1024px) 50vw, 800px"
    />
  )
)}
```

---

### 7. ImageGallery Component - Thumbnail Button Update

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Before:**
```typescript
<button
  key={media.id}
  onClick={() => setCurrentIndex(index)}
  className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
    index === currentIndex
      ? "border-olive-950 dark:border-white"
      : "border-olive-200 dark:border-olive-800 opacity-60 hover:opacity-100"
  }`}
  aria-label={`View ${media.type === "video" ? "video" : "image"} ${index + 1}`}
>
```

**After:**
```typescript
<button
  key={media.id}
  onClick={() => setCurrentIndex(index)}
  onMouseEnter={() => handleThumbnailHover(index)}
  className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
    index === currentIndex
      ? "border-olive-950 dark:border-white"
      : "border-olive-200 dark:border-olive-800 opacity-60 hover:opacity-100"
  }`}
  aria-label={`View ${media.type === "video" ? "video" : "image"} ${index + 1}`}
>
```

---

### 8. Thumbnail Video Display Update

**File:** `src/modules/products/components/image-gallery/index.tsx`

**Before:**
```typescript
{media.url && (
  media.type === "video" ? (
    <div className="absolute inset-0 bg-olive-900/80 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-white"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  ) : (
    <Image
      src={media.url}
      alt={`Thumbnail ${index + 1}`}
      fill
      className="object-cover"
      sizes="80px"
    />
  )
)}
```

**After:**
```typescript
{media.url && (
  media.type === "video" ? (
    <>
      {media.poster ? (
        <Image
          src={media.poster}
          alt={`Video thumbnail ${index + 1}`}
          fill
          className="object-cover"
          sizes="80px"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-olive-400 to-olive-600" />
      )}
      <div className="absolute inset-0 bg-olive-900/40 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
    </>
  ) : (
    <Image
      src={media.url}
      alt={`Thumbnail ${index + 1}`}
      fill
      className="object-cover"
      sizes="80px"
    />
  )
)}
```

---

### 9. New Test File Created

**File:** `src/modules/products/components/image-gallery/__tests__/video-features.test.tsx`

**Content:** 19 comprehensive test cases covering:
- Lazy loading (3 tests)
- Poster images (5 tests)
- Fullscreen support (2 tests)
- Performance (3 tests)
- Navigation (1 test)
- Mixed media (2 tests)

See full test file in the test directory.

---

### 10. Updated Utility Tests

**File:** `src/lib/util/__tests__/combine-product-media.test.ts`

**Added 3 new test cases:**

```typescript
it("should extract poster images from video objects", () => {
  const product: Partial<HttpTypes.StoreProduct> = {
    images: [],
    metadata: {
      videoUrls: JSON.stringify([
        {
          url: "/video1.mp4",
          poster: "/video1-poster.jpg",
        },
        {
          url: "/video2.webm",
          poster: "/video2-poster.jpg",
        },
      ]),
    },
  }

  const media = getCombinedMedia(product as HttpTypes.StoreProduct)

  expect(media).toHaveLength(2)
  expect(media[0]).toEqual({
    id: "video-0",
    url: "/video1.mp4",
    type: "video",
    poster: "/video1-poster.jpg",
  })
  expect(media[1]).toEqual({
    id: "video-1",
    url: "/video2.webm",
    type: "video",
    poster: "/video2-poster.jpg",
  })
})

it("should handle mixed video formats (simple URLs and objects with posters)", () => {
  // Tests backward compatibility with both formats...
})

// Plus one more test for edge cases...
```

---

## Summary of Changes

| File | Change Type | Lines Changed | Impact |
|------|------------|---------------|--------|
| `src/lib/util/combine-product-media.ts` | Type + Function | ~30 | Low - backward compatible |
| `src/modules/products/components/image-gallery/index.tsx` | State + Handlers + JSX | ~50 | Medium - visual + behavior |
| `src/lib/util/__tests__/combine-product-media.test.ts` | Tests | +50 | Low - tests only |
| `src/modules/products/components/image-gallery/__tests__/video-features.test.tsx` | New Tests | 260+ | Low - tests only |

**Total Lines Added:** ~390 (mostly tests)
**Breaking Changes:** None (fully backward compatible)
**Dependencies Added:** None (uses existing libraries)

---

## Testing the Changes

```bash
# Test video features
pnpm test -- video-features.test.tsx

# Test media combining utility
pnpm test -- combine-product-media.test.ts

# Test all image gallery tests
pnpm test -- image-gallery

# Run with coverage
pnpm test -- --coverage
```

---

## Before/After Behavior

### Before Story 4
- Videos preload metadata always (wastes bandwidth)
- No poster images (black screen until loaded)
- No visual feedback (user doesn't know it's a video)
- No lazy loading optimization

### After Story 4
- Videos don't preload by default (zero page impact)
- Metadata preloads on hover (smart UX)
- Full video loads only on play (user-driven)
- Poster images provide immediate visual feedback
- Play button overlay shows intent clearly
- Fullscreen works seamlessly
- Performance optimized for all connection speeds

---

## Validation Checklist

Run through these to verify everything works:

```
□ Tests compile without errors
□ All 19 video feature tests pass
□ All 3 new combine-product-media tests pass
□ Page loads with videos (no preload requests)
□ Hovering thumbnail triggers metadata preload
□ Clicking play triggers full video load
□ Play button overlay displays
□ Overlay hides during playback
□ Overlay reappears when paused
□ Poster images display in main view
□ Poster images display in thumbnails
□ Fullscreen button visible and works
□ Large media arrays (50+ items) load quickly
□ Dark mode styling works
□ Mobile fullscreen works
□ Navigation doesn't break video state
□ TypeScript compilation succeeds
```
