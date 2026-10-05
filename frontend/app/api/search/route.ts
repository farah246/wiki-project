import { NextRequest, NextResponse } from "next/server"

import { serverApi } from "@/lib/api/server-api"

type SearchResult = {
    documentId: number
    title: string
    chunkContent: string
    similarity: number
}

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get("query")?.trim()

    if (!query) {
        return NextResponse.json([])
    }

    try {
        const results = await serverApi.get<SearchResult[]>(
            `/api/search?query=${encodeURIComponent(query)}`
        )

        return NextResponse.json(results)
    } catch (error) {
        console.error("Semantic search failed:", error)

        return NextResponse.json(
            {
                error: "Failed to perform semantic search",
            },
            {
                status: 500,
            }
        )
    }
}