import Link from "next/link"
import type { LucideIcon } from "lucide-react"

const tones = {
    violet: "bg-[#f4efff] text-violet-600 dark:bg-violet-950/30",
    sky: "bg-[#edf8ff] text-[#1684cb] dark:bg-sky-950/30",
}

export type StatCardProps = {
    // Small caption in the top right corner
    label: string
    description: string
    value: number
    href: string
    icon: LucideIcon
    tone: keyof typeof tones
}

export function StatCard({
                             label,
                             description,
                             value,
                             href,
                             icon: Icon,
                             tone,
                         }: StatCardProps) {
    return (
        <Link
            href={href}
            className="rounded-2xl border bg-card p-5 transition hover:border-violet-200 hover:shadow-sm"
        >
            <div className="flex items-center justify-between">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
                >
                    <Icon className="h-[18px] w-[18px]" />
                </div>

                <span className="text-xs text-muted-foreground">{label}</span>
            </div>

            <p className="mt-6 text-3xl font-semibold tracking-[-0.05em]">
                {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </Link>
    )
}