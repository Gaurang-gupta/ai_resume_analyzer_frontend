// app/components/ui/Card.tsx

import { ReactNode } from "react"
import clsx from "clsx"

interface CardProps {
    children: ReactNode
    className?: string
}

export default function Card({ children, className }: CardProps) {
    return (
        <div
            className={clsx(
                "bg-white border border-gray-200 rounded-xl p-6 shadow-sm",
                className
            )}
        >
            {children}
        </div>
    )
}
