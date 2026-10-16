"use client"

import { Sparkles } from "lucide-react"

import { useAsk } from "@/components/ask/ask-provider"

// The floating button that opens the panel, on every page except /ask.
export function AskLauncher() {
    const { isOpen, onAskPage, openPanel, busy } = useAsk()

    if (isOpen || onAskPage) return null

    return (
        <button
            type="button"
            onClick={openPanel}
            aria-label="Ask the wiki"
            title="Ask the wiki (Ctrl+K)"
            className="fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-violet-600 px-4 text-sm font-medium text-white shadow-lg transition hover:bg-violet-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 md:bottom-6 md:right-6"
        >
            <Sparkles className="h-5 w-5" />

            <span className="hidden sm:inline">Ask the wiki</span>

            {/* an answer is still being written while the panel is closed */}
            {busy && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500" />
                </span>
            )}
        </button>
    )
}