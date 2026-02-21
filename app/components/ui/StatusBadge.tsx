// app/components/ui/StatusBadge.tsx

import clsx from "clsx"

export type AnalysisStatus =
    | "queued"
    | "processing"
    | "completed"
    | "failed"

interface StatusBadgeProps {
    status: AnalysisStatus
}

export default function StatusBadge(props: StatusBadgeProps) {
    const styles: Record<AnalysisStatus, string> = {
        queued: "bg-gray-100 text-gray-700",
        processing: "bg-yellow-100 text-yellow-800",
        completed: "bg-green-100 text-green-800",
        failed: "bg-red-100 text-red-800",
    }

    return (
        <span
            className={clsx(
                "px-3 py-1 text-xs font-medium rounded-full capitalize",
                styles[props.status]
            )}
        >
      {props.status}
    </span>
    )
}
