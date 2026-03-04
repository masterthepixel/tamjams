import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowNarrowLeftIcon } from "@components/oatmeal/icons/arrow-narrow-left-icon"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-olive-100 dark:bg-olive-950 relative min-h-screen">
      <div className="h-16 bg-white dark:bg-olive-900 border-b border-olive-200 dark:border-olive-800">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white flex items-center gap-x-2 uppercase flex-1 basis-0 transition-colors duration-200"
            data-testid="back-to-cart-link"
          >
            <ArrowNarrowLeftIcon className="size-4" />
            <span className="mt-px hidden small:block">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-xl font-display text-olive-950 dark:text-white uppercase tracking-wider"
            data-testid="store-link"
          >
            Medusa Store
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative py-12" data-testid="checkout-container">{children}</div>
      <div className="py-8 w-full flex items-center justify-center border-t border-olive-200 dark:border-olive-800 mt-12 bg-white dark:bg-olive-900">
        <MedusaCTA />
      </div>
    </div>
  )
}
