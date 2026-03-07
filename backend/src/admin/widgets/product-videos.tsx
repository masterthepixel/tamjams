import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, HttpTypes } from "@medusajs/framework/types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useRef } from "react"
import {
  Container,
  Heading,
  Button,
  toast,
  clx,
} from "@medusajs/ui"
import { sdk } from "../lib/client"

interface Video {
  id: string
  url: string
  filename: string
  size: number
}

const ProductVideosWidget = ({
  data: product,
}: DetailWidgetProps<HttpTypes.AdminProduct>) => {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  // Get video URLs from product metadata
  const videoUrls: string[] = (() => {
    try {
      if (product.metadata?.videoUrls) {
        return JSON.parse(product.metadata.videoUrls as string)
      }
      return []
    } catch {
      return []
    }
  })()
  const videos: Video[] = videoUrls.map((url, index) => ({
    id: url.split("/").pop() || `video-${index}`,
    url,
    filename: url.split("/").pop() || `Video ${index + 1}`,
    size: 0, // Size not returned from GET, but we can add it if needed
  }))

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("video", file)

      const response = await fetch(`/admin/products/${product.id}/videos`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      return response.json() as Promise<{
        success: boolean
        id: string
        url: string
        filename: string
        size: number
      }>
    },
    onSuccess: (data) => {
      // Refetch the product to get updated metadata
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      toast.success("Video uploaded successfully")
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to upload video"
      toast.error(message)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/admin/products/${product.id}/videos/${videoId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Delete failed")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", product.id] })
      toast.success("Video deleted successfully")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete video")
    },
  })

  // File handling
  const handleFiles = async (files: FileList | null) => {
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith("video/")) {
        if (file.size > 50 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 50MB limit`)
          continue
        }
        uploadMutation.mutate(file)
      } else {
        toast.error(`${file.name} is not a video file`)
      }
    }
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  return (
    <Container className="flex flex-col gap-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <Heading level="h3">Product Videos</Heading>
      </div>

      {/* Upload Area */}
      <div
        className={clx(
          "rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragActive
            ? "border-ui-interactive bg-ui-interactive/5"
            : "border-ui-border-strong bg-ui-bg-subtle hover:border-ui-border-interactive",
          uploadMutation.isPending && "pointer-events-none opacity-50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-y-2">
          <div className="text-ui-fg-subtle h-8 w-8 flex items-center justify-center">
            ⬆️
          </div>
          <div>
            <p className="text-sm font-medium text-ui-fg-base">
              Drag and drop videos here
            </p>
            <p className="text-xs text-ui-fg-subtle">
              or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="underline hover:text-ui-fg-base"
                disabled={uploadMutation.isPending}
              >
                select files
              </button>
            </p>
          </div>
          <p className="text-xs text-ui-fg-muted">
            Max 50MB per video. Supported: MP4, WebM, OGG
          </p>
        </div>

        {uploadMutation.isPending && (
          <div className="mt-4 flex items-center justify-center gap-x-2">
            <span className="text-sm text-ui-fg-subtle">⏳ Uploading...</span>
          </div>
        )}
      </div>

      {/* Videos List */}
      {videos.length === 0 ? (
        <div className="rounded-lg border border-ui-border-weak bg-ui-bg-subtle p-8 text-center">
          <p className="text-sm text-ui-fg-muted">No videos yet</p>
          <p className="text-xs text-ui-fg-subtle mt-1">
            Upload a video to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="rounded-lg border border-ui-border-weak bg-ui-bg-component p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ui-fg-base truncate">
                    {video.filename}
                  </p>
                  <p className="text-xs text-ui-fg-subtle mt-1">
                    {video.size > 0 && formatSize(video.size)}
                  </p>
                </div>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => deleteMutation.mutate(video.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>

              {/* Video Preview */}
              <div className="mt-3 rounded overflow-hidden bg-ui-bg-base aspect-video flex items-center justify-center border border-ui-border-weak">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls
                  onError={() => {
                    console.error(`Failed to load video: ${video.url}`)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg border border-ui-tag-blue-border bg-ui-tag-blue-bg p-4 text-sm text-ui-fg-base">
        <p className="font-medium">💡 Videos are visible on the storefront</p>
        <p className="text-xs text-ui-fg-subtle mt-1">
          Uploaded videos appear in the product media carousel alongside images.
        </p>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductVideosWidget
