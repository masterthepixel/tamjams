import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-24 flex flex-col gap-y-8">
      <div className="w-full bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 flex flex-col shadow-sm">
        <h2
          className="text-2xl font-display text-olive-950 dark:text-white mb-6 pb-2 border-b border-olive-200 dark:border-olive-800"
        >
          In your Cart
        </h2>
        <div className="flex flex-col gap-y-6">
          <CartTotals totals={cart} />
          <div className="border-t border-olive-200 dark:border-olive-800 w-full" />
          <ItemsPreviewTemplate cart={cart} />
          <div className="border-t border-olive-200 dark:border-olive-800 w-full" />
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
