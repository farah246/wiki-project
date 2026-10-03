"use client"

import { startTransition, useOptimistic, useState } from "react"
import Link from "next/link"
import {
    FileText,
    Pencil,
    Trash2,
} from "lucide-react"

import { deleteCommercialDoc } from "@/actions/commercial-doc"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import type { CommercialDoc } from "@/lib/types/commercial-doc"

type CommercialDocListProps = {
    documents: CommercialDoc[]
}

export function CommercialDocList({
                                      documents,
                                  }: CommercialDocListProps) {
    const [optimisticDocuments, setOptimisticDocuments] =
        useOptimistic(
            documents,
            (currentDocuments, documentId: number) => {
                return currentDocuments.filter(
                    (document) => document.id !== documentId
                )
            }
        )

    const [documentToDelete, setDocumentToDelete] =
        useState<CommercialDoc | null>(null)

    const deleteDocument = async (documentId: number) => {
        startTransition(() => {
            setOptimisticDocuments(documentId)
        })

        setDocumentToDelete(null)

        await deleteCommercialDoc(documentId)
    }

    if (optimisticDocuments.length === 0) {
        return (
            <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

                <h2 className="mt-4 text-lg font-semibold">
                    No commercial documents
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Create your first commercial document to get started.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-4">
                {optimisticDocuments.map((document) => (
                    <article
                        key={document.id}
                        className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <Link
                                    href={`/commercial-docs/${document.id}`}
                                    className="text-lg font-semibold tracking-tight hover:text-violet-600"
                                >
                                    {document.title}
                                </Link>

                                <p className="mt-2 text-sm font-medium text-muted-foreground">
                                    {document.clientName}
                                </p>

                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                    {document.proposalText}
                                </p>
                            </div>

                            <FileText className="h-5 w-5 shrink-0 text-violet-600" />
                        </div>

                        <div className="mt-5 flex items-center gap-2">
                            <Link
                                href={`/commercial-docs/${document.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </Link>

                            <button
                                type="button"
                                onClick={() =>
                                    setDocumentToDelete(document)
                                }
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            <DeleteConfirmationDialog
                open={Boolean(documentToDelete)}
                title="Delete commercial document?"
                description={
                    documentToDelete
                        ? `Are you sure you want to delete "${documentToDelete.title}"? This action cannot be undone.`
                        : undefined
                }
                onCancel={() => setDocumentToDelete(null)}
                onConfirm={() => {
                    if (documentToDelete) {
                        deleteDocument(documentToDelete.id)
                    }
                }}
            />
        </>
    )
}