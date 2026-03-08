import Link from "next/link"
import { Film, Package } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard",
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white dark:bg-olive-950">
      {/* Header */}
      <div className="border-b border-olive-200 bg-olive-50 dark:border-olive-800 dark:bg-olive-900/50">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-olive-950 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-olive-600 dark:text-olive-400">
            Manage your TamsJam products and content
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Products Card */}
          <Link
            href="/admin/products"
            className="group rounded-lg border border-olive-200 bg-white p-6 hover:border-olive-300 hover:shadow-lg dark:border-olive-700 dark:bg-olive-900/20 dark:hover:border-olive-600"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-olive-100 p-3 dark:bg-olive-800">
                <Package className="h-6 w-6 text-olive-600 dark:text-olive-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-olive-950 dark:text-white">
                  Manage Products
                </h2>
                <p className="text-sm text-olive-600 dark:text-olive-400">
                  Add and manage product videos
                </p>
              </div>
            </div>
          </Link>

          {/* Quick Start Card */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20">
            <h2 className="font-semibold text-blue-950 dark:text-blue-200">
              Quick Start
            </h2>
            <ol className="mt-4 space-y-2 text-sm text-blue-700 dark:text-blue-300">
              <li>
                1. Go to{" "}
                <Link
                  href="/admin/products"
                  className="underline hover:text-blue-900 dark:hover:text-blue-100"
                >
                  Products
                </Link>
              </li>
              <li>2. Select a product to manage</li>
              <li>3. Upload videos for that product</li>
              <li>4. Videos appear on the storefront</li>
            </ol>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-olive-950 dark:text-white">
            Features
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-olive-200 bg-white p-4 dark:border-olive-700 dark:bg-olive-900/20">
              <Film className="h-6 w-6 text-olive-600 dark:text-olive-400" />
              <h3 className="mt-2 font-medium text-olive-950 dark:text-white">
                Video Upload
              </h3>
              <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                Drag and drop to upload product videos
              </p>
            </div>

            <div className="rounded-lg border border-olive-200 bg-white p-4 dark:border-olive-700 dark:bg-olive-900/20">
              <div className="h-6 w-6 text-olive-600 dark:text-olive-400">
                ⚡
              </div>
              <h3 className="mt-2 font-medium text-olive-950 dark:text-white">
                Smart Loading
              </h3>
              <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                Videos lazy-load for optimal performance
              </p>
            </div>

            <div className="rounded-lg border border-olive-200 bg-white p-4 dark:border-olive-700 dark:bg-olive-900/20">
              <div className="h-6 w-6 text-olive-600 dark:text-olive-400">
                📱
              </div>
              <h3 className="mt-2 font-medium text-olive-950 dark:text-white">
                Mobile Ready
              </h3>
              <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                Works perfectly on all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
