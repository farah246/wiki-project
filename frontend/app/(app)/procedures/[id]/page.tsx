import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import { getProcedure } from "@/lib/api/procedures"
import { canEditProcedures } from "@/lib/auth/roles"

type ProcedurePageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function ProcedurePage({
                                                params,
                                            }: ProcedurePageProps) {
    const { id } = await params
    const procedureId = Number(id)

    if (Number.isNaN(procedureId)) {
        notFound()
    }

    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    const canEdit = canEditProcedures(role)

    let procedure

    try {
        procedure = await getProcedure(procedureId)
    } catch {
        notFound()
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <Link
                            href="/procedures"
                            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to procedures
                        </Link>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            {procedure.title}
                        </h1>
                    </div>

                    {canEdit && (
                        <Link
                            href={`/procedures/${procedure.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                    )}
                </div>

                <div className="space-y-6">
                    <article className="rounded-2xl border bg-card">
                        <div className="border-b px-6 py-4">
                            <h2 className="font-semibold">
                                Description
                            </h2>
                        </div>

                        <div className="px-6 py-6">
                            <div className="whitespace-pre-wrap text-sm leading-7">
                                {procedure.description}
                            </div>
                        </div>
                    </article>

                    {procedure.visualModel && (
                        <article className="rounded-2xl border bg-card">
                            <div className="border-b px-6 py-4">
                                <h2 className="font-semibold">
                                    Visual model
                                </h2>
                            </div>

                            <div className="px-6 py-6">
                                <pre className="whitespace-pre-wrap overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-6">
                                    {procedure.visualModel}
                                </pre>
                            </div>
                        </article>
                    )}
                </div>

                <div className="mt-6 text-xs text-muted-foreground">
                    <p>
                        Created:{" "}
                        {new Date(procedure.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-1">
                        Updated:{" "}
                        {new Date(procedure.updatedAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}