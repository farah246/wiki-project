import { serverApi,orNotFound } from "@/lib/api/server-api"
import type { Procedure } from "@/lib/types/procedure"

export async function getProcedures() {
    return serverApi.get<Procedure[]>("/api/procedures")
}

export async function getProcedure(id: number) {
    return orNotFound(serverApi.get<Procedure>(`/api/procedures/${id}`))
}