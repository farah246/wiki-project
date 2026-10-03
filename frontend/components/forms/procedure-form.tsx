"use client"

import Link from "next/link"
import { useActionState } from "react"

import {
    createProcedure,
    updateProcedure,
    type ProcedureFormState,
} from "@/actions/procedures"

import type { Procedure } from "@/lib/types/procedure"

type ProcedureFormProps = {
    procedure?: Procedure
}

const initialState: ProcedureFormState = {
    error: "",
}

export function ProcedureForm({
                                  procedure,
                              }: ProcedureFormProps) {
    const isEditing = Boolean(procedure)

    const action = procedure
        ? updateProcedure.bind(null, procedure.id)
        : createProcedure

    const [state, formAction, isPending] = useActionState(
        action,
        initialState
    )

    return (
        <form action={formAction} className="space-y-8">
            {state?.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                    {state.error}
                </div>
            )}

            <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Basic information
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {isEditing
                            ? "Update the basic information of your procedure."
                            : "Give your procedure a clear title and description."}
                    </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium"
                        >
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            defaultValue={procedure?.title ?? ""}
                            placeholder="e.g. Deploy a Spring Boot service"
                            required
                            disabled={isPending}
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            defaultValue={procedure?.description ?? ""}
                            placeholder="Describe the procedure and its steps..."
                            required
                            disabled={isPending}
                            rows={12}
                            className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Visual model
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a visual representation, diagram, or model of the procedure.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="visualModel"
                            className="text-sm font-medium"
                        >
                            Visual model
                        </label>

                        <textarea
                            id="visualModel"
                            name="visualModel"
                            defaultValue={procedure?.visualModel ?? ""}
                            placeholder="Add a diagram, Mermaid model, or visual description..."
                            disabled={isPending}
                            rows={10}
                            className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 font-mono text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={
                        procedure
                            ? `/procedures/${procedure.id}`
                            : "/procedures"
                    }
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPending
                        ? isEditing
                            ? "Saving..."
                            : "Creating..."
                        : isEditing
                            ? "Save changes"
                            : "Create procedure"}
                </button>
            </div>
        </form>
    )
}