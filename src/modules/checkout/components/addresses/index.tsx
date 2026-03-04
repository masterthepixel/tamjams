"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckmarkIcon } from "@components/oatmeal/icons/checkmark-icon"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { clsx } from "clsx"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 lg:p-10 shadow-sm">
      <div className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-olive-200 dark:border-olive-800">
        <h2
          className="flex flex-row text-3xl font-display text-olive-950 dark:text-white gap-x-3 items-center"
        >
          Shipping Address
          {!isOpen && <CheckmarkIcon className="size-6 text-green-600" />}
        </h2>
        {!isOpen && cart?.shipping_address && (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
            data-testid="edit-address-button"
          >
            Edit
          </button>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="flex flex-col gap-y-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="pt-8 border-t border-olive-200 dark:border-olive-800">
                <h2
                  className="text-2xl font-display text-olive-950 dark:text-white mb-6"
                >
                  Billing address
                </h2>

                <BillingAddress cart={cart} />
              </div>
            )}
            <div className="pt-6 border-t border-olive-200 dark:border-olive-800">
              <SubmitButton className="w-full h-12 text-base" data-testid="submit-address-button">
                Continue to delivery
              </SubmitButton>
              <ErrorMessage error={message} data-testid="address-error-message" />
            </div>
          </div>
        </form>
      ) : (
        <div className="text-sm text-olive-600 dark:text-olive-400">
          {cart && cart.shipping_address ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                className="flex flex-col gap-y-1"
                data-testid="shipping-address-summary"
              >
                <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                  Shipping Address
                </span>
                <p>
                  {cart.shipping_address.first_name}{" "}
                  {cart.shipping_address.last_name}
                </p>
                <p>
                  {cart.shipping_address.address_1}{" "}
                  {cart.shipping_address.address_2}
                </p>
                <p>
                  {cart.shipping_address.postal_code},{" "}
                  {cart.shipping_address.city}
                </p>
                <p>
                  {cart.shipping_address.country_code?.toUpperCase()}
                </p>
              </div>

              <div
                className="flex flex-col gap-y-1"
                data-testid="shipping-contact-summary"
              >
                <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                  Contact
                </span>
                <p>{cart.shipping_address.phone}</p>
                <p className="break-all">{cart.email}</p>
              </div>

              <div
                className="flex flex-col gap-y-1"
                data-testid="billing-address-summary"
              >
                <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                  Billing Address
                </span>

                {sameAsBilling ? (
                  <p>Billing and delivery address are the same.</p>
                ) : (
                  <>
                    <p>
                      {cart.billing_address?.first_name}{" "}
                      {cart.billing_address?.last_name}
                    </p>
                    <p>
                      {cart.billing_address?.address_1}{" "}
                      {cart.billing_address?.address_2}
                    </p>
                    <p>
                      {cart.billing_address?.postal_code},{" "}
                      {cart.billing_address?.city}
                    </p>
                    <p>
                      {cart.billing_address?.country_code?.toUpperCase()}
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
