export type DocHistoryEntry = {
    id: number
    action: string
    change: string | null
    docVersion: number | null
    // true when the document as it was after this change was saved
    // (older entries have no saved version)
    hasSnapshot: boolean
    createdAt: string
    user: {
        username: string | null
    } | null
}