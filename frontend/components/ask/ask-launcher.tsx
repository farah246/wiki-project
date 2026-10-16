"use client"

import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"

import { useAsk } from "@/components/ask/ask-provider"

const TEASER_KEY = "ask-teaser-dismissed"

// The floating button that opens the panel, on every page except /ask.
export function AskLauncher() {
    const { isOpen, onAskPage, openPanel, busy } = useAsk()
    const [showTeaser, setShowTeaser] = useState(false)

    useEffect(() => {
        try {
            if (sessionStorage.getItem(TEASER_KEY)) return
        } catch {
            // storage unavailable: just show the teaser
        }

        const show = setTimeout(() => setShowTeaser(true), 3000)
        const hide = setTimeout(() => dismissTeaser(), 13000)

        return () => {
            clearTimeout(show)
            clearTimeout(hide)
        }
    }, [])

    function dismissTeaser() {
        setShowTeaser(false)
        try {
            sessionStorage.setItem(TEASER_KEY, "1")
        } catch {
            // ignore
        }
    }

    if (isOpen || onAskPage) return null

    return (
        <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
            {showTeaser && (
                <div
                    role="status"
                    className="relative max-w-[260px] rounded-2xl border bg-background p-4 pr-8 shadow-xl"
                >
                    <button
                        type="button"
                        onClick={dismissTeaser}
                        aria-label="Dismiss"
                        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>

                    <p className="text-sm font-semibold">
                        Ask your documents anything
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Get answers with sources, for example “How do we
                        deploy the backend?”
                    </p>
                </div>
            )}

            <div className="relative">
                {/* soft pulsing halo while the teaser is visible */}
                {showTeaser && (
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-violet-500/40 motion-safe:animate-ping"
                    />
                )}

                <button
                    type="button"
                    onClick={() => {
                        dismissTeaser()
                        openPanel()
                    }}
                    aria-label="Ask the wiki"
                    title="Ask the wiki (Ctrl+K)"
                    className="relative inline-flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-500/40 transition hover:scale-105 hover:shadow-xl hover:shadow-violet-500/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
                >
                    <Sparkles className="h-5 w-5" />

                    <span className="hidden sm:inline">Ask the wiki</span>

                    <kbd className="hidden rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-medium lg:inline">
                        Ctrl K
                    </kbd>

                    {/* an answer is still being written while the panel is closed */}
                    {busy && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500" />
                        </span>
                    )}
                </button>
            </div>
        </div>
    )
}