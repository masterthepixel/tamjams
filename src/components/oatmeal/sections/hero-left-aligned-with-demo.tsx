import { clsx } from "clsx"
import type { ComponentProps, ReactNode } from "react"
import { Container } from "../elements/container"
import { Heading } from "../elements/heading"
import { Text } from "../elements/text"

export function HeroLeftAlignedWithDemo({
  eyebrow,
  headline,
  subheadline,
  cta,
  demo,
  footer,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  demo?: ReactNode
  footer?: ReactNode
} & ComponentProps<"section">) {
  return (
    <section className={clsx("py-16 bg-olive-100 dark:bg-olive-950", className)} {...props}>
      <Container className="flex flex-col gap-16">
        <div className="flex flex-col gap-16 md:gap-32">
          <div className="flex flex-col items-start gap-6">
            {eyebrow && <div className="text-olive-700 dark:text-olive-400 font-medium uppercase tracking-wider text-sm">{eyebrow}</div>}
            <Heading className="max-w-5xl">{headline}</Heading>
            <div className="flex max-w-3xl flex-col gap-4 text-lg text-olive-700 dark:text-olive-400">
              {subheadline}
            </div>
            {cta && <div className="mt-4">{cta}</div>}
          </div>
          {demo}
        </div>
        {footer}
      </Container>
    </section>
  )
}
