"use client"

import { useOptimistic } from "react"
import Form from "next/form"
import Link from "next/link"
import {
    FileCog,
    Pencil,
    Trash2,
} from "lucide-react"

import { deleteProcedure } from "@/actions/procedures"
import type { Procedure } from "@/lib/types/procedure"

type ProcedureListProps = {
    procedures: Procedure[]
}

export function ProcedureList({
                                  procedures,
                              }: ProcedureListProps) {
    const [optimisticProcedures, setOptimisticProcedures] =
        useOptimistic(
            procedures,
            (currentProcedures, procedureId: number) => {
                return currentProcedures.filter(
                    (procedure) => procedure.id !== procedureId
                )
            }
        )

    const deleteDocument = async (procedureId: number) => {
        setOptimisticProcedures(procedureId)
        await deleteProcedure(procedureId)
    }

    if (optimisticProcedures.length === 0) {
        return (
            <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                <FileCog className="mx-auto h-10 w-10 text-muted-foreground" />

                <h2 className="mt-4 text-lg font-semibold">
                    No procedures
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                    Create your first procedure to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {optimisticProcedures.map((procedure) => (
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

                        <Form
                            action={deleteDocument.bind(
                                null,
                                procedure.id
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