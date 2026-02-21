// app/components/dashboard/StatCard.tsx

import { ReactNode } from "react"
import Card from "@/app/components/ui/Card"

interface StatCardProps {
    label: string
    value: string | number
    icon?: ReactNode
}

export default function StatCard({
                                     label,
                                     value,
                                     icon,
                                 }: StatCardProps) {
    return (
        <Card className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {value}
                </p>
            </div>

            {icon && (
                <div className="text-indigo-500 text-xl">
                    {icon}
                </div>
            )}
        </Card>
    )
}
