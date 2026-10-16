"use client"

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
} from "react"
import { useAuth } from "@clerk/nextjs"
import { ArrowUp, RotateCcw, Sparkles, Square } from "lucide-react"

import { AssistantMessage } from "@/components/ask/assistant-message"
import {
    AskHttpError,
    streamAsk,
    type AssistantMessageData,
    type ChatMessage,
} from "@/lib/ask"
import { cn } from "@/lib/utils"

// Same limit as AskRequest on the backend
const MAX_LENGTH = 500

const EXAMPLES = [
    "How do we deploy the Wiki backend?",
    "What does the Docker deployment workflow describe?",
    "Which proposals mention database security?",
]

function errorMessageFor(error: unknown): string {
    if (error instanceof AskHttpError) {
        if (error.status === 400) {
            return `The question is empty or longer than ${MAX_LENGTH} characters.`
        }
        if (error.status === 401 || error.status === 403) {
            return "You are not allowed to use this feature. Sign in again and retry."
        }
        if (error.status === 503) {
            return "The assistant is temporarily unavailable. Please try again later."
        }
    }

    if (error instanceof TypeError) {
        return "Can't reach the server. Check your connection and try again."
    }

    return "Something went wrong. Try again."
}

export function AskChat() {
    const { getToken } = useAuth()

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")

    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const abortRef = useRef<AbortController | null>(null)
    // follow the answer while it grows, unless the user scrolled up to read
    const stickToBottom = useRef(true)
    // crypto.randomUUID() does not exist on plain-HTTP pages, so use a counter
    const nextId = useRef(0)

    const busy = messages.some(
        (message) =>
            message.role === "assistant" &&
            (message.status === "searching" || message.status === "streaming")
    )

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
    }, [input])

    // back to the input once an answer is finished
    useEffect(() => {
        if (!busy) inputRef.current?.focus()
    }, [busy])

    // leaving the page cancels the request in progress
    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    const send = useCallback(
        async (raw: string) => {
            const question = raw.trim()
            if (!question || busy) return

            const n = nextId.current++
            const botId = `a${n}`

            setInput("")
            stickToBottom.current = true
            setMessages((previous) => [
                ...previous,
                { id: `u${n}`, role: "user", content: question },
                {
                    id: botId,
                    role: "assistant",
                    question,
                    content: "",
                    sources: [],
                    status: "searching",
                },
            ])

            const patch = (
                change: (message: AssistantMessageData) => AssistantMessageData
            ) =>
                setMessages((previous) =>
                    previous.map((message) =>
                        message.id === botId && message.role === "assistant"
                            ? change(message)
                            : message
                    )
                )

            // Words can arrive faster than the screen refreshes: collect them
            // and update the page once per frame.
            let pending = ""
            let frame: number | null = null

            const flush = () => {
                if (frame !== null) {
                    cancelAnimationFrame(frame)
                    frame = null
                }
                if (!pending) return

                const chunk = pending
                pending = ""
                patch((message) => ({
                    ...message,
                    content: message.content + chunk,
                    status: "streaming",
                }))
            }

            const controller = new AbortController()
            abortRef.current = controller

            try {
                const token = await getToken()
                if (!token) throw new AskHttpError(401)

                const completed = await streamAsk(
                    question,
                    token,
                    {
                        onToken: (text) => {
                            pending += text
                            if (frame === null) {
                                frame = requestAnimationFrame(flush)
                            }
                        },
                        onSources: (sources) => {
                            flush()
                            patch((message) => ({ ...message, sources }))
                        },
                        onError: (message) => {
                            flush()
                            patch((current) => ({
                                ...current,
                                status: "error",
                                error: message,
                            }))
                        },
                    },
                    controller.signal
                )

                flush()
                patch((message) => {
                    if (message.status === "error") return message

                    return completed
                        ? { ...message, status: "done" }
                        : {
                            ...message,
                            status: "error",
                            error: "The connection was interrupted before the answer was complete.",
                        }
                })
            } catch (error) {
                flush()

                if (controller.signal.aborted) {
                    patch((message) => ({ ...message, status: "stopped" }))
                } else {
                    console.error("Ask the wiki failed:", error)
                    patch((message) => ({
                        ...message,
                        status: "error",
                        error: errorMessageFor(error),
                    }))
                }
            } finally {
                if (abortRef.current === controller) {
                    abortRef.current = null
                }
            }
        },
        [busy, getToken]
    )

    const stop = () => abortRef.current?.abort()

    const newChat = () => {
        abortRef.current?.abort()
        setMessages([])
        setInput("")
    }

    // asks the last question again, replacing the failed answer
    const retry = () => {
        const lastQuestion = [...messages]
            .reverse()
            .find((message) => message.role === "user")

        if (!lastQuestion || busy) return

        setMessages((previous) => previous.slice(0, -2))
        void send(lastQuestion.content)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault()
            void send(input)
        }
    }

    const handleScroll = () => {
        const el = scrollRef.current
        if (!el) return

        stickToBottom.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }

    const lastIndex = messages.length - 1
    const canSend = input.trim().length > 0 && !busy

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
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

            {/* Thread */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="min-h-0 flex-1 overflow-y-auto py-6"
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
                                    onClick={() => void send(example)}
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
                        ref={inputRef}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxLength={MAX_LENGTH}
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
                            onClick={() => void send(input)}
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
                        input.length >= MAX_LENGTH - 100
                            ? "text-foreground"
                            : "text-muted-foreground"
                    )}
                >
                    {input.length >= MAX_LENGTH - 100
                        ? `${input.length}/${MAX_LENGTH}`
                        : "Answers can be wrong: check the sources. Enter to send, Shift+Enter for a new line."}
                </p>
            </div>
        </div>
    )
}