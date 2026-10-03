"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export default function AppHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">

            {/* Mobile brand */}
            <Link
                href="/dashboard"
                className="flex items-center gap-2 md:hidden"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                    W
                </div>

                <span className="font-semibold">
                    Wiki
                </span>
            </Link>

            {/* Search */}


            {/* Right side */}
            <div className="flex items-center gap-3">

                <Link
                    href="/search"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
                >
                    <Search className="h-4 w-4" />
                </Link>

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-9 w-9",
                        },
                    }}
                />

            </div>

        </header>
    )
}