import Link from "next/link"
import { sdk } from "@/lib/config"
import { Film } from "lucide-react"

export const metadata = {
  title: "Manage Products",
}

export default async function AdminProductsPage() {

  let products = []
  try {
    const response = await sdk.client.fetch("/store/products?limit=20", {
      method: "GET",
    })
    products = response.products || []
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-olive-950">
      {/* Header */}
      <div className="border-b border-olive-200 bg-olive-50 dark:border-olive-800 dark:bg-olive-900/50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-olive-950 dark:text-white">
            Product Management
          </h1>
          <p className="mt-2 text-olive-600 dark:text-olive-400">
            Manage product videos and media
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-lg border border-olive-200 bg-olive-50 p-8 text-center dark:border-olive-700 dark:bg-olive-900/20">
            <p className="text-olive-600 dark:text-olive-400">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="rounded-lg border border-olive-200 bg-white p-6 dark:border-olive-700 dark:bg-olive-900/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-olive-950 dark:text-white">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm text-olive-600 dark:text-olive-400">
                      {product.handle}
                    </p>
                  </div>
                  <Film className="h-5 w-5 text-olive-400 dark:text-olive-600" />
                </div>

                <Link
                  href={`/admin/products/${product.id}/videos`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-olive-600 px-4 py-2 text-sm font-medium text-white hover:bg-olive-700 dark:bg-olive-700 dark:hover:bg-olive-600"
                >
                  Manage Videos
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-950 dark:text-blue-200">
            📚 About Product Videos
          </h3>
          <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            Videos are displayed in the product media carousel alongside images.
            They are lazy-loaded for optimal performance, meaning they only
            download when customers interact with them. This keeps your
            storefront fast while providing rich media experiences.
          </p>
        </div>
      </div>
    </div>
  )
}
