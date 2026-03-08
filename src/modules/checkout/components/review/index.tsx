"use client"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"
import { clsx } from "clsx"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 lg:p-10 shadow-sm">
      <div className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-olive-200 dark:border-olive-800">
        <h2
          className={clsx(
            "flex flex-row text-3xl font-display text-olive-950 dark:text-white gap-x-3 items-center",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </h2>
      </div>
      {isOpen && previousStepsCompleted && (
        <div className="flex flex-col gap-y-6">
          <div className="bg-olive-50 dark:bg-olive-800/50 p-6 rounded-2xl border border-olive-200 dark:border-olive-800">
            <p className="text-sm text-olive-700 dark:text-olive-300 leading-relaxed">
              By clicking the Place Order button, you confirm that you have
              read, understand and accept our <span className="underline cursor-pointer hover:text-olive-950 dark:hover:text-white">Terms of Use</span>, <span className="underline cursor-pointer hover:text-olive-950 dark:hover:text-white">Terms of Sale</span> and
              <span className="underline cursor-pointer hover:text-olive-950 dark:hover:text-white"> Returns Policy</span> and acknowledge that you have read Medusa
              Store&apos;s <span className="underline cursor-pointer hover:text-olive-950 dark:hover:text-white">Privacy Policy</span>.
            </p>
          </div>
          <div className="pt-4">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Review
