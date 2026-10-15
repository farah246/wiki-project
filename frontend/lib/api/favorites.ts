import { serverApi } from "@/lib/api/server-api"
import type { Favorite } from "@/lib/types/favorite"

// Same rule as the history: a favorites failure must never break the page itself.
export async function getFavorites(): Promise<Favorite[]> {
    try {
        return (await serverApi.get<Favorite[]>("/api/favorites")) ?? []
    } catch {
        return []
    }
}