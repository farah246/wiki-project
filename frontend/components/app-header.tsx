"use client"

import Link from "next/link"
import { Search } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

export default function AppHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
            <Link
                href="/"
                className="flex items-center gap-2"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
                    W
                </div>

                <span className="font-semibold">
            Wiki Home Page
        </span>
            </Link>

            <div className="flex items-center gap-3">
               

                <UserButton
                    appearance={{
                        elements: {
                            avatarBox: "h-9 w-9",
                        },
                    }}
                />
            </div>
        </header>    )
}