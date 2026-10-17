"use client"

import { NavLink } from "@/components/nav-link"
import { navigationSections } from "@/lib/navigation"

type NavSectionsProps = {
    showAdmin: boolean
    // Called after a click (the mobile menu uses it to close itself)
    onNavigate?: () => void
}

// The titled groups of links, shared by the sidebar and the mobile menu
export function NavSections({ showAdmin, onNavigate }: NavSectionsProps) {
    const sections = navigationSections.filter(
        (section) => showAdmin || !section.adminOnly
    )

    return (
        <nav aria-label="Main navigation" className="space-y-6">
            {sections.map((section, index) => (
                <div key={section.title ?? index} className="space-y-1">
                    {section.title && (
                        <p className="mb-2 px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                            {section.title}
                        </p>
                    )}

                    {section.items.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            ))}
        </nav>
    )
}