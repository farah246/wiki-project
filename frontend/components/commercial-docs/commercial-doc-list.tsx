"use client"

import { startTransition, useOptimistic, useState } from "react"
import Link from "next/link"
import {
    FileText,
    Pencil,
    Trash2,
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"

import { deleteCommercialDoc } from "@/actions/commercial-doc"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { SearchBar } from "@/components/ui/search-bar"
import type { CommercialDoc } from "@/lib/types/commercial-doc"
import {
    canDeleteCommercialDocs,
    canEditCommercialDocs,
} from "@/lib/auth/roles"

type CommercialDocListProps = {
    documents: CommercialDoc[]
}

export function CommercialDocList({
                                      documents,
                                  }: CommercialDocListProps) {
    const { sessionClaims } = useAuth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    const canEdit = canEditCommercialDocs(role)
    const canDelete = canDeleteCommercialDocs(role)

    const [searchQuery, setSearchQuery] = useState("")

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

    const filteredDocuments = optimisticDocuments.filter((document) => {
        const query = searchQuery.toLowerCase().trim()

        if (!query) {
            return true
        }

        return (
            document.title.toLowerCase().includes(query) ||
            document.proposalText.toLowerCase().includes(query) ||
            document.clientName.toLowerCase().includes(query)
        )
    })

    const deleteDocument = async (documentId: number) => {
        startTransition(() => {
            setOptimisticDocuments(documentId)
        })

        setDocumentToDelete(null)

        await deleteCommercialDoc(documentId)
    }

    return (
        <>
            <div className="space-y-6">
                <SearchBar
                    placeholder="Search commercial documents..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />

                {filteredDocuments.length === 0 ? (
                    <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold">
                            {searchQuery
                                ? "No matching documents"
                                : "No commercial documents"}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try a different search term."
                                : "Create your first commercial document to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredDocuments.map((document) => (
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

                                {(canEdit || canDelete) && (
                                    <div className="mt-5 flex items-center gap-2">
                                        {canEdit && (
                                            <Link
                                                href={`/commercial-docs/${document.id}/edit`}
                                                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </Link>
                                        )}

                                        {canDelete && (
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
                                        )}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
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