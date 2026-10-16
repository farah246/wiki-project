"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { AlertCircle, Loader2, RotateCcw, Sparkles } from "lucide-react"

import { SourceCard } from "@/components/ask/source-card"
import { CodeBlock } from "@/components/documents/code-block"
import {
    dropDanglingCitation,
    linkCitations,
    type AssistantMessageData,
} from "@/lib/ask"
import { hastToText } from "@/lib/rehype-highlight-terms"
import { cn } from "@/lib/utils"

type CitationChipProps = {
    n: number
    available: boolean
    onSelect: (n: number) => void
}

const CHIP_BASE =
    "mx-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-md px-1 align-text-top text-[11px] font-semibold leading-none"

// Grey while the answer is still being written (the sources arrive at the end),
// violet and clickable once the source exists.
function CitationChip({ n, available, onSelect }: CitationChipProps) {
    if (!available) {
        return (
            <span className={cn(CHIP_BASE, "bg-muted text-muted-foreground")}>
                {n}
            </span>
        )
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(n)}
            aria-label={`Go to source ${n}`}
            className={cn(
                CHIP_BASE,
                "bg-violet-100 text-violet-700 transition hover:bg-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60"
            )}
        >
            {n}
        </button>
    )
}

type AssistantMessageProps = {
    message: AssistantMessageData
    // only given for the last message, when it failed
    onRetry?: () => void
}

export function AssistantMessage({ message, onRetry }: AssistantMessageProps) {
    const { status, sources, question } = message

    const [activeSource, setActiveSource] = useState<number | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    const handleCite = useCallback(
        (n: number) => {
            document
                .getElementById(`src-${message.id}-${n}`)
                ?.scrollIntoView({ behavior: "smooth", block: "nearest" })

            setActiveSource(n)
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(() => setActiveSource(null), 1800)
        },
        [message.id]
    )

    const available = useMemo(
        () => new Set(sources.map((source) => source.number)),
        [sources]
    )

    // Kept stable while the answer streams, so a code block's "Copied" state
    // is not reset by every new word.
    const components = useMemo<Components>(
        () => ({
            a: ({ href, children }) => {
                if (href?.startsWith("#cite-")) {
                    const n = Number(href.slice("#cite-".length))

                    return (
                        <CitationChip
                            n={n}
                            available={available.has(n)}
                            onSelect={handleCite}
                        />
                    )
                }

                return (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                    </a>
                )
            },
            pre: ({ node, children }) => (
                <CodeBlock text={hastToText(node)} className="my-4">
                    <pre>{children}</pre>
                </CodeBlock>
            ),
        }),
        [available, handleCite]
    )

    const isWriting = status === "searching" || status === "streaming"
    const text = linkCitations(
        isWriting ? dropDanglingCitation(message.content) : message.content
    )

    const showSources =
        !isWriting && sources.length > 0 && status !== "error"

    return (
        <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40">
                <Sparkles className="h-4 w-4 text-violet-600" />
            </div>

            <div className="min-w-0 flex-1 space-y-4">
                {status === "searching" && (
                    <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching the wiki…
                    </div>
                )}

                {message.content && (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:tracking-tight prose-p:my-2 prose-ol:my-2 prose-ul:my-2 prose-a:text-violet-600 prose-pre:bg-muted prose-pre:pr-16 prose-pre:text-foreground prose-code:before:content-none prose-code:after:content-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={components}
                        >
                            {text}
                        </ReactMarkdown>
                    </div>
                )}

                {status === "streaming" && (
                    <span
                        className="inline-block h-2 w-2 animate-pulse rounded-full bg-violet-500"
                        aria-label="The assistant is writing"
                    />
                )}

                {status === "stopped" && (
                    <p className="text-xs text-muted-foreground">
                        Stopped.
                    </p>
                )}

                {status === "error" && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">
                                Answer unavailable
                            </p>

                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {message.error ?? "Something went wrong. Try again."}
                            </p>

                            {onRetry && (
                                <button
                                    type="button"
                                    onClick={onRetry}
                                    className="mt-3 inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium transition hover:bg-muted"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                    Try again
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {showSources && (
                    <div>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                            Sources
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2">
                            {sources.map((source) => (
                                <SourceCard
                                    key={source.number}
                                    id={`src-${message.id}-${source.number}`}
                                    source={source}
                                    question={question}
                                    active={activeSource === source.number}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}