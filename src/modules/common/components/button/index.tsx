import { Button as OatmealButton } from "@components/oatmeal/elements/button"
import { clsx } from "clsx"
import React from "react"

export type ButtonProps = {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "transparent" | "danger"
    isLoading?: boolean
    className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({
    children,
    variant = "primary",
    isLoading = false,
    className,
    ...props
}: ButtonProps) => {
    const color: "dark/light" | "light" = variant === "primary" ? "dark/light" : "light"

    return (
        <OatmealButton
            color={color}
            isLoading={isLoading}
            className={clsx(
                variant === "transparent" && "bg-transparent text-current hover:bg-olive-950/5",
                variant === "danger" && "bg-red-600 text-white hover:bg-red-500",
                className
            )}
            {...props}
        >
            {children}
        </OatmealButton>
    )
}

export default Button
