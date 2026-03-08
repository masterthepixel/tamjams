import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p className="text-base text-olive-600 dark:text-olive-400">
        We have sent the order confirmation details to{" "}
        <span
          className="font-semibold text-olive-950 dark:text-white"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p>
      <div className="flex flex-col gap-y-1 text-sm text-olive-600 dark:text-olive-400">
        <p>
          Order date:{" "}
          <span className="font-medium text-olive-950 dark:text-white" data-testid="order-date">
            {new Date(order.created_at).toDateString()}
          </span>
        </p>
        <p className="text-olive-950 dark:text-white font-medium">
          Order number: <span data-testid="order-id">{order.display_id}</span>
        </p>
      </div>

      {showStatus && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 mt-4 pt-4 border-t border-olive-200 dark:border-olive-800 text-sm">
          <p className="text-olive-600 dark:text-olive-400">
            Order status:{" "}
            <span className="font-semibold text-olive-950 dark:text-white uppercase tracking-tighter" data-testid="order-status">
              {formatStatus(order.fulfillment_status)}
            </span>
          </p>
          <p className="text-olive-600 dark:text-olive-400">
            Payment status:{" "}
            <span
              className="font-semibold text-olive-950 dark:text-white uppercase tracking-tighter"
              data-testid="order-payment-status"
            >
              {formatStatus(order.payment_status)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

export default OrderDetails
