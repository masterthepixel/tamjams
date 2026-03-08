import { clsx } from "clsx"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper" className="flex flex-col gap-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className="text-4xl font-display text-olive-950 dark:text-white uppercase tracking-wider mb-2"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Hello, {customer?.first_name}
          </h1>
          <p className="text-sm text-olive-600 dark:text-olive-400">
            Welcome back to your account dashboard.
          </p>
        </div>
        <div className="text-xs font-medium text-olive-500 dark:text-olive-500 uppercase tracking-widest bg-olive-100 dark:bg-olive-800/50 px-3 py-1.5 rounded-full w-fit">
          Signed in as:{" "}
          <span
            className="text-olive-950 dark:text-white font-semibold ml-1"
            data-testid="customer-email"
            data-value={customer?.email}
          >
            {customer?.email}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-olive-50 dark:bg-olive-800/30 border border-olive-100 dark:border-olive-800/50 rounded-2xl p-6 flex flex-col gap-y-3 transition-colors hover:bg-olive-100 dark:hover:bg-olive-800/50">
          <h3 className="text-xs font-semibold text-olive-400 dark:text-olive-500 uppercase tracking-widest">
            Profile Completion
          </h3>
          <div className="flex items-baseline gap-x-2">
            <span
              className="text-4xl font-display text-olive-950 dark:text-white"
              data-testid="customer-profile-completion"
              data-value={getProfileCompletion(customer)}
            >
              {getProfileCompletion(customer)}%
            </span>
            <span className="text-xs text-olive-600 dark:text-olive-400 font-medium">
              Completed
            </span>
          </div>
          <div className="w-full h-1.5 bg-olive-200 dark:bg-olive-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-olive-950 dark:bg-white transition-all duration-1000 ease-out"
              style={{ width: `${getProfileCompletion(customer)}%` }}
            />
          </div>
        </div>

        <div className="bg-olive-50 dark:bg-olive-800/30 border border-olive-100 dark:border-olive-800/50 rounded-2xl p-6 flex flex-col gap-y-3 transition-colors hover:bg-olive-100 dark:hover:bg-olive-800/50">
          <h3 className="text-xs font-semibold text-olive-400 dark:text-olive-500 uppercase tracking-widest">
            Saved Addresses
          </h3>
          <div className="flex items-baseline gap-x-2">
            <span
              className="text-4xl font-display text-olive-950 dark:text-white"
              data-testid="addresses-count"
              data-value={customer?.addresses?.length || 0}
            >
              {customer?.addresses?.length || 0}
            </span>
            <span className="text-xs text-olive-600 dark:text-olive-400 font-medium">
              Saved
            </span>
          </div>
          <div className="mt-4">
            <LocalizedClientLink
              href="/account/addresses"
              className="text-xs font-semibold text-olive-950 dark:text-white underline underline-offset-4 hover:text-olive-700 transition-colors"
            >
              Manage addresses
            </LocalizedClientLink>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between border-b border-olive-100 dark:border-olive-800 pb-4">
          <h3 className="text-xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
            Recent orders
          </h3>
          {orders && orders.length > 5 && (
            <LocalizedClientLink
              href="/account/orders"
              className="text-xs font-semibold text-olive-600 dark:text-olive-400 underline underline-offset-4 hover:text-olive-950 transition-colors capitalize"
            >
              See all orders
            </LocalizedClientLink>
          )}
        </div>
        <ul
          className="flex flex-col gap-y-4"
          data-testid="orders-wrapper"
        >
          {orders && orders.length > 0 ? (
            orders.slice(0, 5).map((order) => {
              return (
                <li
                  key={order.id}
                  data-testid="order-wrapper"
                  data-value={order.id}
                >
                  <LocalizedClientLink
                    href={`/account/orders/details/${order.id}`}
                  >
                    <div className="bg-olive-50 dark:bg-olive-800/20 hover:bg-olive-100 dark:hover:bg-olive-800/50 border border-olive-100 dark:border-olive-800/50 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 flex-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-olive-400 dark:text-olive-500 font-semibold mb-1">Date placed</span>
                          <span className="text-sm text-olive-950 dark:text-white" data-testid="order-created-date">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-widest text-olive-400 dark:text-olive-500 font-semibold mb-1">Order number</span>
                          <span className="text-sm text-olive-950 dark:text-white" data-testid="order-id" data-value={order.display_id}>
                            #{order.display_id}
                          </span>
                        </div>
                        <div className="flex flex-col hidden lg:flex">
                          <span className="text-[10px] uppercase tracking-widest text-olive-400 dark:text-olive-500 font-semibold mb-1">Total amount</span>
                          <span className="text-sm font-semibold text-olive-950 dark:text-white" data-testid="order-amount">
                            {convertToLocale({
                              amount: order.total,
                              currency_code: order.currency_code,
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="pl-4">
                        <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-700 size-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                          <ChevronDown className="-rotate-90 size-4 text-olive-950 dark:text-white" />
                        </div>
                      </div>
                    </div>
                  </LocalizedClientLink>
                </li>
              )
            })
          ) : (
            <div className="py-12 text-center bg-olive-50 dark:bg-olive-800/20 rounded-2xl border border-dashed border-olive-200 dark:border-olive-800">
              <span data-testid="no-orders-message" className="text-sm text-olive-500 italic">No recent orders found.</span>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
