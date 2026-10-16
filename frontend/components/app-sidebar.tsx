"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, Sparkles } from "lucide-react"
import { navigation } from "@/lib/navigation"



export default function AppSidebar({ showAdmin }: { showAdmin: boolean }) {
    const pathname = usePathname()

    const isAskActive = pathname === "/ask" || pathname.startsWith("/ask/")

    return (
        <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">

            {/* Brand */}
            <div className="flex h-16 items-center border-b px-6">
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white shadow-sm">
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

            {/* Ask the wiki: main entry to the AI assistant */}
            <div className="px-3 pt-4">
                <Link
                    href="/ask"
                    className={`flex items-center gap-3 rounded-xl border bg-gradient-to-br from-violet-50 to-sky-50 px-3 py-3 transition hover:shadow-md dark:from-violet-950/30 dark:to-sky-950/20 ${
                        isAskActive
                            ? "border-violet-300 ring-2 ring-violet-100 dark:ring-violet-950"
                            : ""
                    }`}
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-background">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold">
                            Ask the wiki
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                            Answers from your documents
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-6">

                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Workspace
                </p>

                <nav className="space-y-1">
                    {navigation
                        // "Ask the wiki" has its own card above (the mobile menu still lists it)
                        .filter((item) => item.href !== "/ask")
                        .map((item) => {
                            const Icon = item.icon

                            const isActive =
                                pathname === item.href ||
                                pathname.startsWith(`${item.href}/`)

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                                            : "text-muted-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
                                    }`}
                                >
                                    <Icon className="h-[18px] w-[18px] shrink-0" />

                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                </nav>

                {/* Management: visible to admins only */}
                {showAdmin && (
                    <>
                        <div className="my-7 border-t" />

                        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Management
                        </p>

                        <nav>
                            <Link
                                href="/admin"
                                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                                    pathname === "/admin" ||
                                    pathname.startsWith("/admin/")
                                        ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
                                        : "text-muted-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
                                }`}
                            >
                                <Settings className="h-[18px] w-[18px]" />

                                <span>Administration</span>
                            </Link>
                        </nav>
                    </>
                )}
            </div>

        </aside>
    )
}