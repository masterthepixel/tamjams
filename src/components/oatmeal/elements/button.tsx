import { clsx } from "clsx"
import Link from "next/link"
import type { ComponentProps } from "react"

const sizes = {
  md: "px-3 py-1",
  lg: "px-4 py-2",
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export function Button({
  size = "md",
  type = "button",
  color = "dark/light",
  className,
  isLoading,
  children,
  ...props
}: {
  size?: keyof typeof sizes
  color?: "dark/light" | "light"
  isLoading?: boolean
} & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium transition-colors duration-200 text-center",
        color === "dark/light" &&
        "bg-olive-950 text-white hover:bg-olive-800 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200",
        color === "light" &&
        "bg-white text-olive-950 hover:bg-olive-100 dark:bg-olive-100 dark:hover:bg-white",
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  )
}

export function ButtonLink({
  size = "md",
  color = "dark/light",
  className,
  href,
  children,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: "dark/light" | "light"
} & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full text-sm/7 font-medium transition-colors duration-200 text-center",
        color === "dark/light" &&
        "bg-olive-950 text-white hover:bg-olive-800 dark:bg-olive-300 dark:text-olive-950 dark:hover:bg-olive-200",
        color === "light" &&
        "bg-white text-olive-950 hover:bg-olive-100 dark:bg-olive-100 dark:hover:bg-white",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export function SoftButton({
  size = "md",
  type = "button",
  className,
  isLoading,
  children,
  ...props
}: {
  size?: keyof typeof sizes
  isLoading?: boolean
} & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-olive-950/10 text-sm/7 font-medium text-olive-950 hover:bg-olive-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-colors duration-200 text-center",
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  )
}

export function SoftButtonLink({
  size = "md",
  href,
  className,
  children,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
} & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-full bg-olive-950/10 text-sm/7 font-medium text-olive-950 hover:bg-olive-950/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition-colors duration-200 text-center",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}

export function PlainButton({
  size = "md",
  color = "dark/light",
  type = "button",
  className,
  isLoading,
  children,
  ...props
}: {
  size?: keyof typeof sizes
  color?: "dark/light" | "light"
  isLoading?: boolean
} & ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium transition-colors duration-200 text-center",
        color === "dark/light" &&
        "text-olive-950 hover:bg-olive-950/10 dark:text-white dark:hover:bg-white/10",
        color === "light" &&
        "text-white hover:bg-white/15 dark:hover:bg-white/10",
        sizes[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  )
}

export function PlainButtonLink({
  size = "md",
  color = "dark/light",
  href,
  className,
  children,
  ...props
}: {
  href: string
  size?: keyof typeof sizes
  color?: "dark/light" | "light"
} & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-sm/7 font-medium transition-colors duration-200 text-center",
        color === "dark/light" &&
        "text-olive-950 hover:bg-olive-950/10 dark:text-white dark:hover:bg-white/10",
        color === "light" &&
        "text-white hover:bg-white/15 dark:hover:bg-white/10",
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
