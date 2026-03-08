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
