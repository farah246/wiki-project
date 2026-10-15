import { Star } from "lucide-react"

import { DocumentCard } from "@/components/documents/document-card"
import { FavoriteButton } from "@/components/documents/favorite-button"
import { PageHeader } from "@/components/ui/page-header"
import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { getFavorites } from "@/lib/api/favorites"
import { getProcedures } from "@/lib/api/procedures"
import { getTechnicalDocs } from "@/lib/api/technical-doc"
import { toPlainText } from "@/lib/markdown"
import type { FavoriteDocType } from "@/lib/types/favorite"
import { DOC_PATHS } from "@/lib/types/activity"

type FavoriteItem = {
    key: string
    docType: FavoriteDocType
    docId: number
    title: string
    description: string
    cardType: "technical" | "commercial" | "procedure"
    href: string
}

const groups = [
    { title: "Technical documents", type: "technical" },
    { title: "Commercial documents", type: "commercial" },
    { title: "Procedures", type: "procedure" },
] as const

export default async function FavoritesPage() {
    const [favorites, technicalDocs, commercialDocs, procedures] =
        await Promise.all([
            getFavorites(),
            getTechnicalDocs(),
            getCommercialDocs(),
            getProcedures(),
        ])

    const technical = new Map(technicalDocs.map((doc) => [doc.id, doc]))
    const commercial = new Map(commercialDocs.map((doc) => [doc.id, doc]))
    const procedureById = new Map(procedures.map((doc) => [doc.id, doc]))

    // A favorite whose document is gone is skipped (the backend also cleans
    // them up when a document is deleted, this is just a safety net).
    const items = favorites.flatMap((favorite): FavoriteItem[] => {
        const base = {
            key: `${favorite.docType}-${favorite.docId}`,
            docType: favorite.docType,
            docId: favorite.docId,
            href: `${DOC_PATHS[favorite.docType]}/${favorite.docId}`,
        }

        switch (favorite.docType) {
            case "TECHNICAL_DOC": {
                const doc = technical.get(favorite.docId)
                return doc
                    ? [{ ...base, title: doc.title, description: toPlainText(doc.content), cardType: "technical" }]
                    : []
            }
            case "COMMERCIAL_DOC": {
                const doc = commercial.get(favorite.docId)
                return doc
                    ? [{ ...base, title: doc.title, description: toPlainText(doc.proposalText), cardType: "commercial" }]
                    : []
            }
            case "PROCEDURE": {
                const doc = procedureById.get(favorite.docId)
                return doc
                    ? [{ ...base, title: doc.title, description: toPlainText(doc.description), cardType: "procedure" }]
                    : []
            }
        }
    })

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    title="Favorites"
                    description="The documents you starred, most recent first."
                />

                <div className="mt-8">
                    {items.length === 0 ? (
                        <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                            <Star className="mx-auto h-10 w-10 text-muted-foreground" />

                            <h2 className="mt-4 text-lg font-semibold">
                                No favorites yet
                            </h2>

                            <p className="mt-2 text-sm text-muted-foreground">
                                Click the star on a document to find it here quickly.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {groups.map((group) => {
                                const groupItems = items.filter(
                                    (item) => item.cardType === group.type
                                )

                                if (groupItems.length === 0) return null

                                return (
                                    <section key={group.type}>
                                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                            {group.title}
                                        </h2>

                                        <div className="divide-y overflow-hidden rounded-2xl border bg-card">
                                            {groupItems.map((item) => (
                                                <div
                                                    key={item.key}
                                                    className="flex items-center gap-2 pr-4"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <DocumentCard
                                                            title={item.title}
                                                            description={item.description}
                                                            type={item.cardType}
                                                            href={item.href}
                                                        />
                                                    </div>

                                                    <FavoriteButton
                                                        docType={item.docType}
                                                        docId={item.docId}
                                                        isFavorite
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}