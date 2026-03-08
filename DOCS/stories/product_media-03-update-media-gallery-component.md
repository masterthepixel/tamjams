# Story 3: Update MediaGallery Component to Support Videos (TDD)

**Goal:** Enhance gallery component to display both images and videos with proper controls

**Approach:** Test-Driven Development (component tests first)

## Task 1: Write Component Tests

### 1a. Create component tests
**File:** `src/modules/products/components/image-gallery/__tests__/index.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react"
import ImageGallery from "../index"

const mockMedia = [
  { id: "img-1", url: "/image1.jpg", type: "image" as const },
  { id: "img-2", url: "/image2.jpg", type: "image" as const },
  { id: "video-1", url: "/video1.mp4", type: "video" as const },
]

describe("ImageGallery (MediaGallery)", () => {
  describe("Image rendering", () => {
    it("should render image elements for image media", () => {
      render(<ImageGallery images={mockMedia} />)
      // Should render without crashing
      expect(screen.getByRole("img")).toBeInTheDocument()
    })

    it("should display image count", () => {
      render(<ImageGallery images={mockMedia} />)
      // Counter should show "1 / 3"
      expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument()
    })
  })

  describe("Video rendering", () => {
    it("should render video element for video media", () => {
      render(<ImageGallery images={mockMedia} />)
      // Start on first image, then navigate to video
      const nextButton = screen.getByRole("button", { name: /next/i })
      fireEvent.click(nextButton) // Move past first image
      fireEvent.click(nextButton) // Move to video

      const videoElement = screen.getByRole("button").querySelector("video")
      expect(videoElement).toBeInTheDocument()
    })

    it("should include video controls", () => {
      render(<ImageGallery images={mockMedia} />)
      // Navigate to video
      const nextButton = screen.getByRole("button", { name: /next/i })
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)

      const videoElement = screen.getByRole("button").querySelector("video")
      expect(videoElement).toHaveAttribute("controls")
    })
  })

  describe("Navigation", () => {
    it("should navigate between mixed media types", () => {
      render(<ImageGallery images={mockMedia} />)

      // Start at first image
      expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument()

      // Navigate next
      const nextButton = screen.getByRole("button", { name: /next/i })
      fireEvent.click(nextButton)
      expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument()

      fireEvent.click(nextButton)
      expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument()
    })

    it("should wrap around on next from last item", () => {
      render(<ImageGallery images={mockMedia} />)

      const nextButton = screen.getByRole("button", { name: /next/i })
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)
      fireEvent.click(nextButton) // Should wrap to first

      expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument()
    })

    it("should wrap around on previous from first item", () => {
      render(<ImageGallery images={mockMedia} />)

      const prevButton = screen.getByRole("button", { name: /previous/i })
      fireEvent.click(prevButton) // Should wrap to last

      expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument()
    })
  })

  describe("Thumbnails", () => {
    it("should render thumbnail for each media item", () => {
      render(<ImageGallery images={mockMedia} />)

      const thumbnailButtons = screen.getAllByRole("button", { name: /view image|view media/i })
      expect(thumbnailButtons.length).toBe(3)
    })

    it("should jump to media when thumbnail clicked", () => {
      render(<ImageGallery images={mockMedia} />)

      const thumbnailButtons = screen.getAllByRole("button", { name: /view image|view media/i })
      fireEvent.click(thumbnailButtons[2]) // Click last thumbnail

      expect(screen.getByText(/3 \/ 3/)).toBeInTheDocument()
    })
  })

  describe("Edge cases", () => {
    it("should handle empty media array", () => {
      const { container } = render(<ImageGallery images={[]} />)
      expect(container.firstChild).toBeEmptyDOMElement()
    })

    it("should handle single media item", () => {
      render(<ImageGallery images={[mockMedia[0]]} />)

      // Should not show navigation buttons for single item
      const navButtons = screen.queryAllByRole("button", { name: /(next|previous)/i })
      expect(navButtons.length).toBe(0)
    })

    it("should handle missing URLs gracefully", () => {
      const badMedia = [
        { id: "img-1", url: "", type: "image" as const },
        { id: "img-2", url: "/image2.jpg", type: "image" as const },
      ]

      render(<ImageGallery images={badMedia} />)
      expect(screen.getByText(/1 \/ 2/)).toBeInTheDocument()
    })
  })
})
```

### 1b. Run tests (they should FAIL)
```bash
pnpm test -- image-gallery.test.tsx
```

---

## Task 2: Implement Component

### 2a. Update component to support mixed media
**File:** `src/modules/products/components/image-gallery/index.tsx`

Update component to:
1. Change prop type from `HttpTypes.StoreProductImage[]` to `MediaItem[]`
2. Add conditional rendering for video elements
3. Update thumbnail rendering for both images and videos
4. Add video controls and play button overlay

Key changes:
```typescript
type MediaItem = {
  id: string
  url: string
  type: 'image' | 'video'
}

type ImageGalleryProps = {
  images: MediaItem[]  // Changed from StoreProductImage[]
}

// Render video or image based on type
const isVideo = currentMedia.type === 'video'

{isVideo ? (
  <video src={currentMedia.url} controls preload="metadata" />
) : (
  <Image src={currentMedia.url} {...imageProps} />
)}
```

### 2b. Update product page to use combined media
**File:** `src/app/[countryCode]/(main)/products/[handle]/page.tsx`

```typescript
import { getCombinedMedia } from "@lib/util/combine-product-media"

// In component:
const media = getCombinedMedia(pricedProduct)

<ImageGallery images={media} />
```

### 2c. Update template
**File:** `src/modules/products/templates/index.tsx`

Update to accept and pass combined media instead of just images.

---

## Task 3: Verify Tests Pass

```bash
pnpm test -- image-gallery.test.tsx
pnpm dev
# Visit product page and verify carousel works with videos
```

---

## Acceptance Criteria

- ✅ Component tests written and passing
- ✅ Images render correctly with `<Image>` component
- ✅ Videos render with `<video>` and controls
- ✅ Navigation works across mixed media types
- ✅ Thumbnails show for all media types
- ✅ Component handles edge cases (empty, single item, missing URLs)
- ✅ Dark mode styling maintained
- ✅ Aspect ratio preserved for all media

---

**Related Stories:**
- [Story 2: Update Frontend Data Fetching](./product_media-02-update-frontend-data-fetching.md)
- [Story 4: Add Video Playback Enhancements](./product_media-04-add-video-playback-enhancements.md)
