import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IProductModuleService } from "@medusajs/framework/types"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = path.join(process.cwd(), "static")

/**
 * GET /admin/products/:productId/videos
 * List all videos for a product from metadata
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params.productId as string

  try {
    const productModule = req.scope.resolve("product") as IProductModuleService

    const product = await productModule.retrieveProduct(productId, {
      select: ["id", "metadata"],
    })

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Parse video URLs from metadata
    let videoUrls: string[] = []
    if (product.metadata?.videoUrls) {
      try {
        videoUrls = JSON.parse(product.metadata.videoUrls as string)
      } catch (e) {
        videoUrls = []
      }
    }

    res.status(200).json({ videos: videoUrls })
  } catch (error) {
    console.error("Failed to list videos:", error)
    res.status(500).json({ error: "Failed to retrieve videos" })
  }
}

/**
 * POST /admin/products/:productId/videos
 * Upload a video and add it to product metadata
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.params.productId as string
  const file = req.file as any

  console.log("Video upload request received", { productId, hasFile: !!file, fileName: file?.originalname })

  try {
    // Validate file exists and is a video
    if (!file) {
      console.log("No file in request")
      return res.status(400).json({ error: "No video file provided" })
    }

    if (!file.mimetype.startsWith("video/")) {
      return res.status(400).json({ error: "File must be a video" })
    }

    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({ error: "File size exceeds 50MB limit" })
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate filename with timestamp
    const ext = file.originalname.split(".").pop() || "mp4"
    const timestamp = Date.now()
    const filename = `video-${timestamp}-${productId}.${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    // Write file to disk
    await writeFile(filepath, file.buffer)

    // Update product metadata with video URL
    const productModule = req.scope.resolve("product") as IProductModuleService

    const product = await productModule.retrieveProduct(productId, {
      select: ["id", "metadata"],
    })

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    // Parse existing URLs
    let existingUrls: string[] = []
    if (product.metadata?.videoUrls) {
      try {
        existingUrls = JSON.parse(product.metadata.videoUrls as string)
      } catch (e) {
        existingUrls = []
      }
    }

    // Add new video URL
    const newUrl = `/static/${filename}`
    const updatedUrls = [...existingUrls, newUrl]

    // Update product with merged metadata
    try {
      const newMetadata = {
        ...product.metadata,
        videoUrls: JSON.stringify(updatedUrls),
      }

      console.log("Updating product metadata:", { productId, videoCount: updatedUrls.length })

      await productModule.updateProducts(productId, {
        metadata: newMetadata,
      })

      console.log("Product metadata updated successfully")
    } catch (metadataError) {
      console.error("Error updating metadata (but file was saved):")
      console.error("Error type:", metadataError instanceof Error ? metadataError.message : String(metadataError))
      console.error("Error details:", metadataError)
      // Don't fail the upload - file is already saved
    }

    res.status(200).json({
      success: true,
      id: filename,
      url: newUrl,
      filename: file.originalname,
      size: file.size,
    })
  } catch (error) {
    console.error("Failed to upload video:", error)
    res.status(500).json({ error: "Failed to upload video" })
  }
}
