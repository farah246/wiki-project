import { serverApi } from "@/lib/api/server-api"
import type { CommercialDoc } from "@/lib/types/commercial-doc"

export async function getCommercialDocs() {
    return serverApi.get<CommercialDoc[]>("/api/commercial-docs")
}

export async function getCommercialDoc(id: number) {
    return serverApi.get<CommercialDoc>(`/api/commercial-docs/${id}`)
}