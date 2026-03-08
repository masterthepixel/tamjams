import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { unlink } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = path.join(process.cwd(), "static")

/**
 * DELETE /admin/products/:productId/videos/:videoId
 * Delete a video file and remove it from product metadata
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params.productId as string
  const videoId = req.params.videoId as string

  try {
    // Path traversal guard
    if (videoId.includes("/") || videoId.includes("..")) {
      return res.status(400).json({ error: "Invalid video ID" })
    }

    const filepath = path.join(UPLOAD_DIR, videoId)

    // Check if file exists
    if (!existsSync(filepath)) {
      return res.status(404).json({ error: "Video not found" })
    }

    // Delete the file
    await unlink(filepath)

    // Update product metadata to remove the video URL
    const productModule = req.scope.resolve("product") as IProductModuleService

    const product = await productModule.retrieveProduct(productId, {
      select: ["id", "metadata"],
    })

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Parse existing URLs and remove the deleted one
    let videoUrls: string[] = []
    if (product.metadata?.videoUrls) {
      try {
        videoUrls = JSON.parse(product.metadata.videoUrls as string)
      } catch (e) {
        videoUrls = []
      }
    }

    const videoUrl = `/static/${videoId}`
    const updatedUrls = videoUrls.filter((url) => url !== videoUrl)

    // Update product with filtered metadata
    try {
      const newMetadata = {
        ...product.metadata,
        videoUrls: JSON.stringify(updatedUrls),
      }

      console.log("Updating product metadata after delete:", { productId, videoCount: updatedUrls.length })

      await productModule.updateProducts(productId, {
        metadata: newMetadata,
      })

      console.log("Product metadata updated after delete")
    } catch (metadataError) {
      console.error("Error updating metadata (but file was deleted):", metadataError)
      // Don't fail the delete - file is already deleted
    }

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete video:", error)
    res.status(500).json({ error: "Failed to delete video" })
  }
}
