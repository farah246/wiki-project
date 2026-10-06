import Link from "next/link"
import { ArrowLeft, Code2, Edit, FileText, GitBranch } from "lucide-react"
import { auth } from "@clerk/nextjs/server"

import { getTechnicalDoc } from "@/lib/api/technical-doc"
import { canEditTechnicalDocs } from "@/lib/auth/roles"

type TechnicalDocPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function TechnicalDocPage({
                                                   params,
                                               }: TechnicalDocPageProps) {
    const { id } = await params

    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    const canEdit = canEditTechnicalDocs(role)

    const technicalDoc = await getTechnicalDoc(Number(id))

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">

                {/* Back */}
                <Link
                    href="/technical-docs"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to technical documents
                </Link>

                {/* Header */}
                <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                            <FileText className="h-4 w-4" />
                            <span>Technical document</span>
                        </div>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                            {technicalDoc.title}
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Last updated{" "}
                            {new Date(
                                technicalDoc.updatedAt
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    {canEdit && (
                        <Link
                            href={`/technical-docs/${technicalDoc.id}/edit`}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                            <Edit className="h-4 w-4" />
                            Edit
                        </Link>
                    )}
                </div>

                {/* Content */}
                <div className="mt-8 space-y-6">

                    {/* Main content */}
                    <section className="rounded-2xl border bg-card">
                        <div className="border-b px-6 py-4">
                            <h2 className="font-semibold">
                                Content
                            </h2>
                        </div>

                        <div className="whitespace-pre-wrap px-6 py-6 text-sm leading-7">
                            {technicalDoc.content}
                        </div>
                    </section>

                    {/* Code snippet */}
                    {technicalDoc.codeSnippet && (
                        <section className="rounded-2xl border bg-card">
                            <div className="flex items-center gap-2 border-b px-6 py-4">
                                <Code2 className="h-4 w-4 text-violet-600" />
                                <h2 className="font-semibold">
                                    Code snippet
                                </h2>
                            </div>

                            <pre className="overflow-x-auto bg-muted/40 px-6 py-6 text-sm leading-6">
                                <code>{technicalDoc.codeSnippet}</code>
                            </pre>
                        </section>
                    )}

                    {/* Git reference */}
                    {technicalDoc.gitRef && (
                        <section className="rounded-2xl border bg-card">
                            <div className="flex items-center gap-2 border-b px-6 py-4">
                                <GitBranch className="h-4 w-4 text-sky-600" />
                                <h2 className="font-semibold">
                                    Git reference
                                </h2>
                            </div>

                            <div className="px-6 py-5">
                                <code className="rounded-md bg-muted px-3 py-2 text-sm">
                                    {technicalDoc.gitRef}
                                </code>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}