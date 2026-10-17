import type { CommercialDoc } from "@/lib/types/commercial-doc"
import type { Procedure } from "@/lib/types/procedure"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

export type RecentDocument = {
    key: string
    title: string
    description: string
    type: "technical" | "commercial" | "procedure"
    href: string
    date: string
}

export type DocumentSources = {
    technicalDocs: TechnicalDoc[]
    commercialDocs: CommercialDoc[]
    procedures: Procedure[]
}

// The latest documents across the three types, newest first
export function buildRecentDocuments(
    { technicalDocs, commercialDocs, procedures }: DocumentSources,
    limit = 5
): RecentDocument[] {
    const documents = [
        ...technicalDocs.map(
            (doc): RecentDocument => ({
                key: `technical-${doc.id}`,
                title: doc.title,
                description: doc.content,
                type: "technical",
                href: `/technical-docs/${doc.id}`,
                date: doc.updatedAt || doc.createdAt || "",
            })
        ),
        ...commercialDocs.map(
            (doc): RecentDocument => ({
                key: `commercial-${doc.id}`,
                title: doc.title,
                description: doc.proposalText,
                type: "commercial",
                href: `/commercial-docs/${doc.id}`,
                date: doc.updatedAt || doc.createdAt || "",
            })
        ),
        ...procedures.map(
            (doc): RecentDocument => ({
                key: `procedure-${doc.id}`,
                title: doc.title,
                description: doc.description,
                type: "procedure",
                href: `/procedures/${doc.id}`,
                date: doc.updatedAt || doc.createdAt || "",
            })
        ),
    ]

    return documents
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit)
}