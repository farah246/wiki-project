export const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export type DocumentType = "TECHNICAL" | "COMMERCIAL" | "PROCEDURE"

// Same shape as AskSourceModel on the backend
export type AskSource = {
    number: number
    documentId: number
    documentType: DocumentType
    title: string
    excerpt: string
    similarity: number
}

export type AssistantStatus =
    | "searching" // question sent, no word received yet
    | "streaming"
    | "done"
    | "stopped" // the user pressed Stop
    | "error"

export type UserMessage = {
    id: string
    role: "user"
    content: string
}

export type AssistantMessageData = {
    id: string
    role: "assistant"
    // the question this message answers (used for the ?q= highlight)
    question: string
    content: string
    sources: AskSource[]
    status: AssistantStatus
    error?: string
}

export type ChatMessage = UserMessage | AssistantMessageData

export class AskHttpError extends Error {
    status: number

    constructor(status: number) {
        super(`Ask request failed: ${status}`)
        this.status = status
    }
}

type StreamHandlers = {
    onToken: (text: string) => void
    onSources: (sources: AskSource[]) => void
    onError: (message: string) => void
}

type ParsedEvent = { event: string; data: unknown }

// One SSE block looks like:   event:token\ndata:{"text":"To"}
function parseEvent(block: string): ParsedEvent | null {
    let event = "message"
    const dataLines: string[] = []

    for (const line of block.split(/\r?\n/)) {
        if (line.startsWith("event:")) {
            event = line.slice(6).trim()
        } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trimStart())
        }
    }

    // comments and keep-alive blocks have no data line
    if (dataLines.length === 0) return null

    try {
        return { event, data: JSON.parse(dataLines.join("\n")) }
    } catch {
        return null
    }
}

// Calls POST /api/ask/stream and reports the events as they arrive.
// EventSource cannot send a POST body or an Authorization header, so the
// stream is read with fetch. Resolves to true when the server finished the
// answer (done or error event), false when the connection ended early.
export async function streamAsk(
    question: string,
    token: string,
    handlers: StreamHandlers,
    signal: AbortSignal
): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/ask/stream`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "text/event-stream",
        },
        body: JSON.stringify({ question }),
        signal,
    })

    if (!response.ok || !response.body) {
        throw new AskHttpError(response.status)
    }

    let completed = false

    const dispatch = (block: string) => {
        const parsed = parseEvent(block)
        if (!parsed) return

        const { event, data } = parsed
        const payload = (data ?? {}) as { text?: unknown; message?: unknown }

        if (event === "token" && typeof payload.text === "string") {
            handlers.onToken(payload.text)
        } else if (event === "sources" && Array.isArray(data)) {
            handlers.onSources(data as AskSource[])
        } else if (event === "done") {
            completed = true
        } else if (event === "error") {
            completed = true
            handlers.onError(
                typeof payload.message === "string"
                    ? payload.message
                    : "The assistant is temporarily unavailable."
            )
        }
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // events are separated by a blank line
        const blocks = buffer.split(/\r?\n\r?\n/)
        buffer = blocks.pop() ?? ""

        for (const block of blocks) dispatch(block)
    }

    buffer += decoder.decode()
    if (buffer.trim()) dispatch(buffer)

    return completed
}

// The model writes citations as [3] or, sometimes, as 【3】.
const CITATION = /[\[\u3010](\d{1,2})[\]\u3011]/g

// Turns every citation into a Markdown link ([3](#cite-3)) so the renderer
// can show it as a chip. Code (fenced blocks, even one still open while the
// answer streams, and inline code) is left untouched.
export function linkCitations(text: string): string {
    return text
        .split(/(```[\s\S]*?(?:```|$)|`[^`\n]*`)/)
        .map((part, index) =>
            index % 2 === 1
                ? part
                : part.replace(CITATION, (match, n: string) =>
                    Number(n) >= 1 ? `[${n}](#cite-${n})` : match
                )
        )
        .join("")
}

// While the answer streams, a citation can arrive in pieces ("【", "3", "】").
// Hide the unfinished one so it does not flash on the screen.
export function dropDanglingCitation(text: string): string {
    return text.replace(/[\[\u3010]\d{0,2}$/, "")
}