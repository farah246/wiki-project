import Link from "next/link"
import { Briefcase, FileCode2, ListChecks, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type WorkspaceStatsProps = {
    technicalCount: number
    commercialCount: number
    procedureCount: number
}

function CountTile({
                       href,
                       icon: Icon,
                       label,
                       count,
                   }: {
    href: string
    icon: LucideIcon
    label: string
    count: number
}) {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors",
                "hover:border-violet-300 hover:bg-accent/40"
            )}
        >
            <Icon className="h-4 w-4 text-violet-600" />

            <div>
                <p className="text-2xl font-semibold tracking-tight">{count}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </Link>
    )
}

export function WorkspaceStats({
                                   technicalCount,
                                   commercialCount,
                                   procedureCount,
                               }: WorkspaceStatsProps) {
    return (
        <section aria-label="Workspace overview" className="@container">
            <div className="grid grid-cols-3 gap-3">
                <CountTile
                    href="/technical-docs"
                    icon={FileCode2}
                    label="Technical docs"
                    count={technicalCount}
                />
                <CountTile
                    href="/commercial-docs"
                    icon={Briefcase}
                    label="Commercial docs"
                    count={commercialCount}
                />
                <CountTile
                    href="/procedures"
                    icon={ListChecks}
                    label="Procedures"
                    count={procedureCount}
                />
            </div>
        </section>
    )
}