import { serverApi } from "@/lib/api/server-api"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

export async function getTechnicalDocs() {
    return serverApi.get<TechnicalDoc[]>("/api/technical-docs")
}

export async function getTechnicalDoc(id: number) {
    return serverApi.get<TechnicalDoc>(`/api/technical-docs/${id}`)
}