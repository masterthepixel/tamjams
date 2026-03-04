import { clsx } from "clsx"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"

export type AccordionItemProps = AccordionPrimitive.AccordionItemProps & {
  title: string
  subtitle?: string
  description?: string
  children: React.ReactNode
}

type AccordionProps =
  | (AccordionPrimitive.AccordionSingleProps &
    React.RefAttributes<HTMLDivElement>)
  | (AccordionPrimitive.AccordionMultipleProps &
    React.RefAttributes<HTMLDivElement>)

export const Accordion: React.FC<AccordionProps> & {
  Item: React.FC<AccordionItemProps>
} = ({ children, ...props }) => {
  return (
    <AccordionPrimitive.Root {...props} className="w-full">
      {children}
    </AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clsx(
        "border-t border-olive-200 dark:border-olive-800 last:border-b py-4",
        className
      )}
    >
      <AccordionPrimitive.Header>
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-semibold text-olive-950 dark:text-white uppercase tracking-wider">
              {title}
            </span>
            <AccordionPrimitive.Trigger className="group">
              <MorphingTrigger />
            </AccordionPrimitive.Trigger>
          </div>
          {subtitle && (
            <span className="text-xs text-olive-600 dark:text-olive-400 mt-1">
              {subtitle}
            </span>
          )}
        </div>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden pt-4 text-sm text-olive-700 dark:text-olive-300 transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        {description && <p className="mb-4">{description}</p>}
        <div className="w-full">{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

const MorphingTrigger = () => {
  return (
    <div className="relative size-6 flex items-center justify-center rounded-full hover:bg-olive-950/5 dark:hover:bg-white/5 transition-colors">
      <span className="absolute h-0.5 w-3 bg-olive-950 dark:bg-white rounded-full transition-transform duration-200 group-data-[state=open]:rotate-90" />
      <span className="absolute h-0.5 w-3 bg-olive-950 dark:bg-white rounded-full transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </div>
  )
}

export default Accordion
