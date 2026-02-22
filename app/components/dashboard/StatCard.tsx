import { ReactNode } from "react"
interface StatCardProps {
    label: string
    value: string | number
    icon?: ReactNode
}
import Card from "@/app/components/ui/Card"
import AnimatedScore from "@/app/components/ui/AnimatedScore";

export default function StatCard({ label, value, icon, color = "indigo" }: StatCardProps & { color?: string }) {
    const colors: Record<string, string> = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
    }

    return (
        <Card className="flex items-center justify-between p-6 rounded-3xl border-slate-200 hover:shadow-md transition-shadow">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {typeof value === "number" ?
                        <AnimatedScore score={Number(value)}/> :
                        <AnimatedScore showPercentage={true} score={Number(value.slice(0, value.length - 1))}/>
                    }
                </p>
            </div>

            <div className={`p-3 rounded-2xl border ${colors[color]}`}>
                {icon}
            </div>
        </Card>
    )
}