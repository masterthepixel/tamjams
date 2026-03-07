import { NextRequest, NextResponse } from "next/server"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const UPLOAD_DIR = join(process.cwd(), "../backend/static")

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      )
    }

    const filepath = join(UPLOAD_DIR, videoId)

    // Security check: ensure file is in upload directory
    if (!filepath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json(
        { error: "Invalid video ID" },
        { status: 400 }
      )
    }

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { error: "Video file not found" },
        { status: 404 }
      )
    }

    // Delete the file
    await unlink(filepath)

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    )
  }
}
