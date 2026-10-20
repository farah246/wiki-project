import Link from "next/link"

import { NavSections } from "@/components/nav-sections"

export default function AppSidebar({ showAdmin }: { showAdmin: boolean }) {
    return (
        <aside className="hidden w-64 shrink-0 border-r bg-sidebar md:sticky md:top-0 md:flex md:h-screen md:flex-col">

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
                <NavSections showAdmin={showAdmin} />
            </div>
        </aside>
    )
}