"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

import MobileNav from "@/components/mobile-nav"

export default function AppHeader({ showAdmin }: { showAdmin: boolean }) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
            {/* Mobile only: on desktop the sidebar already shows the brand */}
            <div className="flex items-center gap-3 md:hidden">
                <MobileNav showAdmin={showAdmin} />

                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                        W
                    </div>
                    <span className="font-semibold">Wiki</span>
                </Link>
            </div>

            <div className="ml-auto flex items-center gap-3">
                <UserButton
                    appearance={{ elements: { avatarBox: "h-9 w-9" } }}
                />
            </div>
        </header>
    )
}