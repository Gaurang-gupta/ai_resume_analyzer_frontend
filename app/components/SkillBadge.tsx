export default function SkillBadge({
                        label,
                        variant,
                        count,
    className,
                    }: {
    label: string
    variant: 'matched' | 'missing'
    count?: number,
    className?: string
}) {
    const styles =
        variant === 'matched'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'

    return (
        <span className={`text-xs py-1 rounded ${styles} ${className}`}>
            <span
                className={`px-2 rounded ${styles}`}
            >
                {label}
            </span>
            {count &&
            <span
                className={`text-xs px-2 py-1 rounded bg-red-50 text-red-700`}
            >
                {count}
            </span>
            }
        </span>
    )
}