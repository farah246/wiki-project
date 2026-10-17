"use client"

import Link from "next/link"

import { NavLink } from "@/components/nav-link"
import { adminNavigation, navigation } from "@/lib/navigation"

const sectionLabel =
    "mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground"

export default function AppSidebar({ showAdmin }: { showAdmin: boolean }) {
    return (
        <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:flex md:flex-col">

            {/* Brand */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#8128ff] to-[#c000d9] text-sm font-bold text-white shadow-md shadow-violet-500/25">
                        W
                    </div>

                    <div>
                        <p className="text-base font-semibold tracking-tight">
                            Wiki
                        </p>

                        <p className="text-[11px] text-muted-foreground">
                            Knowledge platform
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-6">
                <p className={sectionLabel}>Workspace</p>

                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink key={item.href} item={item} />
                    ))}
                </nav>

                {/* Management: visible to admins only */}
                {showAdmin && (
                    <>
                        <div className="my-7 border-t" />

                        <p className={sectionLabel}>Management</p>

                        <nav>
                            <NavLink item={adminNavigation} />
                        </nav>
                    </>
                )}
            </div>
        </aside>
    )
}