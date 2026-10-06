import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { getCommercialDoc } from "@/lib/api/commercial-doc"
import { CommercialDocForm } from "@/components/forms/commercial-doc-form"
import { canEditCommercialDocs } from "@/lib/auth/roles"

type EditCommercialDocPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditCommercialDocPage({
                                                        params,
                                                    }: EditCommercialDocPageProps) {
    const { id } = await params
    const documentId = Number(id)

    if (Number.isNaN(documentId)) {
        notFound()
    }

    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    if (!canEditCommercialDocs(role)) {
        redirect(`/commercial-docs/${id}`)
    }

    let document

    try {
        document = await getCommercialDoc(documentId)
    } catch {
        notFound()
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Edit commercial document
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Update the information and proposal content.
                    </p>
                </div>

                <CommercialDocForm document={document} />
            </div>
        </div>
    )
}