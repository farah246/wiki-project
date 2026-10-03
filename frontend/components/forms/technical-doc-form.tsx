"use client"

import Link from "next/link"
import { useActionState } from "react"

import {
    createTechnicalDoc,
    updateTechnicalDoc,
    type TechnicalDocFormState,
} from "@/actions/technical-docs"
import type { TechnicalDoc } from "@/lib/types/technical-doc"

type TechnicalDocFormProps = {
    document?: TechnicalDoc
}

const initialState: TechnicalDocFormState = {
    error: "",
}

export function TechnicalDocForm({
                                     document,
                                 }: TechnicalDocFormProps) {
    const isEditing = Boolean(document)

    const action = document
        ? updateTechnicalDoc.bind(null, document.id)
        : createTechnicalDoc

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
                            ? "Update the title and content of your technical document."
                            : "Give your technical document a title and describe the knowledge it contains."}
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
                            placeholder="e.g. Spring Boot REST API"
                            required
                            disabled={isPending}
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="content"
                            className="text-sm font-medium"
                        >
                            Content
                        </label>

                        <textarea
                            id="content"
                            name="content"
                            defaultValue={document?.content ?? ""}
                            placeholder="Write the technical documentation here..."
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
                        Technical details
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add optional code or Git information related to
                        this document.
                    </p>
                </div>

                <div className="space-y-6 px-6 py-6">
                    <div className="space-y-2">
                        <label
                            htmlFor="codeSnippet"
                            className="text-sm font-medium"
                        >
                            Code snippet

                            <span className="ml-2 font-normal text-muted-foreground">
                                Optional
                            </span>
                        </label>

                        <textarea
                            id="codeSnippet"
                            name="codeSnippet"
                            defaultValue={document?.codeSnippet ?? ""}
                            placeholder="Paste a relevant code snippet..."
                            disabled={isPending}
                            rows={10}
                            className="w-full resize-y rounded-lg border bg-background px-3 py-2.5 font-mono text-sm leading-6 outline-none transition placeholder:font-sans placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="gitRef"
                            className="text-sm font-medium"
                        >
                            Git reference

                            <span className="ml-2 font-normal text-muted-foreground">
                                Optional
                            </span>
                        </label>

                        <input
                            id="gitRef"
                            name="gitRef"
                            type="text"
                            defaultValue={document?.gitRef ?? ""}
                            placeholder="e.g. feature/authentication"
                            disabled={isPending}
                            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </section>

            <div className="flex items-center justify-end gap-3">
                <Link
                    href={
                        document
                            ? `/technical-docs/${document.id}`
                            : "/technical-docs"
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