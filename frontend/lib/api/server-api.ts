import "server-only"

import { auth } from "@clerk/nextjs/server"

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

async function serverApiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const { getToken } = await auth()

    const token = await getToken()

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
            ...(token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {}),
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const errorText = await response.text()

        throw new Error(
            `API request failed: ${response.status} ${errorText}`
        )
    }

    if (response.status === 204) {
        return undefined as T
    }

    return response.json()
}

export const serverApi = {
    get: <T>(endpoint: string) =>
        serverApiFetch<T>(endpoint),

    post: <T>(endpoint: string, body: unknown) =>
        serverApiFetch<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown) =>
        serverApiFetch<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string) =>
        serverApiFetch<T>(endpoint, {
            method: "DELETE",
        }),
}