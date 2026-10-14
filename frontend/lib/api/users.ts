import { serverApi } from "@/lib/api/server-api"
import type { CurrentUser } from "@/lib/types/user"

export async function getCurrentUser() {
    return serverApi.get<CurrentUser>("/api/users/me")
}

export async function getUsers() {
    return serverApi.get<CurrentUser[]>("/api/users")
}