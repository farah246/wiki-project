"use client"

import {
    Code2,
    ShieldCheck,
    TrendingUp,
    Users,
    type LucideIcon,
} from "lucide-react"

import { useAsk } from "@/components/ask/ask-provider"
import type { Role } from "@/lib/auth/roles"
import { cn } from "@/lib/utils"

type Theme = {
    label: string
    tagline: string
    icon: LucideIcon
    bar: string
    tint: string
    iconBox: string
}

// Full class names on purpose: Tailwind only keeps classes it can read
const THEME: Record<Role, Theme> = {
    ADMIN: {
        label: "Admin",
        tagline: "Workspace administrator",
        icon: ShieldCheck,
        bar: "bg-violet-500",
        tint: "from-violet-50 dark:from-violet-500/10",
        iconBox: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
    },
    MANAGER: {
        label: "Manager",
        tagline: "Team and content manager",
        icon: Users,
        bar: "bg-blue-500",
        tint: "from-blue-50 dark:from-blue-500/10",
        iconBox: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300",
    },
    DEVELOPER: {
        label: "Developer",
        tagline: "Technical contributor",
        icon: Code2,
        bar: "bg-emerald-500",
        tint: "from-emerald-50 dark:from-emerald-500/10",
        iconBox: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    },
    SALES: {
        label: "Sales",
        tagline: "Commercial contributor",
        icon: TrendingUp,
        bar: "bg-amber-500",
        tint: "from-amber-50 dark:from-amber-500/10",
        iconBox: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    },
}

// Card under "Ask the wiki". Hidden while the Ask panel is open, like the
// Ask card itself.
export function RoleBadge({
                              role,
                              className,
                          }: {
    role: Role | null
    className?: string
}) {
    const { isOpen } = useAsk()

    if (!role || isOpen) return null

    const { label, tagline, icon: Icon, bar, tint, iconBox } = THEME[role]

    return (
        <section
            aria-label={`Your role: ${label}`}
            className={cn(
                "relative overflow-hidden rounded-md border bg-gradient-to-r to-card py-4 pl-6 pr-5 shadow-sm",
                tint,
                className
            )}
        >
            {/* colored edge */}
            <span
                aria-hidden="true"
                className={cn("absolute inset-y-0 left-0 w-1.5", bar)}
            />

            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
                        iconBox
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Your role
                    </p>

                    <p className="text-lg font-semibold leading-tight tracking-tight">
                        {label}
                    </p>

                    <p className="text-xs text-muted-foreground">{tagline}</p>
                </div>
            </div>
        </section>
    )
}