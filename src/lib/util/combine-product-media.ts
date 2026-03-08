import { HttpTypes } from "@medusajs/types"

export type MediaItem = {
  id: string
  url: string
  type: "image" | "video"
  poster?: string // Optional: video thumbnail image URL
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|avi|mkv|ogv|ogg|m4v|3gp|flv)(\?.*)?$/i

/**
 * Returns true if the URL points to a video file based on its extension.
 */
function isVideoUrl(url: string): boolean {
  try {
    // Check the pathname so query strings don't interfere
    const pathname = new URL(url, "http://localhost").pathname
    return VIDEO_EXTENSIONS.test(pathname)
  } catch {
    return VIDEO_EXTENSIONS.test(url)
  }
}

/**
 * Combines product images and video URLs from metadata into a single media array.
 * Videos uploaded via the admin (stored in product.images) are auto-detected by
 * file extension. Additional videos can also be provided via metadata.videoUrls.
 * Images are always added first, then metadata-only videos follow.
 */
export function getCombinedMedia(
  product: HttpTypes.StoreProduct
): MediaItem[] {
  const images: MediaItem[] = []
  const videos: MediaItem[] = []

  // Resolve a potentially relative /static/... URL to an absolute backend URL
  const backendUrl =
    process.env.MEDUSA_BACKEND_URL?.replace(/\/$/, "") ||
    "http://localhost:9000"

  const resolveUrl = (url: string): string => {
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`
  }

  // Fallback poster: use the product thumbnail (already absolute from backend)
  const fallbackPoster = product.thumbnail ?? undefined

  // Split product.images[] into images and videos by extension.
  // Videos uploaded via the Medusa admin land here alongside photos.
  if (product.images && product.images.length > 0) {
    product.images.forEach((img) => {
      if (img.url) {
        if (isVideoUrl(img.url)) {
          videos.push({
            id: img.id,
            url: img.url,
            type: "video",
            poster: fallbackPoster,
          })
        } else {
          images.push({ id: img.id, url: img.url, type: "image" })
        }
      }
    })
  }

  // Additional videos from metadata.videoUrls (stringified JSON array)
  if (
    product.metadata?.videoUrls &&
    typeof product.metadata.videoUrls === "string"
  ) {
    try {
      const videoUrls = JSON.parse(product.metadata.videoUrls)

      if (Array.isArray(videoUrls)) {
        videoUrls.forEach((videoItem, index) => {
          // Support both simple URLs and objects with { url, poster }.
          // Explicit poster wins; product thumbnail used as fallback.
          if (typeof videoItem === "string" && videoItem) {
            videos.push({
              id: `video-${index}`,
              url: resolveUrl(videoItem),
              type: "video",
              poster: fallbackPoster,
            })
          } else if (
            typeof videoItem === "object" &&
            videoItem !== null &&
            videoItem.url
          ) {
            videos.push({
              id: `video-${index}`,
              url: resolveUrl(videoItem.url),
              type: "video",
              poster: videoItem.poster
                ? resolveUrl(videoItem.poster)
                : fallbackPoster,
            })
          }
        })
      }
    } catch (e) {
      console.warn("Failed to parse product videoUrls metadata:", e)
    }
  }

  // Videos first, then images
  return [...videos, ...images]
}
