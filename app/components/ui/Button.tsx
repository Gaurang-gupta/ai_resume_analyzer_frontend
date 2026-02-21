// app/components/ui/Button.tsx

"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import clsx from "clsx"

type Variant = "primary" | "secondary" | "danger"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: Variant
    loading?: boolean
    fullWidth?: boolean
}

export default function Button({
                                   children,
                                   variant = "primary",
                                   loading = false,
                                   fullWidth = false,
                                   className,
                                   disabled,
                                   ...props
                               }: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none"

    const variants: Record<Variant, string> = {
        primary:
            "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400",
        secondary:
            "bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-100",
        danger:
            "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400",
    }

    return (
        <button
            className={clsx(
                baseStyles,
                variants[variant],
                fullWidth && "w-full",
                (disabled || loading) && "cursor-not-allowed opacity-80",
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? "Processing..." : children}
        </button>
    )
}
