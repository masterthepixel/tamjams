"use client"

import React from "react"
import { clsx } from "clsx"
import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { TrashIcon } from "@components/oatmeal/icons/trash-icon"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      <form action={(a) => addPromotionCode(a)} className="w-full">
        <div className="flex flex-col gap-y-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200 text-left"
            data-testid="add-discount-button"
          >
            {isOpen ? "Close" : "Add Promotion Code(s)"}
          </button>

          {isOpen && (
            <div className="flex flex-col gap-y-3 mt-2">
              <div className="flex w-full gap-x-2">
                <input
                  className="flex-1 h-12 px-4 rounded-full border border-olive-200 dark:border-olive-800 bg-olive-50 dark:bg-olive-900 text-olive-950 dark:text-white placeholder:text-olive-400 focus:outline-none focus:ring-2 focus:ring-olive-950/20 dark:focus:ring-white/20 transition-all duration-200"
                  id="promotion-input"
                  name="code"
                  type="text"
                  placeholder="Enter code"
                  autoFocus={false}
                  data-testid="discount-input"
                />
                <SubmitButton
                  className="whitespace-nowrap h-12 px-6"
                  data-testid="discount-apply-button"
                >
                  Apply
                </SubmitButton>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </div>
          )}
        </div>
      </form>

      {promotions.length > 0 && (
        <div className="flex flex-col gap-y-3">
          <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">
            Promotion(s) applied:
          </span>

          <div className="flex flex-col gap-y-2">
            {promotions.map((promotion) => (
              <div
                key={promotion.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-olive-50 dark:bg-olive-800/50 border border-olive-200 dark:border-olive-800"
                data-testid="discount-row"
              >
                <div className="flex items-center gap-x-2 overflow-hidden">
                  <span className="px-2 py-0.5 rounded-full bg-olive-950 dark:bg-white text-white dark:text-olive-950 text-xs font-bold uppercase tracking-tighter">
                    {promotion.code}
                  </span>
                  <span className="text-sm text-olive-600 dark:text-olive-400 truncate">
                    (
                    {promotion.application_method?.value !== undefined &&
                      promotion.application_method.currency_code !==
                      undefined && (
                        <>
                          {promotion.application_method.type === "percentage"
                            ? `${promotion.application_method.value}%`
                            : convertToLocale({
                              amount: +promotion.application_method.value,
                              currency_code:
                                promotion.application_method.currency_code,
                            })}
                        </>
                      )}
                    )
                  </span>
                </div>
                {!promotion.is_automatic && (
                  <button
                    className="p-1 text-olive-400 hover:text-red-500 transition-colors duration-200"
                    onClick={() => {
                      if (!promotion.code) return
                      removePromotionCode(promotion.code)
                    }}
                    data-testid="remove-discount-button"
                  >
                    <TrashIcon className="size-4" />
                    <span className="sr-only">Remove discount code</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode
