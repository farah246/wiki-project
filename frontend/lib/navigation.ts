import {
    LayoutDashboard,
    FileText,
    BriefcaseBusiness,
    ClipboardList,
    History,
    Star,
    Sparkles
} from "lucide-react"

export const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Technical Docs", href: "/technical-docs", icon: FileText },
    { name: "Commercial Docs", href: "/commercial-docs", icon: BriefcaseBusiness },
    { name: "Procedures", href: "/procedures", icon: ClipboardList },
    { name: "Favorites", href: "/favorites", icon: Star },
    { name: "Activity", href: "/activity", icon: History },
    { name: "Ask the wiki", href: "/ask", icon: Sparkles },

]