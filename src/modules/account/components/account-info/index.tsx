"use client"

import { Disclosure } from "@headlessui/react"
import { clsx } from "clsx"
import { useEffect } from "react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { useFormStatus } from "react-dom"
import { Button } from "@components/oatmeal/elements/button"

type AccountInfoProps = {
  label: string
  currentInfo: string | React.ReactNode
  isSuccess?: boolean
  isError?: boolean
  errorMessage?: string
  clearState: () => void
  children?: React.ReactNode
  'data-testid'?: string
}

const AccountInfo = ({
  label,
  currentInfo,
  isSuccess,
  isError,
  clearState,
  errorMessage = "An error occurred, please try again",
  children,
  'data-testid': dataTestid
}: AccountInfoProps) => {
  const { state, close, toggle } = useToggleState()
  const { pending } = useFormStatus()

  const handleToggle = () => {
    clearState()
    setTimeout(() => toggle(), 100)
  }

  useEffect(() => {
    if (isSuccess) {
      close()
    }
  }, [isSuccess, close])

  return (
    <div className="text-sm" data-testid={dataTestid}>
      <div className="flex items-center justify-between group">
        <div className="flex flex-col gap-y-1">
          <span className="text-[10px] font-semibold text-olive-400 dark:text-olive-500 uppercase tracking-widest leading-none">
            {label}
          </span>
          <div className="flex items-center">
            {typeof currentInfo === "string" ? (
              <span className="text-base font-medium text-olive-950 dark:text-white" data-testid="current-info">
                {currentInfo}
              </span>
            ) : (
              <div className="text-base font-medium text-olive-950 dark:text-white">
                {currentInfo}
              </div>
            )}
          </div>
        </div>
        <div>
          <Button
            onClick={handleToggle}
            type={state ? "reset" : "button"}
            className={clsx(
              "h-9 px-5 rounded-xl text-xs transition-all duration-200",
              state
                ? "bg-olive-50 text-olive-600 hover:bg-olive-100 border-olive-200"
                : "bg-olive-950 text-white hover:bg-olive-800"
            )}
            data-testid="edit-button"
            data-active={state}
          >
            {state ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Success state */}
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isSuccess ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
        data-testid="success-message"
      >
        <div className="bg-olive-50 dark:bg-olive-900 border border-green-200 dark:border-green-900/30 p-3 rounded-2xl flex items-center gap-x-2 text-green-700 dark:text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold">{label} updated successfully</span>
        </div>
      </div>

      {/* Error state  */}
      <div
        className={clsx(
          "transition-all duration-300 ease-in-out overflow-hidden flex flex-col",
          isError ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
        data-testid="error-message"
      >
        <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/30 p-3 rounded-2xl flex items-center gap-x-2 text-red-700 dark:text-red-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold">{errorMessage}</span>
        </div>
      </div>

      <div
        className={clsx(
          "transition-all duration-300 ease-in-out overflow-visible",
          state ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-y-6 pt-2 pb-4">
          <div>{children}</div>
          <div className="flex items-center justify-end mt-2">
            <Button
              isLoading={pending}
              className="h-11 px-8 min-w-[140px] text-sm"
              type="submit"
              data-testid="save-button"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountInfo
