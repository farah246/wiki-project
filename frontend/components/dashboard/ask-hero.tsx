"use client"

import { useState, type FormEvent } from "react"
import { ArrowUp, Sparkles } from "lucide-react"

import { MAX_QUESTION_LENGTH, useAsk } from "@/components/ask/ask-provider"

const SUGGESTIONS = [
    "How do we deploy the Wiki backend?",
    "What does the Docker deployment workflow describe?",
    "Which proposals mention database security?",
]

export function AskHero() {
    const { send, openPanel, busy } = useAsk()
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

    return (
        // gradient border: a 1px padded wrapper around the card
        <div className="rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-500 p-px shadow-lg shadow-violet-500/10">
            <div className="rounded-[calc(1.5rem-1px)] bg-background p-5 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
                        <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold">
                            Ask the wiki
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Get answers from your documents, with sources.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 rounded-2xl border bg-muted/40 p-2 pl-4 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100 dark:focus-within:ring-violet-950/40">
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        maxLength={MAX_QUESTION_LENGTH}
                        placeholder="Ask anything about your knowledge base…"
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />

                    <button
                        type="submit"
                        disabled={!value.trim() || busy}
                        aria-label="Ask"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </form>

                <div className="mt-3 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => ask(suggestion)}
                            disabled={busy}
                            className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-violet-300 hover:bg-violet-50 hover:text-foreground disabled:opacity-50 dark:hover:bg-violet-950/30"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}