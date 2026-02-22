// app/components/ui/AnimatedScore.tsx
"use client"
import { useEffect, useState } from "react"

export default function AnimatedScore({ score, showPercentage }: { score: number, showPercentage?: boolean }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 1500 // 1.5 seconds
        const start = 0
        const end = score
        if (start === end) return

        let startTimestamp: number | null = null
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min((timestamp - startTimestamp) / duration, 1)
            setCount(Math.floor(progress * (end - start) + start))
            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }, [score])

    return (
        <span className="tabular-nums">
            {count}{showPercentage && "%"}
        </span>
    )
}