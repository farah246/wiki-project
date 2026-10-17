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

export type NavSection = {
    // Small uppercase title above the items. Leave it out for an untitled group.
    title?: string
    items: NavItem[]
    // Only shown to admins
    adminOnly?: boolean
}

// The whole navigation, used by the sidebar and the mobile menu.
// A new feature = one more item here, or one more section.
export const navigationSections: NavSection[] = [
    {
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ],
    },
    {
        title: "Documents",
        items: [
            { name: "Technical Docs", href: "/technical-docs", icon: FileText },
            {
                name: "Commercial Docs",
                href: "/commercial-docs",
                icon: BriefcaseBusiness,
            },
            { name: "Procedures", href: "/procedures", icon: ClipboardList },
        ],
    },
    {
        title: "My space",
        items: [
            { name: "Favorites", href: "/favorites", icon: Star },
            { name: "Activity", href: "/activity", icon: History },
        ],
    },
    {
        title: "Assistant",
        items: [
            {
                name: "Ask the wiki",
                href: "/ask",
                icon: Sparkles,
                highlight: true,
                shortcut: "Ctrl K",
            },
        ],
    },
    {
        title: "Management",
        adminOnly: true,
        items: [{ name: "Administration", href: "/admin", icon: Settings }],
    },
]

export function isActivePath(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
}