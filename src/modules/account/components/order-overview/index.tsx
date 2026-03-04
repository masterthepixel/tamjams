"use client"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/oatmeal/elements/button"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-10 w-full">
        <div className="flex flex-col gap-y-2 mb-4">
          <h1 className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
            Order History
          </h1>
          <p className="text-sm text-olive-600 dark:text-olive-400">
            View and track your previous orders.
          </p>
        </div>
        <div className="flex flex-col gap-y-8">
          {orders.map((o) => (
            <div
              key={o.id}
              className="pb-8 border-b border-olive-100 dark:border-olive-800 last:border-none last:pb-0"
            >
              <OrderCard order={o} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-24 gap-y-6"
      data-testid="no-orders-container"
    >
      <div className="flex flex-col gap-y-2 text-center">
        <h2 className="text-3xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
          Nothing to see here
        </h2>
        <p className="text-sm text-olive-600 dark:text-olive-400 max-w-sm mx-auto">
          You don&apos;t have any orders yet. Let&apos;s find something you&apos;ll love.
        </p>
      </div>
      <div className="mt-4">
        <LocalizedClientLink href="/store" passHref>
          <Button data-testid="continue-shopping-button" className="h-12 px-10">
            Continue shopping
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
