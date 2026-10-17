"use client"

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { ChartTooltip } from "@/components/dashboard/charts/chart-tooltip"
import { DOCUMENT_TYPES, type WeeklyPoint } from "@/lib/insights"

const axisTick = { fontSize: 11, fill: "var(--muted-foreground)" }

// New documents per week, stacked by type
export function DocumentsGrowthChart({ data }: { data: WeeklyPoint[] }) {
    const total = data.reduce(
        (sum, point) =>
            sum + point.technical + point.commercial + point.procedure,
        0
    )

    if (total === 0) {
        return (
            <p className="py-16 text-center text-sm text-muted-foreground">
                No new documents in the last {data.length} weeks.
            </p>
        )
    }

    const summary = `New documents over the last ${data.length} weeks: ${total} in total.`

    return (
        <div>
            <div className="h-60" role="img" aria-label={summary}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                    >
                        <defs>
                            {DOCUMENT_TYPES.map((type) => (
                                <linearGradient
                                    key={type.key}
                                    id={`growth-fill-${type.key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={type.color}
                                        stopOpacity={0.35}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={type.color}
                                        stopOpacity={0.03}
                                    />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={axisTick}
                        />

                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            width={28}
                            tick={axisTick}
                        />

                        <Tooltip
                            content={<ChartTooltip showTotal />}
                            cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
                        />

                        {DOCUMENT_TYPES.map((type) => (
                            <Area
                                key={type.key}
                                type="monotone"
                                dataKey={type.key}
                                name={type.label}
                                stackId="documents"
                                stroke={type.color}
                                strokeWidth={2}
                                fill={`url(#growth-fill-${type.key})`}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {DOCUMENT_TYPES.map((type) => (
                    <li key={type.key} className="flex items-center gap-2">
                        <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 rounded-sm"
                            style={{ backgroundColor: type.color }}
                        />
                        {type.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}