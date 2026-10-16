"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@clerk/nextjs"

import {
    AskHttpError,
    streamAsk,
    type AssistantMessageData,
    type ChatMessage,
} from "@/lib/ask"

// Same limit as AskRequest on the backend
export const MAX_QUESTION_LENGTH = 500

function errorMessageFor(error: unknown): string {
    if (error instanceof AskHttpError) {
        if (error.status === 400) {
            return `The question is empty or longer than ${MAX_QUESTION_LENGTH} characters.`
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

type AskContextValue = {
    messages: ChatMessage[]
    // an answer is being written
    busy: boolean
    // the text in the question box (kept here so it survives open/close)
    draft: string
    setDraft: (value: string) => void
    // side panel
    isOpen: boolean
    // on /ask the full page is the chat, so the panel and the button hide
    onAskPage: boolean
    openPanel: () => void
    closePanel: () => void
    togglePanel: () => void
    // below the xl breakpoint the panel covers the page: close it when a
    // source is opened, so the document is visible
    closeIfOverlay: () => void
    send: (question: string) => Promise<void>
    stop: () => void
    newChat: () => void
    retry: () => void
}

const AskContext = createContext<AskContextValue | null>(null)

export function useAsk(): AskContextValue {
    const value = useContext(AskContext)

    if (!value) {
        throw new Error("useAsk must be used inside <AskProvider>")
    }

    return value
}

// Lives in the (app) layout, which stays mounted while the user moves from
// page to page: that is why the conversation survives navigation.
export function AskProvider({ children }: { children: ReactNode }) {
    const { getToken } = useAuth()
    const pathname = usePathname()
    const onAskPage = pathname === "/ask" || pathname.startsWith("/ask/")

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [draft, setDraft] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const abortRef = useRef<AbortController | null>(null)
    // crypto.randomUUID() does not exist on plain-HTTP pages, so use a counter
    const nextId = useRef(0)

    const busy = messages.some(
        (message) =>
            message.role === "assistant" &&
            (message.status === "searching" || message.status === "streaming")
    )

    const openPanel = useCallback(() => setIsOpen(true), [])
    const closePanel = useCallback(() => setIsOpen(false), [])
    const togglePanel = useCallback(() => setIsOpen((open) => !open), [])

    const closeIfOverlay = useCallback(() => {
        if (window.matchMedia("(max-width: 1279px)").matches) {
            setIsOpen(false)
        }
    }, [])

    // Ctrl/Cmd+K opens or closes the panel (or focuses the box on /ask),
    // Escape closes the panel
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault()

                if (onAskPage) {
                    document.getElementById("ask-input")?.focus()
                } else {
                    setIsOpen((open) => !open)
                }
            } else if (event.key === "Escape") {
                setIsOpen(false)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [onAskPage])

    // leaving the app cancels the request in progress
    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    const send = useCallback(
        async (raw: string) => {
            const question = raw.trim()
            if (!question || busy) return

            const n = nextId.current++
            const botId = `a${n}`

            setDraft("")
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

    const stop = useCallback(() => abortRef.current?.abort(), [])

    const newChat = useCallback(() => {
        abortRef.current?.abort()
        setMessages([])
        setDraft("")
    }, [])

    // asks the last question again, replacing the failed answer
    const retry = useCallback(() => {
        const lastQuestion = [...messages]
            .reverse()
            .find((message) => message.role === "user")

        if (!lastQuestion || busy) return

        setMessages((previous) => previous.slice(0, -2))
        void send(lastQuestion.content)
    }, [messages, busy, send])

    return (
        <AskContext.Provider
            value={{
                messages,
                busy,
                draft,
                setDraft,
                isOpen,
                onAskPage,
                openPanel,
                closePanel,
                togglePanel,
                closeIfOverlay,
                send,
                stop,
                newChat,
                retry,
            }}
        >
            {children}
        </AskContext.Provider>
    )
}