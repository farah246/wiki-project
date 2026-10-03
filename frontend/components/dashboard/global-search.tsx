"use client"

import Link from "next/link"
import {
    BriefcaseBusiness,
    ClipboardList,
    FileText,
} from "lucide-react"
import { useMemo, useState } from "react"

import { SearchBar } from "@/components/ui/search-bar"
import { TechnicalDoc } from "@/lib/types/technical-doc"
import { CommercialDoc } from "@/lib/types/commercial-doc"
import { Procedure } from "@/lib/types/procedure"
import type { ReactNode } from "react"
type GlobalSearchProps = {
    technicalDocs: TechnicalDoc[]
    commercialDocs: CommercialDoc[]
    procedures: Procedure[]
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

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

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
    const [query, setQuery] = useState("")

    const normalizedQuery = query.trim().toLowerCase()

    const results = useMemo(() => {
        if (!normalizedQuery) {
            return {
                technical: [],
                commercial: [],
                procedures: [],
            }
        }

        return {
            technical: technicalDocs
                .filter((doc) =>
                    [
                        doc.title,
                        doc.content,
                        doc.codeSnippet,
                        doc.gitRef,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            value!.toLowerCase().includes(normalizedQuery)
                        )
                )
                .slice(0, 5),

            commercial: commercialDocs
                .filter((doc) =>
                    [
                        doc.title,
                        doc.proposalText,
                        doc.clientName,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            value!.toLowerCase().includes(normalizedQuery)
                        )
                )
                .slice(0, 5),

            procedures: procedures
                .filter((doc) =>
                    [
                        doc.title,
                        doc.description,
                        doc.visualModel,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            value!.toLowerCase().includes(normalizedQuery)
                        )
                )
                .slice(0, 5),
        }
    }, [
        normalizedQuery,
        technicalDocs,
        commercialDocs,
        procedures,
    ])

    const totalResults =
        results.technical.length +
        results.commercial.length +
        results.procedures.length

    const renderSection = (
        title: string,
        count: number,
        icon: ReactNode,
        children: ReactNode,
        headerClassName: string
    ) => {
        if (count === 0) {
            return null
        }

        return (
            <div>
                <div     className={`flex items-center justify-between border-b px-5 py-3 ${headerClassName}`}>
                    <div className="flex items-center gap-2">
                        {icon}

                        <span className="text-sm font-medium">
                            {title}
                        </span>
                    </div>

                    <span className="text-xs text-muted-foreground">
                        {count}
                    </span>
                </div>

                <div className="divide-y">
                    {children}
                </div>
            </div>
        )
    }

    return (
        <div>
            <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search your entire knowledge..."
            />

            {normalizedQuery && (
                <div className="mt-4 overflow-hidden rounded-2xl border bg-card shadow-sm">
                    {totalResults > 0 ? (
                        <>
                            <div className="border-b px-5 py-3">
                                <p className="text-xs text-muted-foreground">
                                    Showing results for{" "}
                                    <span className="font-medium text-foreground">
                                        "{query}"
                                    </span>
                                </p>
                            </div>

                            {renderSection(
                                "Technical documents",
                                results.technical.length,
                                <FileText className="h-4 w-4 text-violet-600" />,
                                results.technical.map((doc) => (
                                    <Link
                                        key={`technical-${doc.id}`}
                                        href={`/technical-docs/${doc.id}`}
                                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                            <FileText className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                <HighlightMatch
                                                    text={doc.title}
                                                    query={query}
                                                />                                            </p>

                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Technical document
                                            </p>
                                        </div>
                                    </Link>
                                )),
                                "bg-violet-50/70 dark:bg-violet-950/20"

                            )}

                            {renderSection(
                                "Commercial documents",
                                results.commercial.length,
                                <BriefcaseBusiness className="h-4 w-4 text-sky-600" />,
                                results.commercial.map((doc) => (
                                    <Link
                                        key={`commercial-${doc.id}`}
                                        href={`/commercial-docs/${doc.id}`}
                                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/30">
                                            <BriefcaseBusiness className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                <HighlightMatch
                                                    text={doc.title}
                                                    query={query}
                                                />                                            </p>

                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Commercial document
                                            </p>
                                        </div>
                                    </Link>
                                )),
                                "bg-sky-50/70 dark:bg-sky-950/20"
                            )}

                            {renderSection(
                                "Procedures",
                                results.procedures.length,
                                <ClipboardList className="h-4 w-4 text-violet-600" />,
                                results.procedures.map((doc) => (
                                    <Link
                                        key={`procedure-${doc.id}`}
                                        href={`/procedures/${doc.id}`}
                                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-muted/50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                            <ClipboardList className="h-4 w-4" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                <HighlightMatch
                                                    text={doc.title}
                                                    query={query}
                                                />                                            </p>

                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Procedure
                                            </p>
                                        </div>
                                    </Link>
                                )),
                                "bg-indigo-50/70 dark:bg-indigo-950/20"
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
                                Try a different keyword.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}