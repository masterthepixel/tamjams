"use client"

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import { clsx } from "clsx"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col gap-y-8 py-8 lg:py-12 content-container max-w-7xl mx-auto">
      <div className="flex justify-between items-center pb-6 border-b border-olive-200 dark:border-olive-800">
        <h1 className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
          Order Details
        </h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex items-center gap-x-2 text-sm font-medium text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white transition-colors duration-200"
          data-testid="back-to-overview-button"
        >
          <XMarkIcon className="size-4" />
          <span className="hidden sm:inline">Back to overview</span>
          <span className="sm:hidden">Back</span>
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-y-12"
        data-testid="order-details-container"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-12">
          <div className="flex flex-col gap-y-12">
            <OrderDetails order={order} showStatus />
            <Items order={order} />
            <ShippingDetails order={order} />
          </div>
          <div className="flex flex-col gap-y-8">
            <OrderSummary order={order} />
            <Help />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
