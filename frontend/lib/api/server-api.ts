import "server-only"

import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

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

        throw new ApiError(
            response.status,
            `API request failed: ${response.status} ${errorText}`
        )
    }

    if (response.status === 204) {
        return undefined as T
    }

    const responseText = await response.text()

    if (!responseText) {
        return undefined as T
    }

    return JSON.parse(responseText)
}
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
        this.name = "ApiError"
    }
}

export async function orNotFound<T>(request: Promise<T>): Promise<T> {
    try {
        return await request
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound()
        throw error
    }
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