"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Settings, X } from "lucide-react"

import { navigation } from "@/lib/navigation"

function linkClass(active: boolean) {
    return `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
            ? "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300"
            : "text-muted-foreground hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-950/30 dark:hover:text-violet-300"
    }`
}

export default function MobileNav({ showAdmin }: { showAdmin: boolean }) {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("keydown", onKeyDown)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = ""
        }
    }, [open])

    const close = () => setOpen(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition hover:bg-muted md:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/40" onClick={close} />

                    <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-background shadow-xl">
                        <div className="flex h-16 items-center justify-between border-b px-4">
                            <span className="font-semibold">Wiki</span>

                            <button
                                type="button"
                                onClick={close}
                                aria-label="Close menu"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const active =
                                    pathname === item.href ||
                                    pathname.startsWith(`${item.href}/`)

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={close}
                                        className={linkClass(active)}
                                    >
                                        <Icon className="h-[18px] w-[18px] shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}

                            {showAdmin && (
                                <>
                                    <div className="my-4 border-t" />

                                    <Link
                                        href="/admin"
                                        onClick={close}
                                        className={linkClass(
                                            pathname === "/admin" ||
                                            pathname.startsWith("/admin/")
                                        )}
                                    >
                                        <Settings className="h-[18px] w-[18px] shrink-0" />
                                        <span>Administration</span>
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </>
    )
}