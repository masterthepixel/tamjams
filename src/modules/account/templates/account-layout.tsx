import React from "react"
import UnderlineLink from "@modules/common/components/interactive-link"
import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import { clsx } from "clsx"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 py-12 lg:py-24 bg-olive-50 dark:bg-olive-950" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-7xl mx-auto flex flex-col gap-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          <div className="bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 lg:p-10 shadow-sm h-fit sticky top-24">
            {customer && <AccountNav customer={customer} />}
          </div>
          <div className="flex-1 bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-6 lg:p-10 shadow-sm min-h-[500px]">
            {children}
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-olive-900 border border-olive-200 dark:border-olive-800 rounded-3xl p-8 lg:p-12 gap-8 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center md:text-left">
            <h3 className="text-3xl font-display text-olive-950 dark:text-white uppercase tracking-wider">Got questions?</h3>
            <p className="text-sm text-olive-600 dark:text-olive-400 max-w-md leading-relaxed">
              You can find frequently asked questions and answers on our
              customer service page.
            </p>
          </div>
          <div className="shrink-0">
            <UnderlineLink href="/customer-service" className="text-base h-12 px-8 flex items-center">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
