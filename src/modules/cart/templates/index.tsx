import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12 bg-olive-100 dark:bg-olive-950 min-h-screen">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-20 xl:gap-x-40">
            <div className="flex flex-col bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <div className="border-t border-olive-200 dark:border-olive-800 w-full" />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative mt-8 small:mt-0">
              <div className="flex flex-col gap-y-8 sticky top-24">
                {cart && cart.region && (
                  <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-12">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
