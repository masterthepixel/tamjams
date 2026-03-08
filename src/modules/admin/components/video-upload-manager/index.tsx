"use client"

import { useState, useRef } from "react"
import { Trash2, Upload, AlertCircle } from "lucide-react"

export interface UploadedVideo {
  id: string
  url: string
  poster?: string
  filename: string
  size: number
  createdAt: string
}

interface VideoUploadManagerProps {
  productId: string
  onVideosUpdated?: (videos: UploadedVideo[]) => void
  existingVideos?: UploadedVideo[]
}

export function VideoUploadManager({
  productId,
  onVideosUpdated,
  existingVideos = [],
}: VideoUploadManagerProps) {
  const [videos, setVideos] = useState<UploadedVideo[]>(existingVideos)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragOverRef = useRef(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = true
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = false
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverRef.current = false

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("video/")
    )

    if (files.length === 0) {
      setError("Please drop video files only (MP4, WebM, etc.)")
      return
    }

    await uploadVideos(files)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    await uploadVideos(files)
  }

  const uploadVideos = async (files: File[]) => {
    setError(null)
    setSuccess(null)
    setUploading(true)

    try {
      for (const file of files) {
        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          setError(
            `File "${file.name}" is too large. Maximum size is 50MB.`
          )
          setUploading(false)
          return
        }

        const formData = new FormData()
        formData.append("video", file)
        formData.append("productId", productId)

        const response = await fetch("/api/admin/videos/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Upload failed")
        }

        const data = await response.json()
        const newVideo: UploadedVideo = {
          id: data.id,
          url: data.url,
          poster: data.poster,
          filename: file.name,
          size: file.size,
          createdAt: new Date().toISOString(),
        }

        setVideos((prev) => [...prev, newVideo])
        setSuccess(`Successfully uploaded "${file.name}"`)
      }

      // Notify parent component
      if (onVideosUpdated) {
        onVideosUpdated(videos)
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during upload"
      )
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const deleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete video")
      }

      setVideos((prev) => prev.filter((v) => v.id !== videoId))
      setSuccess("Video deleted successfully")

      // Notify parent
      if (onVideosUpdated) {
        onVideosUpdated(videos.filter((v) => v.id !== videoId))
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete video"
      )
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  return (
    <div className="space-y-6 rounded-lg border border-olive-200 bg-white p-6 dark:border-olive-800 dark:bg-olive-950">
      <div>
        <h3 className="text-lg font-semibold text-olive-950 dark:text-white">
          Product Videos
        </h3>
        <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
          Upload videos to showcase your product
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 dark:bg-red-950/20">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
          <AlertCircle className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOverRef.current
            ? "border-olive-500 bg-olive-50 dark:border-olive-400 dark:bg-olive-900/20"
            : "border-olive-300 bg-olive-50/50 dark:border-olive-700 dark:bg-olive-900/10"
        } ${uploading ? "opacity-50" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />

        <Upload className="mx-auto h-8 w-8 text-olive-400 dark:text-olive-600" />
        <p className="mt-2 font-medium text-olive-950 dark:text-white">
          Drag and drop videos here
        </p>
        <p className="text-sm text-olive-600 dark:text-olive-400">
          or{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="font-medium text-olive-700 underline hover:text-olive-900 disabled:opacity-50 dark:text-olive-300 dark:hover:text-olive-200"
          >
            select files
          </button>
        </p>
        <p className="mt-2 text-xs text-olive-500 dark:text-olive-500">
          MP4, WebM, and other video formats. Max 50MB per file.
        </p>

        {/* Upload Progress */}
        {uploading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-olive-200 dark:bg-olive-800">
              <div
                className="h-full bg-olive-600 transition-all duration-300 dark:bg-olive-400"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-olive-600 dark:text-olive-400">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        {uploading && (
          <p className="mt-4 text-sm text-olive-600 dark:text-olive-400">
            Uploading... Please wait.
          </p>
        )}
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-olive-950 dark:text-white">
            Uploaded Videos ({videos.length})
          </h4>
          <div className="space-y-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center justify-between rounded-lg border border-olive-200 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-900/20"
              >
                <div className="flex-1">
                  <p className="font-medium text-olive-950 dark:text-white">
                    {video.filename}
                  </p>
                  <p className="text-sm text-olive-600 dark:text-olive-400">
                    {formatFileSize(video.size)}
                  </p>
                </div>
                <button
                  onClick={() => deleteVideo(video.id)}
                  disabled={uploading}
                  className="rounded p-2 hover:bg-red-100 disabled:opacity-50 dark:hover:bg-red-900/20"
                  aria-label="Delete video"
                >
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-lg bg-olive-50 p-4 dark:bg-olive-900/20">
        <p className="text-sm text-olive-700 dark:text-olive-300">
          💡 <strong>Tip:</strong> Videos are stored and automatically added to
          your product's media carousel on the storefront.
        </p>
      </div>
    </div>
  )
}
