"use client"

import { clsx } from "clsx"
import { useParams, usePathname } from "next/navigation"
import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { UserArrowRightIcon as LogOutIcon } from "@components/oatmeal/icons/user-arrow-right-icon"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div className="lg:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <LocalizedClientLink
            href="/account"
            className="flex items-center gap-x-2 text-sm text-olive-600 dark:text-olive-400 py-2 hover:text-olive-950 dark:hover:text-white transition-colors"
            data-testid="account-main-link"
          >
            <>
              <ChevronDown className="transform rotate-90 size-4" />
              <span>Account</span>
            </>
          </LocalizedClientLink>
        ) : (
          <>
            <div className="text-2xl font-display text-olive-950 dark:text-white uppercase tracking-wider mb-6">
              Hello, {customer?.first_name}
            </div>
            <div className="text-sm">
              <ul className="flex flex-col gap-y-2">
                <li>
                  <LocalizedClientLink
                    href="/account/profile"
                    className="flex items-center justify-between py-4 border-b border-olive-100 dark:border-olive-800 hover:bg-olive-50 dark:hover:bg-olive-800/50 px-2 rounded-lg transition-colors"
                    data-testid="profile-link"
                  >
                    <>
                      <div className="flex items-center gap-x-3 text-olive-950 dark:text-white">
                        <User size={20} />
                        <span className="font-medium">Profile</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 text-olive-400 size-4" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center justify-between py-4 border-b border-olive-100 dark:border-olive-800 hover:bg-olive-50 dark:hover:bg-olive-800/50 px-2 rounded-lg transition-colors"
                    data-testid="addresses-link"
                  >
                    <>
                      <div className="flex items-center gap-x-3 text-olive-950 dark:text-white">
                        <MapPin size={20} />
                        <span className="font-medium">Addresses</span>
                      </div>
                      <ChevronDown className="transform -rotate-90 text-olive-400 size-4" />
                    </>
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center justify-between py-4 border-b border-olive-100 dark:border-olive-800 hover:bg-olive-50 dark:hover:bg-olive-800/50 px-2 rounded-lg transition-colors"
                    data-testid="orders-link"
                  >
                    <div className="flex items-center gap-x-3 text-olive-950 dark:text-white">
                      <Package size={20} />
                      <span className="font-medium">Orders</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-olive-400 size-4" />
                  </LocalizedClientLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center justify-between py-4 border-b border-olive-100 dark:border-olive-800 hover:bg-olive-50 dark:hover:bg-olive-800/50 px-2 rounded-lg w-full transition-colors"
                    onClick={handleLogout}
                    data-testid="logout-button"
                  >
                    <div className="flex items-center gap-x-3 text-olive-600 dark:text-olive-400">
                      <LogOutIcon className="size-5" />
                      <span className="font-medium">Log out</span>
                    </div>
                    <ChevronDown className="transform -rotate-90 text-olive-400 size-4" />
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div className="hidden lg:block" data-testid="account-nav">
        <div className="flex flex-col gap-y-8">
          <div>
            <h3 className="text-xs font-semibold text-olive-400 dark:text-olive-500 uppercase tracking-widest mb-6">
              Menu
            </h3>
            <ul className="flex flex-col gap-y-2">
              <li>
                <AccountNavLink
                  href="/account"
                  route={route!}
                  data-testid="overview-link"
                >
                  Overview
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/profile"
                  route={route!}
                  data-testid="profile-link"
                >
                  Profile
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  Addresses
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  Orders
                </AccountNavLink>
              </li>
            </ul>
          </div>

          <div className="pt-8 border-t border-olive-100 dark:border-olive-800">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-x-3 text-sm font-medium text-olive-600 dark:text-olive-400 hover:text-olive-950 dark:hover:text-white transition-colors duration-200 group"
              data-testid="logout-button"
            >
              <LogOutIcon className="size-5 group-hover:translate-x-0.5 transition-transform duration-200" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clsx(
        "flex items-center py-2 px-3 rounded-xl transition-all duration-200 text-sm",
        active
          ? "bg-olive-100 dark:bg-olive-800 text-olive-950 dark:text-white font-semibold shadow-xs"
          : "text-olive-600 dark:text-olive-400 hover:bg-olive-50 dark:hover:bg-olive-800/50 hover:text-olive-950 dark:hover:text-white"
      )}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
