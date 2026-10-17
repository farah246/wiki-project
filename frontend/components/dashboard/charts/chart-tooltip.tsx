type TooltipEntry = {
    name?: string | number
    value?: number | string
    color?: string
    // For a pie slice, the data item it was drawn from
    payload?: { color?: string }
}

type ChartTooltipProps = {
    // The next three are filled in by Recharts
    active?: boolean
    label?: string | number
    payload?: TooltipEntry[]
    // Adds a "Total" row
    showTotal?: boolean
    // Adds each value's share of this total, e.g. "11 (37%)"
    percentOf?: number
}

// The hover card shared by the dashboard charts
export function ChartTooltip({
                                 active,
                                 label,
                                 payload,
                                 showTotal,
                                 percentOf,
                             }: ChartTooltipProps) {
    if (!active || !payload?.length) return null

    const total = payload.reduce(
        (sum, entry) => sum + Number(entry.value ?? 0),
        0
    )

    return (
        <div className="min-w-36 rounded-xl border bg-card px-3 py-2.5 text-xs shadow-lg">
            {label !== undefined && (
                <p className="mb-2 font-medium">{label}</p>
            )}

            <ul className="space-y-1.5">
                {payload.map((entry) => {
                    const value = Number(entry.value ?? 0)

                    return (
                        <li
                            key={String(entry.name)}
                            className="flex items-center gap-2"
                        >
                            <span
                                aria-hidden="true"
                                className="h-2.5 w-2.5 rounded-sm"
                                style={{
                                    backgroundColor:
                                        entry.payload?.color ?? entry.color,
                                }}
                            />

                            <span className="text-muted-foreground">
                                {entry.name}
                            </span>

                            <span className="ml-auto pl-4 font-medium tabular-nums">
                                {value}
                                {percentOf
                                    ? ` (${Math.round((value / percentOf) * 100)}%)`
                                    : ""}
                            </span>
                        </li>
                    )
                })}
            </ul>

            {showTotal && (
                <p className="mt-2 flex justify-between border-t pt-2 font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">{total}</span>
                </p>
            )}
        </div>
    )
}