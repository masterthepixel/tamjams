import React, { useEffect, useImperativeHandle, useState } from "react"
import { clsx } from "clsx"
import { LockIcon } from "@components/oatmeal/icons/lock-icon"
import { LockOpenIcon } from "@components/oatmeal/icons/lock-open-icon"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password") {
        setInputType(showPassword ? "text" : "password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className={clsx("flex flex-col w-full gap-y-2", className)}>
        {topLabel && (
          <span className="text-sm font-semibold text-olive-950 dark:text-white mb-1 uppercase tracking-wider">
            {topLabel}
          </span>
        )}
        <div className="relative group">
          <input
            type={inputType}
            name={name}
            id={name}
            placeholder=" "
            required={required}
            className="peer block w-full h-12 px-4 pt-4 pb-1 rounded-2xl border border-olive-200 dark:border-olive-800 bg-olive-50 dark:bg-olive-900 text-olive-950 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-olive-950/20 dark:focus:ring-white/20 transition-all duration-200 hover:bg-olive-100 dark:hover:bg-olive-800/50"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            className="absolute left-4 top-4 text-olive-400 text-sm transition-all duration-200 pointer-events-none peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-olive-600 dark:peer-focus:text-olive-300 peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-olive-600 dark:peer-[:not(:placeholder-shown)]:text-olive-300"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-olive-400 hover:text-olive-950 dark:hover:text-white transition-colors duration-200"
            >
              {showPassword ? <LockOpenIcon className="size-5" /> : <LockIcon className="size-5" />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
