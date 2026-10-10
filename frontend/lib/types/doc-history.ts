export type DocHistoryEntry = {
    id: number
    action: string
    change: string | null
    docVersion: number | null
    createdAt: string
    user: {
        username: string | null
    } | null
}