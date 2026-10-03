"use client"

import { useAuth } from "@clerk/nextjs"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export function useApi() {
    const { getToken } = useAuth()

    async function apiFetch<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
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

    return {
        get: <T>(endpoint: string) =>
            apiFetch<T>(endpoint),

        post: <T>(endpoint: string, body: unknown) =>
            apiFetch<T>(endpoint, {
                method: "POST",
                body: JSON.stringify(body),
            }),

        put: <T>(endpoint: string, body: unknown) =>
            apiFetch<T>(endpoint, {
                method: "PUT",
                body: JSON.stringify(body),
            }),

        delete: <T>(endpoint: string) =>
            apiFetch<T>(endpoint, {
                method: "DELETE",
            }),
    }
}