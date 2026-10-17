"use client"

import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

import { NavSections } from "@/components/nav-sections"

export default function MobileNav({ showAdmin }: { showAdmin: boolean }) {
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

                        <div className="flex-1 overflow-y-auto px-3 py-4">
                            <NavSections showAdmin={showAdmin} onNavigate={close} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}