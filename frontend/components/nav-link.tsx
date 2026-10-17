"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { isActivePath, type NavItem } from "@/lib/navigation"
import { cn } from "@/lib/utils"

type NavLinkProps = {
    item: NavItem
    // Called after a click (the mobile menu uses it to close itself)
    onNavigate?: () => void
}

const base =
    "flex min-h-[43px] items-center gap-3.5 rounded-xl px-3.5 text-sm font-medium transition"

const active =
    "bg-[#f1eaff] font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"

const idle =
    "text-muted-foreground hover:translate-x-0.5 hover:bg-[#faf7ff] hover:text-violet-700 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"

const emphasized =
    "bg-gradient-to-r from-[#f8f2ff] to-card font-bold text-[#4b1ca8] ring-1 ring-inset ring-[#eadcff] hover:from-[#f1eaff] dark:from-violet-950/40 dark:to-transparent dark:text-violet-300 dark:ring-violet-900/60 dark:hover:from-violet-950/60"

// One navigation entry, shared by the sidebar and the mobile menu
export function NavLink({ item, onNavigate }: NavLinkProps) {
    const pathname = usePathname()
    const Icon = item.icon
    const isActive = isActivePath(pathname, item.href)

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                base,
                isActive ? active : item.highlight ? emphasized : idle
            )}
        >
            {item.highlight ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#b000d9] text-white">
                    <Icon className="h-3.5 w-3.5" />
                </span>
            ) : (
                <Icon className="h-[19px] w-[19px] shrink-0" />
            )}

            <span>{item.name}</span>

            {item.shortcut && (
                <span className="ml-auto hidden text-[10px] font-medium text-[#9d7ed1] lg:inline">
                    {item.shortcut}
                </span>
            )}
        </Link>
    )
}