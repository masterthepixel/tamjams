import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "../backend/static")
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const videoFile = formData.get("video") as File
    const productId = formData.get("productId") as string

    // Validation
    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      )
    }

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "File must be a video" },
        { status: 400 }
      )
    }

    if (videoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const extension = videoFile.name.split(".").pop()
    const filename = `video-${timestamp}-${productId}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)
    const publicUrl = `/static/${filename}`

    // Write file
    const bytes = await videoFile.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    // Update product metadata with video URL
    const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey =
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    // Fetch current product to get existing videos
    const productResponse = await fetch(
      `${backendUrl}/store/products/${productId}?fields=+metadata`,
      {
        headers: {
          "x-publishable-api-key": publishableKey,
        },
      }
    )

    if (!productResponse.ok) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    const productData = await productResponse.json()
    const currentMetadata = productData.product?.metadata || {}

    // Parse existing video URLs
    let existingVideos: string[] = []
    if (currentMetadata.videoUrls) {
      try {
        existingVideos = JSON.parse(currentMetadata.videoUrls)
      } catch {
        existingVideos = []
      }
    }

    // Add new video
    const updatedVideos = [...existingVideos, publicUrl]

    // Update product via admin API (if available)
    // Note: This requires admin auth in production
    try {
      const updateResponse = await fetch(
        `${backendUrl}/admin/products/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": publishableKey,
          },
          body: JSON.stringify({
            metadata: {
              ...currentMetadata,
              videoUrls: JSON.stringify(updatedVideos),
            },
          }),
        }
      )

      if (!updateResponse.ok) {
        console.warn("Could not update product metadata via admin API")
      }
    } catch (error) {
      console.warn("Admin API update failed:", error)
      // Continue anyway - file is uploaded even if metadata update fails
    }

    return NextResponse.json({
      success: true,
      id: filename,
      url: publicUrl,
      filename: videoFile.name,
      size: videoFile.size,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}
