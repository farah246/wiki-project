"use client"

import { useOptimistic } from "react"
import Form from "next/form"
import Link from "next/link"
import { FileText, Pencil, Trash2 } from "lucide-react"

import { deleteTechnicalDoc } from "@/actions/technical-docs"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

type TechnicalDocListProps = {
    documents: TechnicalDoc[]
}

export function TechnicalDocList({
    documents,
}: TechnicalDocListProps) {
    const [optimisticDocuments, setOptimisticDocuments] =
        useOptimistic(
            documents,
            (currentDocuments, documentId: number) => {
                return currentDocuments.filter(
                    (document) => document.id !== documentId
                )
            }
        )

    const deleteDocument = async (documentId: number) => {
        setOptimisticDocuments(documentId)
        await deleteTechnicalDoc(documentId)
    }

    if (optimisticDocuments.length === 0) {
        return (
            <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

                <h2 className="mt-4 text-lg font-semibold">
                    No technical documents
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Create your first technical document to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {optimisticDocuments.map((document) => (
                <article
                    key={document.id}
                    className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <Link
                                href={`/technical-docs/${document.id}`}
                                className="text-lg font-semibold tracking-tight hover:text-violet-600"
                            >
                                {document.title}
                            </Link>

                            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                {document.content}
                            </p>
                        </div>

                        <FileText className="h-5 w-5 shrink-0 text-violet-600" />
                    </div>

                    <div className="mt-5 flex items-center gap-2">
                        <Link
                            href={`/technical-docs/${document.id}/edit`}
className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
    >
    <Pencil className="h-4 w-4" />
    Edit
    </Link>

<Form
    action={deleteDocument.bind(
        null,
        document.id
    )}
>
    <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
    >
        <Trash2 className="h-4 w-4" />
        Delete
    </button>
</Form>
</div>
</article>
))}
</div>
)
}
