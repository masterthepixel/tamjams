"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { CheckmarkIcon } from "@components/oatmeal/icons/checkmark-icon"
import { HttpTypes } from "@medusajs/types"
import { clsx } from "clsx"
import ErrorMessage from "@modules/checkout/components/error-message"
import Button from "@modules/common/components/button"
import OatmealRadio from "@modules/common/components/radio"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const PICKUP_OPTION_ON = "__PICKUP_ON"
const PICKUP_OPTION_OFF = "__PICKUP_OFF"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ""
  }

  let ret = ""

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type === "pickup"
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p: any) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }

    if (_pickupMethods?.find((m) => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: "shipping" | "pickup"
  ) => {
    setError(null)

    if (variant === "pickup") {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | null = null
    setIsLoading(true)
    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
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
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          Delivery
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckmarkIcon className="size-6 text-green-600" />
          )}
        </h2>
        {!isOpen &&
          cart?.shipping_address &&
          cart?.billing_address &&
          cart?.email && (
            <button
              onClick={handleEdit}
              className="text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
              data-testid="edit-delivery-button"
            >
              Edit
            </button>
          )}
      </div>
      {isOpen ? (
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-2">
            <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">
              Shipping method
            </span>
            <p className="text-sm text-olive-600 dark:text-olive-400">
              How would you like your order delivered?
            </p>
          </div>
          <div data-testid="delivery-options-container" className="flex flex-col gap-y-4">
            {hasPickupOptions && (
              <RadioGroup
                value={showPickupOptions}
                onChange={(value) => {
                  const id = _pickupMethods.find(
                    (option) => !option.insufficient_inventory
                  )?.id

                  if (id) {
                    handleSetShippingMethod(id, "pickup")
                  }
                }}
                className="flex flex-col gap-y-2"
              >
                <Radio
                  value={PICKUP_OPTION_ON}
                  data-testid="delivery-option-radio"
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
                    showPickupOptions === PICKUP_OPTION_ON
                      ? "border-olive-950 dark:border-white bg-olive-50 dark:bg-olive-800 shadow-sm"
                      : "border-olive-200 dark:border-olive-800 bg-transparent hover:bg-olive-50 dark:hover:bg-olive-900"
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <OatmealRadio
                      checked={showPickupOptions === PICKUP_OPTION_ON}
                    />
                    <span className="text-sm font-medium text-olive-950 dark:text-white">
                      Pick up your order
                    </span>
                  </div>
                  <span className="text-sm text-olive-400">
                    -
                  </span>
                </Radio>
              </RadioGroup>
            )}
            <RadioGroup
              value={shippingMethodId}
              onChange={(v) => {
                if (v) {
                  return handleSetShippingMethod(v, "shipping")
                }
              }}
              className="flex flex-col gap-y-2"
            >
              {_shippingMethods?.map((option) => {
                const isDisabled =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof calculatedPricesMap[option.id] !== "number"

                return (
                  <Radio
                    key={option.id}
                    value={option.id}
                    data-testid="delivery-option-radio"
                    disabled={isDisabled}
                    className={clsx(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
                      option.id === shippingMethodId
                        ? "border-olive-950 dark:border-white bg-olive-50 dark:bg-olive-800 shadow-sm"
                        : "border-olive-200 dark:border-olive-800 bg-transparent hover:bg-olive-50 dark:hover:bg-olive-900",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <OatmealRadio
                        checked={option.id === shippingMethodId}
                      />
                      <span className="text-sm font-medium text-olive-950 dark:text-white">
                        {option.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-olive-950 dark:text-white">
                      {option.price_type === "flat" ? (
                        convertToLocale({
                          amount: option.amount!,
                          currency_code: cart?.currency_code,
                        })
                      ) : calculatedPricesMap[option.id] ? (
                        convertToLocale({
                          amount: calculatedPricesMap[option.id],
                          currency_code: cart?.currency_code,
                        })
                      ) : isLoadingPrices ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-olive-200 border-t-olive-950 dark:border-olive-800 dark:border-t-white" />
                      ) : (
                        "-"
                      )}
                    </span>
                  </Radio>
                )
              })}
            </RadioGroup>
          </div>

          {showPickupOptions === PICKUP_OPTION_ON && (
            <div className="flex flex-col gap-y-4 pt-4 border-t border-olive-200 dark:border-olive-800">
              <div className="flex flex-col gap-y-2">
                <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">
                  Store
                </span>
                <p className="text-sm text-olive-600 dark:text-olive-400">
                  Choose a store near you
                </p>
              </div>
              <div data-testid="delivery-options-container" className="flex flex-col gap-y-2">
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) {
                      return handleSetShippingMethod(v, "pickup")
                    }
                  }}
                  className="flex flex-col gap-y-2"
                >
                  {_pickupMethods?.map((option) => {
                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        disabled={option.insufficient_inventory}
                        data-testid="delivery-option-radio"
                        className={clsx(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer",
                          option.id === shippingMethodId
                            ? "border-olive-950 dark:border-white bg-olive-50 dark:bg-olive-800 shadow-sm"
                            : "border-olive-200 dark:border-olive-800 bg-transparent hover:bg-olive-50 dark:hover:bg-olive-900",
                          option.insufficient_inventory && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-start gap-x-4">
                          <OatmealRadio
                            checked={option.id === shippingMethodId}
                          />
                          <div className="flex flex-col gap-y-1">
                            <span className="text-sm font-medium text-olive-950 dark:text-white">
                              {option.name}
                            </span>
                            <span className="text-xs text-olive-600 dark:text-olive-400">
                              {formatAddress(
                                (option as any).service_zone?.fulfillment_set?.location
                                  ?.address
                              )}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-olive-950 dark:text-white">
                          {convertToLocale({
                            amount: option.amount!,
                            currency_code: cart?.currency_code,
                          })}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-olive-200 dark:border-olive-800">
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              className="w-full h-12 text-base"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              Continue to payment
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-sm text-olive-600 dark:text-olive-400">
          {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
            <div className="flex flex-col gap-y-1">
              <span className="text-xs font-bold text-olive-950 dark:text-white uppercase tracking-wider mb-2">
                Method
              </span>
              <p>
                {cart.shipping_methods!.at(-1)!.name}{" "}
                ({convertToLocale({
                  amount: cart.shipping_methods!.at(-1)!.amount!,
                  currency_code: cart?.currency_code,
                })})
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Shipping
