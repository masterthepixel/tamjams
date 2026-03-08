"use client"

import { useActionState } from "react"
import { createTransferRequest } from "@lib/data/orders"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useEffect, useState } from "react"
import Input from "@modules/common/components/input"

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex flex-col gap-y-6 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
        <div className="flex flex-col gap-y-1 max-w-sm">
          <h3 className="text-xl font-display text-olive-950 dark:text-white uppercase tracking-wider">
            Order Transfers
          </h3>
          <p className="text-sm text-olive-600 dark:text-olive-400">
            Can&apos;t find an order? Connect it to your account here.
          </p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-4 w-full md:max-w-xs"
        >
          <div className="flex flex-col gap-y-3">
            <Input
              name="order_id"
              label="Order ID"
              required
            />
            <SubmitButton
              className="w-full h-11 text-xs"
            >
              Request Transfer
            </SubmitButton>
          </div>
        </form>
      </div>

      {!state.success && state.error && (
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/30 p-3 rounded-xl text-red-700 dark:text-red-400 text-xs font-semibold flex items-center justify-end gap-x-2">
          {state.error}
        </div>
      )}

      {showSuccess && (
        <div className="bg-olive-50 dark:bg-olive-900 border border-olive-200 dark:border-olive-800 p-5 rounded-2xl w-full flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex gap-x-3 items-start">
            <div className="bg-white dark:bg-olive-800 p-2 rounded-full border border-olive-100 dark:border-olive-700 shadow-sm mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-green-600 dark:text-green-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm font-semibold text-olive-950 dark:text-white">
                Transfer for order {state.order?.display_id || state.order?.id} requested
              </span>
              <p className="text-xs text-olive-600 dark:text-olive-400">
                Check your email at {state.order?.email} to confirm the transfer.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            className="text-olive-400 hover:text-olive-950 dark:text-olive-500 dark:hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
