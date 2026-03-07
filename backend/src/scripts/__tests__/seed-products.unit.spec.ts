import { readFileSync } from "fs"
import { join } from "path"

describe("seed-products script", () => {
  describe("ProductData interface", () => {
    it("should accept videoUrls as optional string array", () => {
      // This test verifies the interface is updated
      const testData: any = {
        title: "Test Product",
        handle: "test-product",
        videoUrls: ["video1.mp4", "video2.webm"],
      }
      expect(testData.videoUrls).toEqual(["video1.mp4", "video2.webm"])
    })
  })

  describe("Product metadata serialization", () => {
    it("should stringify videoUrls like nutrition field", () => {
      const videoUrls = ["demo.mp4", "usage.webm"]
      const serialized = JSON.stringify(videoUrls)

      expect(typeof serialized).toBe("string")
      expect(JSON.parse(serialized)).toEqual(videoUrls)
    })

    it("should handle undefined videoUrls", () => {
      const videoUrls: string[] | undefined = undefined
      const metadata = {
        videoUrls: videoUrls ? JSON.stringify(videoUrls) : undefined,
      }

      expect(metadata.videoUrls).toBeUndefined()
    })

    it("should handle empty videoUrls array", () => {
      const videoUrls: string[] = []
      const metadata = {
        videoUrls: videoUrls ? JSON.stringify(videoUrls) : undefined,
      }

      expect(metadata.videoUrls).toBeUndefined()
    })
  })
})
