import Link from "next/link"
import { ChevronRight } from "lucide-react"

export const metadata = {
  title: "Admin",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-olive-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-olive-200 bg-olive-50 dark:border-olive-800 dark:bg-olive-900/50">
        <div className="p-6">
          <Link href="/admin" className="inline-block">
            <h1 className="text-xl font-bold text-olive-950 dark:text-white">
              Admin
            </h1>
          </Link>
        </div>

        <nav className="space-y-1 px-4 py-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-olive-700 hover:bg-olive-100 dark:text-olive-300 dark:hover:bg-olive-800"
          >
            <ChevronRight className="h-4 w-4" />
            Products
          </Link>
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-olive-500 dark:text-olive-600">
            Coming Soon
          </div>
          <div className="space-y-1 px-4 text-xs text-olive-600 dark:text-olive-400">
            <p>• Orders</p>
            <p>• Customers</p>
            <p>• Analytics</p>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
