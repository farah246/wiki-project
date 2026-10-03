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
            <Link
                href="/search"
                className="group hidden h-10 w-full max-w-md items-center gap-3 rounded-xl border bg-muted/30 px-3.5 text-sm text-muted-foreground transition hover:border-violet-200 hover:bg-muted/60 md:flex"
            >
                <Search className="h-4 w-4 shrink-0" />

                <span>
                    Search your knowledge...
                </span>

                <kbd className="ml-auto rounded-md border bg-background px-2 py-0.5 text-[11px] font-medium">
                    /
                </kbd>
            </Link>

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