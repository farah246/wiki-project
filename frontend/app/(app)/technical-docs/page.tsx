import Link from "next/link"
import { ArrowRight, FileText, Plus } from "lucide-react"

import { getTechnicalDocs } from "@/lib/api/technical-doc"

export default async function TechnicalDocsPage() {
    const technicalDocs = await getTechnicalDocs()

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                            <FileText className="h-4 w-4" />
                            <span>Knowledge base</span>
                        </div>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            Technical Documents
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Browse and manage your technical knowledge.
                        </p>
                    </div>

                    <Link
                        href="/technical-docs/new"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                    >
                        <Plus className="h-4 w-4" />
                        New document
                    </Link>
                </div>

                {/* Documents */}
                <section className="mt-8 overflow-hidden rounded-2xl border bg-card">
                    {technicalDocs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                <FileText className="h-6 w-6" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold">
                                No technical documents yet
                            </h2>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Start building your technical knowledge base
                                by creating your first document.
                            </p>

                            <Link
                                href="/technical-docs/new"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted"
                            >
                                Create your first document
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {technicalDocs.map((doc) => (
                                <Link
                                    key={doc.id}
                                    href={`/technical-docs/${doc.id}`}
                                    className="group flex items-center gap-4 px-6 py-5 transition hover:bg-muted/40"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                        <FileText className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h2 className="truncate font-medium group-hover:text-violet-700">
                                            {doc.title}
                                        </h2>

                                        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                            {doc.content}
                                        </p>
                                    </div>

                                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
