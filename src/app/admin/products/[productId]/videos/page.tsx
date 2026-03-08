import { VideoUploadManager } from "@/modules/admin/components/video-upload-manager"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface VideoManagementPageProps {
  params: Promise<{ productId: string }>
}

export async function generateMetadata() {
  return {
    title: "Manage Product Videos",
  }
}

export default async function VideoManagementPage({
  params,
}: VideoManagementPageProps) {
  const { productId } = await params

  return (
    <div className="min-h-screen bg-white dark:bg-olive-950">
      {/* Header */}
      <div className="border-b border-olive-200 bg-olive-50 dark:border-olive-800 dark:bg-olive-900/50">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href={`/admin/products/${productId}`}
            className="inline-flex items-center gap-2 text-sm text-olive-600 hover:text-olive-900 dark:text-olive-400 dark:hover:text-olive-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Product
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-olive-950 dark:text-white">
            Manage Product Videos
          </h1>
          <p className="mt-2 text-olive-600 dark:text-olive-400">
            Upload and manage videos for your product
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <VideoUploadManager
          productId={productId}
          onVideosUpdated={(videos) => {
            console.log("Videos updated:", videos)
            // Could trigger a revalidation or notification here
          }}
        />

        {/* Help Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-olive-950 dark:text-white">
            Video Guidelines
          </h2>
          <div className="space-y-3">
            <div className="rounded-lg border border-olive-200 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-900/20">
              <h3 className="font-medium text-olive-950 dark:text-white">
                📹 Recommended Video Specs
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-olive-700 dark:text-olive-300">
                <li>
                  <strong>Format:</strong> MP4 (recommended), WebM, or other
                  HTML5 formats
                </li>
                <li>
                  <strong>Size:</strong> Maximum 50MB per video
                </li>
                <li>
                  <strong>Duration:</strong> 30 seconds to 5 minutes ideal
                </li>
                <li>
                  <strong>Resolution:</strong> 720p (1280×720) minimum
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-olive-200 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-900/20">
              <h3 className="font-medium text-olive-950 dark:text-white">
                ✨ Best Practices
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-olive-700 dark:text-olive-300">
                <li>• Show your product in use or action</li>
                <li>• Keep videos short and engaging</li>
                <li>
                  • Use good lighting and clear audio (if audio is included)
                </li>
                <li>• Test on mobile devices before uploading</li>
                <li>• Include your brand or product name in the video</li>
              </ul>
            </div>

            <div className="rounded-lg border border-olive-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20">
              <h3 className="font-medium text-blue-950 dark:text-blue-200">
                ℹ️ How Videos Appear
              </h3>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                Uploaded videos appear in the product media carousel on your
                storefront alongside product images. Videos are lazy-loaded for
                performance - they only start downloading when customers interact
                with them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
