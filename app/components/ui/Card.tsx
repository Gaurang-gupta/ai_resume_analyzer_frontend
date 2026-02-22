// // app/components/ui/Card.tsx
//
// import { ReactNode } from "react"
// import clsx from "clsx"
//
// interface CardProps {
//     children: ReactNode
//     className?: string
// }
//
// export default function Card({ children, className }: CardProps) {
//     return (
//         <div
//             className={clsx(
//                 "border border-gray-200 rounded-xl p-6 shadow-sm",
//                 className
//             )}
//         >
//             {children}
//         </div>
//     )
// }

// app/components/ui/Card.tsx

import { ReactNode } from "react"
import { cn } from "@/lib/utils" // Recommended to use a utility like clsx or cn

interface CardProps {
    children: ReactNode
    className?: string
    noPadding?: boolean
}

export default function Card({ children, className, noPadding = false }: CardProps) {
    return (
        <div
            className={cn(
                "relative border border-slate-200 rounded-2xl bg-white shadow-sm transition-all",
                !noPadding && "p-6",
                className
            )}
        >
            {children}
        </div>
    )
}
