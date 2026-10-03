"use client"

import { startTransition, useOptimistic, useState } from "react"
import Link from "next/link"
import {
    FileCog,
    Pencil,
    Trash2,
} from "lucide-react"

import { deleteProcedure } from "@/actions/procedures"
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { SearchBar } from "@/components/ui/search-bar"
import type { Procedure } from "@/lib/types/procedure"

type ProcedureListProps = {
    procedures: Procedure[]
}

export function ProcedureList({
                                  procedures,
                              }: ProcedureListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    const [optimisticProcedures, setOptimisticProcedures] =
        useOptimistic(
            procedures,
            (currentProcedures, procedureId: number) => {
                return currentProcedures.filter(
                    (procedure) => procedure.id !== procedureId
                )
            }
        )

    const [procedureToDelete, setProcedureToDelete] =
        useState<Procedure | null>(null)

    const filteredProcedures = optimisticProcedures.filter((procedure) => {
        const query = searchQuery.toLowerCase().trim()

        if (!query) {
            return true
        }

        return (
            procedure.title.toLowerCase().includes(query) ||
            procedure.description.toLowerCase().includes(query) ||
            procedure.visualModel?.toLowerCase().includes(query)
        )
    })

    const deleteDocument = async (procedureId: number) => {
        startTransition(() => {
            setOptimisticProcedures(procedureId)
        })

        setProcedureToDelete(null)

        await deleteProcedure(procedureId)
    }

    return (
        <>
            <div className="space-y-6">
                <SearchBar
                    placeholder="Search procedures..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />

                {filteredProcedures.length === 0 ? (
                    <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                        <FileCog className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold">
                            {searchQuery
                                ? "No matching procedures"
                                : "No procedures"}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try a different search term."
                                : "Create your first procedure to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProcedures.map((procedure) => (
                            <article
                                key={procedure.id}
                                className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/procedures/${procedure.id}`}
                                            className="text-lg font-semibold tracking-tight hover:text-violet-600"
                                        >
                                            {procedure.title}
                                        </Link>

                                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                                            {procedure.description}
                                        </p>
                                    </div>

                                    <FileCog className="h-5 w-5 shrink-0 text-violet-600" />
                                </div>

                                <div className="mt-5 flex items-center gap-2">
                                    <Link
                                        href={`/procedures/${procedure.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        Edit
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProcedureToDelete(procedure)
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
                )}
            </div>

            <DeleteConfirmationDialog
                open={Boolean(procedureToDelete)}
                title="Delete procedure?"
                description={
                    procedureToDelete
                        ? `Are you sure you want to delete "${procedureToDelete.title}"? This action cannot be undone.`
                        : undefined
                }
                onCancel={() => setProcedureToDelete(null)}
                onConfirm={() => {
                    if (procedureToDelete) {
                        deleteDocument(procedureToDelete.id)
                    }
                }}
            />
        </>
    )
}