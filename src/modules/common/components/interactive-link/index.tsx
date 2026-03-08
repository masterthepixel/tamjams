import { ArrowNarrowRightIcon } from "@components/oatmeal/icons/arrow-narrow-right-icon"
import LocalizedClientLink from "../localized-client-link"
import { clsx } from "clsx"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  className,
  ...props
}: InteractiveLinkProps) => {
  return (
    <LocalizedClientLink
      className={clsx(
        "flex gap-x-2 items-center group text-olive-950 dark:text-white font-medium text-sm transition-all duration-200 hover:gap-x-3",
        className
      )}
      href={href}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <ArrowNarrowRightIcon className="size-4" />
    </LocalizedClientLink>
  )
}

export default InteractiveLink
