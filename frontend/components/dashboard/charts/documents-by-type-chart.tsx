"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { ChartTooltip } from "@/components/dashboard/charts/chart-tooltip"
import type { TypeCount } from "@/lib/insights"

type Slice = { key: string; label: string; color: string; value: number }

// Donut with the total in the middle and a legend with counts and shares
export function DocumentsByTypeChart({ data }: { data: TypeCount[] }) {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    const summary = `Documents by type: ${data
        .map((item) => `${item.value} ${item.label.toLowerCase()}`)
        .join(", ")}.`

    // with no document yet, draw a single empty ring
    const slices: Slice[] =
        total > 0
            ? data
            : [{ key: "empty", label: "No documents", color: "var(--muted)", value: 1 }]

    return (
        <div>
            <div className="relative h-48" role="img" aria-label={summary}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={slices}
                            dataKey="value"
                            nameKey="label"
                            innerRadius="68%"
                            outerRadius="94%"
                            paddingAngle={total > 0 ? 3 : 0}
                            cornerRadius={6}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {slices.map((slice) => (
                                <Cell key={slice.key} fill={slice.color} />
                            ))}
                        </Pie>

                        {total > 0 && (
                            <Tooltip content={<ChartTooltip percentOf={total} />} />
                        )}
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-semibold tracking-[-0.05em]">
                        {total}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        documents
                    </span>
                </div>
            </div>

            <ul className="mt-5 space-y-2.5">
                {data.map((item) => (
                    <li
                        key={item.key}
                        className="flex items-center gap-2.5 text-sm"
                    >
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-sm"
                            style={{ backgroundColor: item.color }}
                        />

                        <span className="text-muted-foreground">
                            {item.label}
                        </span>

                        <span className="ml-auto font-medium tabular-nums">
                            {item.value}
                        </span>

                        <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                            {total > 0
                                ? `${Math.round((item.value / total) * 100)}%`
                                : "0%"}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}