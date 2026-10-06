import Link from "next/link"
import { Plus } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { CommercialDocList } from "@/components/commercial-docs/commercial-doc-list"
import { canCreateCommercialDocs } from "@/lib/auth/roles"

export default async function CommercialDocsPage() {
    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    const canCreate = canCreateCommercialDocs(role)

    const documents = await getCommercialDocs()

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Commercial documents
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Browse and manage your team's commercial knowledge.
                        </p>
                    </div>

                    {canCreate && (
                        <Link
                            href="/commercial-docs/new"
                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                        >
                            <Plus className="h-4 w-4" />
                            New document
                        </Link>
                    )}
                </div>

                <div className="mt-8 space-y-6">
                    <CommercialDocList documents={documents} />
                </div>
            </div>
        </div>
    )
}