import { Code2, ShieldCheck, TrendingUp, Users, type LucideIcon } from "lucide-react"

import type { Role } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"

type Theme = {
    label: string
    icon: LucideIcon
    bar: string
    tint: string
    iconBox: string
}

// Full class names on purpose: Tailwind only keeps classes it can read
const THEME: Record<Role, Theme> = {
    ADMIN: {
        label: "Admin",
        icon: ShieldCheck,
        bar: "bg-violet-500",
        tint: "from-violet-50 dark:from-violet-500/10",
        iconBox: "bg-violet-200/70 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300",
    },
    MANAGER: {
        label: "Manager",
        icon: Users,
        bar: "bg-blue-500",
        tint: "from-blue-50 dark:from-blue-500/10",
        iconBox: "bg-blue-200/70 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300",
    },
    DEVELOPER: {
        label: "Developer",
        icon: Code2,
        bar: "bg-emerald-500",
        tint: "from-emerald-50 dark:from-emerald-500/10",
        iconBox: "bg-emerald-200/70 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300",
    },
    SALES: {
        label: "Sales",
        icon: TrendingUp,
        bar: "bg-amber-500",
        tint: "from-amber-50 dark:from-amber-500/10",
        iconBox: "bg-amber-200/70 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300",
    },
}

// One-line square role chip for the header bar
export function RoleChip({
                             role,
                             className,
                         }: {
    role: Role | null
    className?: string
}) {
    if (!role) return null

    const { label, icon: Icon, bar, tint, iconBox } = THEME[role]

    return (
        <div
            aria-label={`Your role: ${label}`}
            className={cn(
                "relative flex h-11 items-center gap-2.5 overflow-hidden rounded-none border bg-gradient-to-r to-card pl-4 pr-4",
                tint,
                className
            )}
        >
            <span
                aria-hidden="true"
                className={cn("absolute inset-y-0 left-0 w-1", bar)}
            />

            <div
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-none",
                    iconBox
                )}
            >
                <Icon className="h-3.5 w-3.5" />
            </div>

            <div className="leading-none">
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Role
                </p>

                <p className="mt-0.5 text-sm font-semibold tracking-tight">
                    {label}
                </p>
            </div>
        </div>
    )
}