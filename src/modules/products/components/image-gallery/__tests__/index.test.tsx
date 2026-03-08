import { render, screen, fireEvent } from "@testing-library/react"
import ImageGallery from "../index"
import { MediaItem } from "@lib/util/combine-product-media"

const mockMedia: MediaItem[] = [
  { id: "img-1", url: "/image1.jpg", type: "image" },
  { id: "img-2", url: "/image2.jpg", type: "image" },
  { id: "video-1", url: "/video1.mp4", type: "video" },
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

      const videoElement = screen.getAllByRole("button")[0].querySelector("video")
      expect(videoElement).toBeInTheDocument()
    })

    it("should include video controls", () => {
      render(<ImageGallery images={mockMedia} />)
      // Navigate to video
      const nextButton = screen.getByRole("button", { name: /next/i })
      fireEvent.click(nextButton)
      fireEvent.click(nextButton)

      const videoElement = screen.getAllByRole("button")[0].querySelector("video")
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
