"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckmarkIcon } from "@components/oatmeal/icons/checkmark-icon"
import { BanknotesIcon } from "@components/oatmeal/icons/banknotes-icon"
import { HttpTypes } from "@medusajs/types"
import { clsx } from "clsx"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Button from "@modules/common/components/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    (cart as any)?.gift_cards && (cart as any)?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && (cart?.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          {
            scroll: false,
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 lg:p-10 shadow-sm">
      <div className="flex flex-row items-center justify-between mb-8 pb-4 border-b border-olive-200 dark:border-olive-800">
        <h2
          className={clsx(
            "flex flex-row text-3xl font-display text-olive-950 dark:text-white gap-x-3 items-center",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckmarkIcon className="size-6 text-green-600" />}
        </h2>
        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
            data-testid="edit-payment-button"
          >
            Edit
          </button>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(value: string) => setPaymentMethod(value)}
              className="flex flex-col gap-y-3"
            >
              {availablePaymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id}>
                  {isStripeLike(paymentMethod.id) ? (
                    <StripeCardContainer
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  ) : (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={paymentMethod.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col gap-y-1">
              <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                Payment method
              </span>
              <p className="text-sm text-olive-600 dark:text-olive-400" data-testid="payment-method-summary">
                Gift card
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-olive-200 dark:border-olive-800 pt-6">
            <ErrorMessage
              error={error}
              data-testid="payment-method-error-message"
            />

            <Button
              className="w-full h-12 text-base"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={
                (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
                (!selectedPaymentMethod && !paidByGiftcard)
              }
              data-testid="submit-payment-button"
            >
              {!activeSession && isStripeLike(selectedPaymentMethod)
                ? "Enter card details"
                : "Continue to review"}
            </Button>
          </div>
        </div>

        <div className={clsx("text-sm text-olive-600 dark:text-olive-400", isOpen ? "hidden" : "block")}>
          {cart && paymentReady && activeSession ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                  Payment method
                </span>
                <p data-testid="payment-method-summary">
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </p>
              </div>
              <div className="flex flex-col gap-y-1">
                <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                  Payment details
                </span>
                <div
                  className="flex items-center gap-x-3"
                  data-testid="payment-details-summary"
                >
                  <div className="flex items-center justify-center p-2 rounded-lg bg-olive-950/5 dark:bg-white/5 border border-olive-200 dark:border-olive-800">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <BanknotesIcon className="size-5" />
                    )}
                  </div>
                  <p>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </p>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col gap-y-1">
              <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                Payment method
              </span>
              <p data-testid="payment-method-summary">
                Gift card
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Payment
