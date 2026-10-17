"use client"

import { useState, type FormEvent } from "react"
import { ArrowUp, Sparkles } from "lucide-react"

import { MAX_QUESTION_LENGTH, useAsk } from "@/components/ask/ask-provider"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
    "How do we deploy the Wiki backend?",
    "What does the Docker deployment workflow describe?",
    "Which proposals mention database security?",
]

// The "Ask the wiki" card of the dashboard. Asking opens the side panel,
// where the answer is written. While the panel is open the card is hidden:
// the panel is then the only place to ask.
export function AskHero({ className }: { className?: string }) {
    const { send, openPanel, isOpen, busy } = useAsk()
    const [value, setValue] = useState("")

    const ask = (text: string) => {
        const question = text.trim()
        if (!question || busy) return

        openPanel()
        void send(question)
        setValue("")
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        ask(value)
    }

    if (isOpen) return null

    return (
        // gradient border: a 2px padded wrapper around the card
        <section
            aria-labelledby="ask-card-title"
            className={cn(
                "rounded-[1.75rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-sky-500 p-[2px] shadow-[0_24px_56px_rgba(124,58,237,0.25)]",
                className
            )}
        >
            <div className="relative overflow-hidden rounded-[calc(1.75rem-2px)] bg-gradient-to-br from-card via-[#fbf7ff] to-[#f0e2ff] p-7 dark:from-card dark:via-card dark:to-violet-950/50">

                {/* soft coloured glows, purely decorative */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-fuchsia-400/25 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl"
                />

                <div className="relative">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#d000d8] text-white shadow-lg shadow-violet-500/30">
                            <Sparkles className="h-6 w-6" />
                        </div>

                        <div>
                            <h2
                                id="ask-card-title"
                                className="text-xl font-semibold tracking-tight"
                            >
                                Ask the wiki
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                Get answers from your documents, with sources.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 flex items-center gap-2.5 rounded-2xl border border-violet-200 bg-card p-2 pl-4 shadow-sm focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-200/70 dark:border-border dark:focus-within:ring-violet-950/40"
                    >
                        <input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            maxLength={MAX_QUESTION_LENGTH}
                            placeholder="Ask your knowledge base…"
                            aria-label="Ask a question about your knowledge base"
                            className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />

                        <button
                            type="submit"
                            disabled={!value.trim() || busy}
                            aria-label="Ask"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#d000d8] text-white shadow-md shadow-violet-500/30 transition hover:opacity-90 disabled:opacity-40"
                        >
                            <ArrowUp className="h-5 w-5" />
                        </button>
                    </form>

                    <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.1em] text-violet-600 dark:text-violet-400">
                        Try asking
                    </p>

                    <div className="mt-2.5 flex flex-col gap-2">
                        {SUGGESTIONS.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => ask(suggestion)}
                                disabled={busy}
                                className="rounded-xl border border-violet-200/80 bg-card/80 px-3.5 py-2.5 text-left text-sm text-muted-foreground transition hover:border-violet-400 hover:bg-card hover:text-violet-700 disabled:opacity-50 dark:border-border dark:hover:text-violet-300"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}