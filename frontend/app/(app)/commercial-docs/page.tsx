import Link from "next/link"
import { Plus } from "lucide-react"

import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { CommercialDocList } from "@/components/commercial-docs/commercial-doc-list"
import { PageHeader } from "@/components/ui/page-header"
import { canCreateCommercialDocs } from "@/lib/auth/roles"
import { getCurrentRole } from "@/lib/auth/get-role"
import { getFavorites } from "@/lib/api/favorites"
import { favoriteIdsOf } from "@/lib/favorites"

export default async function CommercialDocsPage() {
    const role = await getCurrentRole()

    const canCreate = canCreateCommercialDocs(role)

    const [documents, favorites] = await Promise.all([
        getCommercialDocs(),
        getFavorites(),
    ])
    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    title="Commercial documents"
                    description="Browse and manage your team's commercial knowledge."
                    actions={
                        canCreate && (
                            <Link
                                href="/commercial-docs/new"
                                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                            >
                                <Plus className="h-4 w-4" />
                                New document
                            </Link>
                        )
                    }
                />

                <div className="mt-8 space-y-6">
                    <CommercialDocList documents={documents} favoriteIds={favoriteIdsOf(favorites, "COMMERCIAL_DOC")} />
                </div>
            </div>
        </div>
    )
}