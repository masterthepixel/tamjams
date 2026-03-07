# Story 4: Add Video Playback Enhancements (TDD)

**Goal:** Polish video playback with thumbnails, fullscreen, and lazy loading

**Approach:** Test-Driven Development

---

## Task 1: Write Tests First

### 1a. Create video enhancement tests
**File:** `src/modules/products/components/image-gallery/__tests__/video-features.test.tsx`

```typescript
describe("Video Playback Enhancements", () => {
  describe("Lazy loading", () => {
    it("should not preload videos by default", () => {
      // Video should have preload="none" initially
    })

    it("should preload metadata when thumbnail hovered", () => {
      // On hover, change to preload="metadata"
    })

    it("should load full video when clicked", () => {
      // On play, can preload="auto"
    })
  })

  describe("Poster images", () => {
    it("should display poster before video loads", () => {
      // Video should have poster attribute
    })

    it("should show play button overlay on poster", () => {
      // Play icon visible before playback
    })
  })

  describe("Fullscreen support", () => {
    it("should enable fullscreen in video controls", () => {
      // Native video controls include fullscreen
    })
  })

  describe("Performance", () => {
    it("should not impact page load with lazy-loaded videos", () => {
      // Measure page load time with/without videos
    })

    it("should handle large video files gracefully", () => {
      // Should not crash with 50MB+ files
    })
  })
})
```

### 1b. Run tests
```bash
pnpm test -- video-features.test.tsx
```

---

## Task 2: Implement Enhancements

### 2a. Add poster support to MediaItem type
**File:** `src/lib/util/combine-product-media.ts`

```typescript
export type MediaItem = {
  id: string
  url: string
  type: 'image' | 'video'
  poster?: string  // NEW: video thumbnail image URL
}
```

### 2b. Update component with enhancements
**File:** `src/modules/products/components/image-gallery/index.tsx`

```typescript
// Lazy loading: track which videos are preloaded
const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set())

// Play button overlay (before user clicks play)
{isVideo && !isPlaying && (
  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
    <PlayIcon className="w-16 h-16 text-white" />
  </div>
)}

// Video with poster
<video
  src={currentMedia.url}
  poster={currentMedia.poster}
  preload={preloadedVideos.has(currentMedia.url) ? "metadata" : "none"}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  controls
/>
```

### 2c. Update product-data.json to include posters
```json
{
  "videoUrls": [
    {
      "url": "/static/demo.mp4",
      "poster": "/static/demo-poster.jpg"
    }
  ]
}
```

---

## Task 3: Verify Tests & Manual Testing

```bash
pnpm test -- video-features.test.tsx
pnpm dev

# Manual testing:
# - Check page load speed (should not be impacted)
# - Hover over video thumbnail (should start preload)
# - Click play (should show video with controls)
# - Test fullscreen on desktop and mobile
# - Test with large video files
```

---

## Acceptance Criteria

- ✅ Video tests written and passing
- ✅ Lazy loading implemented (preload="none" by default)
- ✅ Poster images display before video loads
- ✅ Play button overlay shows before playback
- ✅ Fullscreen works on desktop and mobile
- ✅ Page load not impacted by video files
- ✅ Large files handled gracefully
- ✅ Responsive on mobile (fullscreen orientation changes work)

---

**Related Stories:**
- [Story 3: Update MediaGallery Component](./product_media-03-update-media-gallery-component.md)
- [Story 5: Add Tests and Documentation](./product_media-05-add-tests-and-documentation.md)
