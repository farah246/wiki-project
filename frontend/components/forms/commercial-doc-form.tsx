
"use client"

import Link from "next/link"
import { useActionState } from "react"

import {
    createCommercialDoc,
    updateCommercialDoc,
    type CommercialDocFormState,
} from "@/actions/commercial-doc"
import type { CommercialDoc } from "@/lib/types/commercial-doc"

type CommercialDocFormProps = {
    document?: CommercialDoc
}

const initialState: CommercialDocFormState = {
    error: "",
}

export function CommercialDocForm({
    document,
}: CommercialDocFormProps) {
    const isEditing = Boolean(document)

    const action = document
        ? updateCommercialDoc.bind(null, document.id)
        : createCommercialDoc

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
                            ? "Update the basic information of your commercial document."
                            : "Give your commercial document a title and identify the client."}
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
                            defaultValue={document?.title ?? ""}
                            placeholder="e.g. Enterprise Cloud Proposal"
                            required
                            disabled={isPending}
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="clientName"
                            className="text-sm font-medium"
                        >
                            Client name
                        </label>

                        <input
                            id="clientName"
                            name="clientName"
                            type="text"
                            defaultValue={document?.clientName ?? ""}
                            placeholder="e.g. Acme Corporation"
                            required
                            disabled={isPending}
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border bg-card">
                <div className="border-b px-6 py-4">
                    <h2 className="font-semibold">
                        Proposal
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Write the commercial proposal and information
                        related to the client.
                    </p>
                </div>

                <div className="px-6 py-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="proposalText"
                            className="text-sm font-medium"
                        >
                            Proposal text
                        </label>

                        <textarea
                            id="proposalText"
                            name="proposalText"
                            defaultValue={document?.proposalText ?? ""}
                            placeholder="Write the commercial proposal here..."
                            required
                            disabled={isPending}
                            rows={14}
                            className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={
                        document
                            ? `/commercial-docs/${document.id}`
                            : "/commercial-docs"
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
                            : "Create document"}
                </button>
            </div>
        </form>
    )
}

