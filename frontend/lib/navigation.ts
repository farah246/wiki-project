import {
    LayoutDashboard,
    FileText,
    BriefcaseBusiness,
    ClipboardList,
    History,
    Settings,
    Star,
    Sparkles,
    type LucideIcon,
} from "lucide-react"

export type NavItem = {
    name: string
    href: string
    icon: LucideIcon
    // Visually emphasized entry (used for "Ask the wiki")
    highlight?: boolean
    // Keyboard shortcut, shown on wide screens only
    shortcut?: string
}

export const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Technical Docs", href: "/technical-docs", icon: FileText },
    { name: "Commercial Docs", href: "/commercial-docs", icon: BriefcaseBusiness },
    { name: "Procedures", href: "/procedures", icon: ClipboardList },
    { name: "Favorites", href: "/favorites", icon: Star },
    { name: "Activity", href: "/activity", icon: History },
    {
        name: "Ask the wiki",
        href: "/ask",
        icon: Sparkles,
        highlight: true,
        shortcut: "Ctrl K",
    },
]

// Shown under "Management", for admins only
export const adminNavigation: NavItem = {
    name: "Administration",
    href: "/admin",
    icon: Settings,
}

export function isActivePath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
}