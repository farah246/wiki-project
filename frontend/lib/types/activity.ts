export type ActivityEntry = {
    id: number
    action: string
    change: string | null
    docVersion: number | null
    createdAt: string
    username: string | null
    email: string | null
    docType: "TECHNICAL_DOC" | "COMMERCIAL_DOC" | "PROCEDURE" | null
    docId: number | null
    docTitle: string | null
}

export type ActivityPage = {
    items: ActivityEntry[]
    page: number
    totalPages: number
    total: number
}

export const ACTIVITY_ACTIONS = ["CREATED", "UPDATED", "RESTORED", "DELETED"] as const

export const DOC_PATHS = {
    TECHNICAL_DOC: "/technical-docs",
    COMMERCIAL_DOC: "/commercial-docs",
    PROCEDURE: "/procedures",
} as const