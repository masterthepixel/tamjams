import { clsx } from "clsx"
import Link from "next/link"
import type { ComponentProps } from "react"

export function LinkElement({
  href,
  className,
  children,
  ...props
}: {
  href: string
} & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-2 text-sm/7 font-medium text-olive-950 dark:text-white transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
