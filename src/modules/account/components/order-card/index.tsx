import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/oatmeal/elements/button"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = order.items?.length ?? 0

  return (
    <div className="flex flex-col gap-y-6" data-testid="order-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
            Order #<span data-testid="order-display-id">{order.display_id}</span>
          </h3>
          <div className="flex items-center gap-x-3 text-xs text-olive-600 dark:text-olive-400 font-medium">
            <span data-testid="order-created-at">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            <span className="shrink-0 size-1 bg-olive-300 dark:bg-olive-700 rounded-full" />
            <span data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
            <span className="shrink-0 size-1 bg-olive-300 dark:bg-olive-700 rounded-full" />
            <span>{`${numberOfLines} ${numberOfLines > 1 ? "items" : "item"
              }`}</span>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
            <Button data-testid="order-details-link" className="h-10 px-6 text-xs">
              View Order Details
            </Button>
          </LocalizedClientLink>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {order.items?.slice(0, 4).map((i) => {
          return (
            <div
              key={i.id}
              className="flex flex-col gap-y-3 p-3 bg-olive-50 dark:bg-olive-800/20 border border-olive-100 dark:border-olive-800/50 rounded-2xl transition-all duration-200 hover:bg-olive-100 dark:hover:bg-olive-800/50"
              data-testid="order-item"
            >
              <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                <Thumbnail thumbnail={i.thumbnail} images={[]} size="full" />
              </div>
              <div className="flex flex-col gap-y-1">
                <span
                  className="text-xs font-semibold text-olive-950 dark:text-white truncate"
                  data-testid="item-title"
                >
                  {i.title}
                </span>
                <span className="text-[10px] text-olive-500 font-medium uppercase tracking-wider">
                  Qty: <span data-testid="item-quantity" className="text-olive-950 dark:text-white">{i.quantity}</span>
                </span>
              </div>
            </div>
          )
        })}
        {numberOfProducts > 4 && (
          <div className="flex flex-col items-center justify-center p-3 bg-olive-50 dark:bg-olive-800/20 border border-dashed border-olive-200 dark:border-olive-700 rounded-2xl">
            <span className="text-xl font-display text-olive-950 dark:text-white">
              + {numberOfProducts - 4}
            </span>
            <span className="text-[10px] text-olive-500 font-semibold uppercase tracking-widest">More</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderCard
