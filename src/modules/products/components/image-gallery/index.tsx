"use client"

import Image from "next/image"
import { useState } from "react"
import { MediaItem } from "@lib/util/combine-product-media"

type ImageGalleryProps = {
  images: MediaItem[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  // Start on first item (videos are sorted first by getCombinedMedia)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set())

  if (!images || images.length === 0) {
    return null
  }

  const currentMedia = images[currentIndex]
  const hasMultipleMedia = images.length > 1
  const isVideo = currentMedia.type === "video"

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
    setIsPlaying(false)
  }

  const handleThumbnailHover = (index: number) => {
    if (images[index].type === "video" && images[index].url) {
      // Upgrade preload to metadata on hover
      setPreloadedVideos((prev) => new Set(prev).add(images[index].url))
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
    // Upgrade to auto preload on play
    if (currentMedia.url) {
      setPreloadedVideos((prev) => new Set(prev).add(currentMedia.url))
    }
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  // Determine preload state based on hover/play status
  const getPreloadState = () => {
    if (isPlaying) {
      return "auto"
    }
    if (preloadedVideos.has(currentMedia.url)) {
      return "metadata"
    }
    return "none"
  }

  return (
    <div className="flex flex-col items-start relative w-full gap-y-6">
      {/* Main Media Container (Image or Video) */}
      <div className="relative aspect-square w-full overflow-hidden bg-olive-50 dark:bg-olive-900/50 rounded-3xl border border-olive-200 dark:border-olive-800 shadow-sm">
        {currentMedia.url && (
          isVideo ? (
            <>
              <video
                src={currentMedia.url}
                poster={currentMedia.poster}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!isPlaying && (
                <div
                  data-testid="play-button-overlay"
                  className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none"
                >
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <Image
              src={currentMedia.url}
              priority
              className="absolute inset-0 object-cover"
              alt={`Product media ${currentIndex + 1}`}
              fill
              sizes="(max-width: 576px) 100vw, (max-width: 1024px) 50vw, 800px"
            />
          )
        )}

        {/* Navigation Controls */}
        {hasMultipleMedia && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-olive-900/80 hover:bg-white dark:hover:bg-olive-800 rounded-full p-2 transition-colors"
              aria-label="Previous"
            >
              <svg
                className="w-6 h-6 text-olive-950 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-olive-900/80 hover:bg-white dark:hover:bg-olive-800 rounded-full p-2 transition-colors"
              aria-label="Next"
            >
              <svg
                className="w-6 h-6 text-olive-950 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation — images only */}
      {hasMultipleMedia && (
        <div className="flex gap-x-3 w-full">
          {images.map((media, index) => {
            if (media.type === "video") return null
            return (
              <button
                key={media.id}
                onClick={() => setCurrentIndex(index)}
                onMouseEnter={() => handleThumbnailHover(index)}
                className={`relative aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-olive-950 dark:border-white"
                    : "border-olive-200 dark:border-olive-800 opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                {media.url && (
                  <Image
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Media Counter */}
      {hasMultipleMedia && (
        <p className="text-xs text-olive-600 dark:text-olive-400">
          {currentIndex + 1} / {images.length}
        </p>
      )}
    </div>
  )
}

export default ImageGallery
