import { serverApi,orNotFound } from "@/lib/api/server-api"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

export async function getTechnicalDocs() {
    return serverApi.get<TechnicalDoc[]>("/api/technical-docs")
}

export async function getTechnicalDoc(id: number) {
    return orNotFound(serverApi.get<TechnicalDoc>(`/api/technical-docs/${id}`))
}