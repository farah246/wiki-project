import { serverApi } from "@/lib/api/server-api"
import type { DocHistoryEntry } from "@/lib/types/doc-history"

// A history failure must never break the document page itself,
// so every call falls back to an empty list.
async function fetchHistory(endpoint: string): Promise<DocHistoryEntry[]> {
    try {
        return (await serverApi.get<DocHistoryEntry[]>(endpoint)) ?? []
    } catch {
        return []
    }
}

export function getTechnicalDocHistory(id: number) {
    return fetchHistory(`/api/doc-history/technical-docs/${id}`)
}

export function getCommercialDocHistory(id: number) {
    return fetchHistory(`/api/doc-history/commercial-docs/${id}`)
}

export function getProcedureHistory(id: number) {
    return fetchHistory(`/api/doc-history/procedures/${id}`)
}