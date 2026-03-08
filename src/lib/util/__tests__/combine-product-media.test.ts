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
      const product: Partial<HttpTypes.StoreProduct> = {
        images: [],
        metadata: {
          videoUrls: JSON.stringify([
            "/video1.mp4",
            {
              url: "/video2.mp4",
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
      })
      expect(media[1]).toEqual({
        id: "video-1",
        url: "/video2.mp4",
        type: "video",
        poster: "/video2-poster.jpg",
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
