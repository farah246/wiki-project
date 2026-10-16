"use client"

import { useEffect, useRef, type KeyboardEvent } from "react"
import Link from "next/link"
import {
    ArrowUp,
    Maximize2,
    RotateCcw,
    Sparkles,
    Square,
    X,
} from "lucide-react"

import { AssistantMessage } from "@/components/ask/assistant-message"
import { MAX_QUESTION_LENGTH, useAsk } from "@/components/ask/ask-provider"
import { cn } from "@/lib/utils"

const EXAMPLES = [
    "How do we deploy the Wiki backend?",
    "What does the Docker deployment workflow describe?",
    "Which proposals mention database security?",
]

const ICON_BUTTON =
    "flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"

type AskChatProps = {
    // "page": the full /ask page.  "panel": the side panel.
    variant: "page" | "panel"
}

// The conversation itself lives in <AskProvider>; this is only its display,
// shared by the /ask page and the side panel.
export function AskChat({ variant }: AskChatProps) {
    const {
        messages,
        busy,
        draft,
        setDraft,
        send,
        stop,
        newChat,
        retry,
        closePanel,
        closeIfOverlay,
    } = useAsk()

    const isPanel = variant === "panel"

    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    // follow the answer while it grows, unless the user scrolled up to read
    const stickToBottom = useRef(true)

    // keep the newest text in view
    useEffect(() => {
        const el = scrollRef.current
        if (el && stickToBottom.current) {
            el.scrollTop = el.scrollHeight
        }
    }, [messages])

    // grow the textarea with its content (and shrink it after sending)
    useEffect(() => {
        const el = inputRef.current
        if (!el) return

        el.style.height = "auto"
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }, [draft])

    // back to the input once an answer is finished (and when the view opens)
    useEffect(() => {
        if (!busy) inputRef.current?.focus()
    }, [busy])

    const submit = (question: string) => {
        stickToBottom.current = true
        void send(question)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault()
            submit(draft)
        }
    }

    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return

        stickToBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }

    const lastIndex = messages.length - 1
    const canSend = draft.trim().length > 0 && !busy
    const nearLimit = draft.length >= MAX_QUESTION_LENGTH - 100

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            {isPanel ? (
                <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b">
                    <div className="flex min-w-0 items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-950/40">
                            <Sparkles className="h-4 w-4 text-violet-600" />
                        </div>

                        <h2 className="truncate text-sm font-semibold">
                            Ask the wiki
                        </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {messages.length > 0 && (
                            <button
                                type="button"
                                onClick={newChat}
                                className={ICON_BUTTON}
                                aria-label="New chat"
                                title="New chat"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </button>
                        )}

                        <Link
                            href="/ask"
                            onClick={closePanel}
                            className={ICON_BUTTON}
                            aria-label="Open the full page"
                            title="Open the full page"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </Link>

                        <button
                            type="button"
                            onClick={closePanel}
                            className={ICON_BUTTON}
                            aria-label="Close"
                            title="Close (Esc)"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex shrink-0 items-center justify-between gap-4 border-b py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/40">
                            <Sparkles className="h-[18px] w-[18px] text-violet-600" />
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-lg font-semibold tracking-tight">
                                Ask the wiki
                            </h1>

                            <p className="truncate text-sm text-muted-foreground">
                                Answers come from your documents, with sources.
                            </p>
                        </div>
                    </div>

                    {messages.length > 0 && (
                        <button
                            type="button"
                            onClick={newChat}
                            className="inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                            <RotateCcw className="h-4 w-4" />
                            New chat
                        </button>
                    )}
                </div>
            )}

            {/* Thread (@container: the sources use one or two columns
                depending on THIS width, not on the screen width) */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="@container min-h-0 flex-1 overflow-y-auto py-6"
            >
                {messages.length === 0 ? (
                    <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-950/40">
                            <Sparkles className="h-6 w-6 text-violet-600" />
                        </div>

                        <p className="mt-4 text-base font-semibold">
                            What do you want to know?
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Each question is answered on its own, so write it
                            in full.
                        </p>

                        <div className="mt-6 flex w-full flex-col gap-2">
                            {EXAMPLES.map((example) => (
                                <button
                                    key={example}
                                    type="button"
                                    onClick={() => submit(example)}
                                    className="rounded-xl border px-4 py-3 text-left text-sm transition hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                                >
                                    {example}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {messages.map((message, index) =>
                            message.role === "user" ? (
                                <div
                                    key={message.id}
                                    className="flex justify-end"
                                >
                                    <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-violet-600 px-4 py-2.5 text-sm text-white">
                                        {message.content}
                                    </p>
                                </div>
                            ) : (
                                <AssistantMessage
                                    key={message.id}
                                    message={message}
                                    onSourceOpen={closeIfOverlay}
                                    onRetry={
                                        index === lastIndex &&
                                        message.status === "error"
                                            ? retry
                                            : undefined
                                    }
                                />
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Composer */}
            <div className="shrink-0 pb-4 pt-2">
                <div className="flex items-end gap-2 rounded-2xl border bg-background p-2 shadow-sm transition focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 dark:focus-within:ring-violet-950">
                    <textarea
                        id="ask-input"
                        ref={inputRef}
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxLength={MAX_QUESTION_LENGTH}
                        placeholder="Ask a question about your wiki…"
                        aria-label="Your question"
                        className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
                    />

                    {busy ? (
                        <button
                            type="button"
                            onClick={stop}
                            aria-label="Stop the answer"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border bg-background transition hover:bg-muted"
                        >
                            <Square className="h-3.5 w-3.5 fill-current" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => submit(draft)}
                            disabled={!canSend}
                            aria-label="Send the question"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-40"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <p
                    className={cn(
                        "mt-2 text-center text-[11px]",
                        nearLimit ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {nearLimit
                        ? `${draft.length}/${MAX_QUESTION_LENGTH}`
                        : isPanel
                            ? "Answers can be wrong: check the sources."
                            : "Answers can be wrong: check the sources. Enter to send, Shift+Enter for a new line."}
                </p>
            </div>
        </div>
    )
}