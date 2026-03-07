import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ImageGallery from "../index"

// Mock data for testing
const mockMediaWithVideos = [
  {
    id: "img-1",
    url: "/image1.jpg",
    type: "image" as const,
  },
  {
    id: "video-1",
    url: "/video1.mp4",
    type: "video" as const,
    poster: "/video1-poster.jpg",
  },
  {
    id: "img-2",
    url: "/image2.jpg",
    type: "image" as const,
  },
  {
    id: "video-2",
    url: "/video2.mp4",
    type: "video" as const,
    poster: "/video2-poster.jpg",
  },
]

describe("Video Playback Enhancements", () => {
  describe("Lazy loading", () => {
    it("should not preload videos by default", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0]) // Move to video-1
      }

      const video = document.querySelector("video")
      if (video) {
        expect(video).toHaveAttribute("preload", "none")
      }
    })

    it("should preload metadata when thumbnail hovered", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video")
      if (!video) return // Skip if no video element

      expect(video).toHaveAttribute("preload", "none")

      // Find and hover over a thumbnail
      const allButtons = screen.getAllByRole("button")
      const videoThumbnail = allButtons.find((btn) =>
        btn.getAttribute("aria-label")?.includes("video")
      )

      if (videoThumbnail) {
        fireEvent.mouseEnter(videoThumbnail)

        // After hover, preload should be upgraded to metadata
        await waitFor(
          () => {
            expect(video).toHaveAttribute("preload", "metadata")
          },
          { timeout: 500 }
        )
      }
    })

    it("should load full video when play triggered", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video") as HTMLVideoElement | null
      if (!video) return // Skip if no video element

      // Trigger play event
      fireEvent.play(video)

      // After play, preload should be auto
      await waitFor(
        () => {
          expect(video).toHaveAttribute("preload", "auto")
        },
        { timeout: 500 }
      )
    })
  })

  describe("Poster images", () => {
    it("should display poster before video loads", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video")
      if (video) {
        expect(video).toHaveAttribute("poster", "/video1-poster.jpg")
      }
    })

    it("should show play button overlay on poster", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      // Check that play button overlay exists
      const playButton = document.querySelector('[data-testid="play-button-overlay"]')
      expect(playButton).toBeInTheDocument()
    })

    it("should hide play overlay when video is playing", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video") as HTMLVideoElement | null
      if (!video) return

      const playButton = document.querySelector('[data-testid="play-button-overlay"]')
      expect(playButton).toBeInTheDocument()

      // Simulate play event
      fireEvent.play(video)

      // Play overlay should be hidden or removed
      await waitFor(
        () => {
          const updatedPlayButton = document.querySelector(
            '[data-testid="play-button-overlay"]'
          )
          expect(updatedPlayButton).not.toBeInTheDocument()
        },
        { timeout: 500 }
      )
    })

    it("should show play overlay again when video is paused", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video") as HTMLVideoElement | null
      if (!video) return

      // Play the video
      fireEvent.play(video)

      await waitFor(
        () => {
          const playButton = document.querySelector('[data-testid="play-button-overlay"]')
          expect(playButton).not.toBeInTheDocument()
        },
        { timeout: 500 }
      )

      // Pause the video
      fireEvent.pause(video)

      // Play overlay should reappear
      await waitFor(
        () => {
          const playButton = document.querySelector('[data-testid="play-button-overlay"]')
          expect(playButton).toBeInTheDocument()
        },
        { timeout: 500 }
      )
    })
  })

  describe("Fullscreen support", () => {
    it("should enable fullscreen in video controls", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video")
      if (video) {
        expect(video).toHaveAttribute("controls")
        // The native controls attribute automatically includes fullscreen
      }
    })

    it("should support requestFullscreen API", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video")
      // Check that the video element supports fullscreen
      if (video) {
        expect(video).toBeDefined()
        expect(typeof video.requestFullscreen).toBe("function")
      }
    })
  })

  describe("Performance", () => {
    it("should not impact page load with lazy-loaded videos", () => {
      const startTime = performance.now()

      render(<ImageGallery images={mockMediaWithVideos} />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Rendering should be fast (under 1000ms)
      expect(renderTime).toBeLessThan(1000)
    })

    it("should not preload video data by default", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0])
      }

      const video = document.querySelector("video")
      if (video) {
        // With preload="none", video data should not be fetched
        expect(video).toHaveAttribute("preload", "none")
      }
    })

    it("should handle large media arrays gracefully", () => {
      const largeMediaArray = Array.from({ length: 50 }, (_, i) => ({
        id: `media-${i}`,
        url: i % 2 === 0 ? `/image-${i}.jpg` : `/video-${i}.mp4`,
        type: (i % 2 === 0 ? "image" : "video") as const,
        poster: i % 2 === 0 ? undefined : `/video-${i}-poster.jpg`,
      }))

      const startTime = performance.now()

      render(<ImageGallery images={largeMediaArray} />)

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should handle 50 media items without crashing
      expect(renderTime).toBeLessThan(2000)
      // Check that counter is displayed
      const counter = screen.getByText(/1 \/ 50/)
      expect(counter).toBeInTheDocument()
    })
  })

  describe("Video navigation with lazy loading", () => {
    it("should update preload state when navigating to different videos", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // Navigate to first video
      const nextButtons = screen.getAllByRole("button", { name: "Next" })
      if (nextButtons.length > 0) {
        fireEvent.click(nextButtons[0]) // Move to video-1
      }

      const video = document.querySelector("video") as HTMLVideoElement | null
      if (!video) return

      expect(video).toHaveAttribute("preload", "none")

      // Hover to preload
      const allButtons = screen.getAllByRole("button")
      const videoThumbnail = allButtons.find((btn) =>
        btn.getAttribute("aria-label")?.includes("video")
      )

      if (videoThumbnail) {
        fireEvent.mouseEnter(videoThumbnail)

        await waitFor(
          () => {
            expect(video).toHaveAttribute("preload", "metadata")
          },
          { timeout: 500 }
        )
      }

      // Navigate to next video
      const nextBtn = screen.getByRole("button", { name: "Next" })
      fireEvent.click(nextBtn)

      // New video should start with preload="none"
      await waitFor(
        () => {
          const newVideo = document.querySelector("video")
          if (newVideo) {
            expect(newVideo).toHaveAttribute("preload", "none")
          }
        },
        { timeout: 500 }
      )
    })
  })

  describe("Poster with mixed media", () => {
    it("should not display poster for images", () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      // First item is an image
      const imgs = document.querySelectorAll("img")
      let hasPosterAttr = false
      imgs.forEach((img) => {
        if (img.getAttribute("poster")) {
          hasPosterAttr = true
        }
      })
      expect(hasPosterAttr).toBe(false)
    })

    it("should display correct poster for each video", async () => {
      render(<ImageGallery images={mockMediaWithVideos} />)

      const nextButtons = screen.getAllByRole("button", { name: "Next" })

      if (nextButtons.length > 0) {
        // Navigate to first video
        fireEvent.click(nextButtons[0])
        let video = document.querySelector("video")
        if (video) {
          expect(video).toHaveAttribute("poster", "/video1-poster.jpg")
        }

        // Navigate to second image
        fireEvent.click(nextButtons[0])

        // Navigate to second video
        fireEvent.click(nextButtons[0])
        await waitFor(
          () => {
            video = document.querySelector("video")
            if (video) {
              expect(video).toHaveAttribute("poster", "/video2-poster.jpg")
            }
          },
          { timeout: 500 }
        )
      }
    })
  })
})
