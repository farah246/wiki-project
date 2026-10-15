import Link from "next/link"
import { Plus } from "lucide-react"

import { getTechnicalDocs } from "@/lib/api/technical-doc"
import { TechnicalDocList } from "@/components/technical-docs/technical-doc-list"
import { PageHeader } from "@/components/ui/page-header"
import { canCreateTechnicalDocs } from "@/lib/auth/roles"
import { getCurrentRole } from "@/lib/auth/get-role"
import { getFavorites } from "@/lib/api/favorites"
import { favoriteIdsOf } from "@/lib/favorites"

export default async function TechnicalDocsPage() {
    const role = await getCurrentRole()

    const canCreate = canCreateTechnicalDocs(role)

    const [documents, favorites] = await Promise.all([
        getTechnicalDocs(),
        getFavorites(),
    ])
    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    title="Technical documents"
                    description="Browse and manage your team's technical knowledge."
                    actions={
                        canCreate && (
                            <Link
                                href="/technical-docs/new"
                                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                            >
                                <Plus className="h-4 w-4" />
                                New document
                            </Link>
                        )
                    }
                />

                <div className="mt-8 space-y-6">
                    <TechnicalDocList
                        documents={documents}
                        favoriteIds={favoriteIdsOf(favorites,"TECHNICAL_DOC")}
                    />
                </div>
            </div>
        </div>
    )
}