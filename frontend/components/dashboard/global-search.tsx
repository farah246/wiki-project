"use client"

import Link from "next/link"
import {
    BriefcaseBusiness,
    ClipboardList,
    FileText,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@clerk/nextjs"

import { SearchBar } from "@/components/ui/search-bar"
import type { TechnicalDoc } from "@/lib/types/technical-doc"
import type { CommercialDoc } from "@/lib/types/commercial-doc"
import type { Procedure } from "@/lib/types/procedure"
import type { ReactNode } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
type GlobalSearchProps = {
    technicalDocs: TechnicalDoc[]
    commercialDocs: CommercialDoc[]
    procedures: Procedure[]
}

type SearchResult = {
    documentId: number
    documentType: "TECHNICAL" | "COMMERCIAL" | "PROCEDURE"
    title: string
    chunkContent: string
    similarity: number
}

function HighlightMatch({
                            text,
                            query,
                        }: {
    text: string
    query: string
}) {
    if (!query.trim()) {
        return <>{text}</>
    }

    const escapedQuery = query.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    )

    const parts = text.split(
        new RegExp(`(${escapedQuery})`, "gi")
    )

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark
                        key={index}
                        className="rounded bg-violet-100 px-0.5 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200"
                    >
                        {part}
                    </mark>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    )
}

export function GlobalSearch({
                                 technicalDocs,
                                 commercialDocs,
                                 procedures,
                             }: GlobalSearchProps) {
    const { getToken } = useAuth()

    const [query, setQuery] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        const trimmedQuery = query.trim()

        if (!trimmedQuery) {
            setSearchQuery("")
            setSearchResults([])
            return
        }

        setSearchQuery(trimmedQuery)
        setIsSearching(true)

        try {
            const token = await getToken()

            if (!token) {
                throw new Error("No authentication token available")
            }

            const response = await fetch(
                `${API_URL}/api/search?query=${encodeURIComponent(trimmedQuery)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!response.ok) {
                throw new Error(
                    `Search request failed: ${response.status}`
                )
            }

            const data: SearchResult[] = await response.json()

            setSearchResults(data)
        } catch (error) {
            console.error("Semantic search failed:", error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const getResultConfig = (documentType: SearchResult["documentType"]) => {
        switch (documentType) {
            case "COMMERCIAL":
                return {
                    label: "Commercial",
                    hrefPrefix: "/commercial-docs",
                    icon: <BriefcaseBusiness className="h-4 w-4" />,
                    headerIcon: (
                        <BriefcaseBusiness className="h-4 w-4 text-sky-600" />
                    ),
                    iconClassName:
                        "bg-sky-50 text-sky-600 dark:bg-sky-950/30",
                    headerClassName:
                        "bg-sky-50/70 dark:bg-sky-950/20",
                }

            case "PROCEDURE":
                return {
                    label: "Procedure",
                    hrefPrefix: "/procedures",
                    icon: <ClipboardList className="h-4 w-4" />,
                    headerIcon: (
                        <ClipboardList className="h-4 w-4 text-emerald-600" />
                    ),
                    iconClassName:
                        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
                    headerClassName:
                        "bg-emerald-50/70 dark:bg-emerald-950/20",
                }

            case "TECHNICAL":
            default:
                return {
                    label: "Technical",
                    hrefPrefix: "/technical-docs",
                    icon: <FileText className="h-4 w-4" />,
                    headerIcon: (
                        <FileText className="h-4 w-4 text-violet-600" />
                    ),
                    iconClassName:
                        "bg-violet-50 text-violet-600 dark:bg-violet-950/30",
                    headerClassName:
                        "bg-violet-50/70 dark:bg-violet-950/20",
                }
        }
    }

    const renderSection = (
        title: string,
        results: SearchResult[],
        icon: ReactNode,
        headerClassName: string
    ) => {
        if (results.length === 0) {
            return null
        }

        return (
            <div>
                <div
                    className={`flex items-center justify-between border-b px-5 py-3 ${headerClassName}`}
                >
                    <div className="flex items-center gap-2">
                        {icon}

                        <span className="text-sm font-medium">
                            {title}
                        </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                        {results.length}
                    </span>
                </div>

                <div className="divide-y">
                    {results.map((result) => {
                        const config = getResultConfig(result.documentType)

                        return (
                            <Link
                                key={`${result.documentType}-${result.documentId}`}
                                href={`${config.hrefPrefix}/${result.documentId}`}
                                className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50"
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClassName}`}
                                >
                                    {config.icon}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        <HighlightMatch
                                            text={result.title}
                                            query={searchQuery}
                                        />
                                    </p>

                                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                                        {result.chunkContent}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }

    const technicalResults = searchResults.filter(
        (result) => result.documentType === "TECHNICAL"
    )

    const commercialResults = searchResults.filter(
        (result) => result.documentType === "COMMERCIAL"
    )

    const procedureResults = searchResults.filter(
        (result) => result.documentType === "PROCEDURE"
    )

    const totalResults = searchResults.length

    return (
        <div>
            <SearchBar
                value={query}
                onChange={setQuery}
                onSubmit={handleSearch}
                placeholder="Search your entire knowledge..."
            />

            {searchQuery && (
                <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
                    {isSearching ? (
                        <div className="px-5 py-10 text-center">
                            <p className="text-sm font-medium">
                                Searching...
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Finding the most relevant documents.
                            </p>
                        </div>
                    ) : totalResults > 0 ? (
                        <>
                            <div className="border-b px-5 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Showing semantic results for{" "}
                                    <span className="font-medium text-foreground">
                                        "{searchQuery}"
                                    </span>
                                </p>
                            </div>

                            {renderSection(
                                "Technical documents",
                                technicalResults,
                                <FileText className="h-4 w-4 text-violet-600" />,
                                "bg-violet-50/70 dark:bg-violet-950/20"
                            )}

                            {renderSection(
                                "Commercial documents",
                                commercialResults,
                                <BriefcaseBusiness className="h-4 w-4 text-sky-600" />,
                                "bg-sky-50/70 dark:bg-sky-950/20"
                            )}

                            {renderSection(
                                "Procedures",
                                procedureResults,
                                <ClipboardList className="h-4 w-4 text-emerald-600" />,
                                "bg-emerald-50/70 dark:bg-emerald-950/20"
                            )}
                        </>
                    ) : (
                        <div className="px-5 py-10 text-center">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <p className="mt-3 text-sm font-medium">
                                No results found
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Try a different search.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}