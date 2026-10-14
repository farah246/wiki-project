import Link from "next/link"
import { Code2, Edit, FileText, GitBranch } from "lucide-react"

import { getTechnicalDoc } from "@/lib/api/technical-doc"
import { getTechnicalDocHistory } from "@/lib/api/doc-history"
import { CodeBlock } from "@/components/documents/code-block"
import { DocHistory } from "@/components/documents/doc-history"
import { HighlightText } from "@/components/documents/highlight-text"
import { MarkdownContent } from "@/components/documents/markdown-content"
import { ScrollToFirstMatch } from "@/components/documents/scroll-to-match"
import { PageHeader } from "@/components/ui/page-header"
import { canEditTechnicalDocs } from "@/lib/auth/roles"
import { getCurrentRole } from "@/lib/auth/get-role"
import { formatByline } from "@/lib/format"
import { parseHighlightQuery } from "@/lib/highlight"

type TechnicalDocPageProps = {
    params: Promise<{
        id: string
    }>
    // ?q=words: highlighted in the page, the first match is scrolled into view
    searchParams: Promise<{
        q?: string | string[]
    }>
}

export default async function TechnicalDocPage({
                                                   params,
                                                   searchParams,
                                               }: TechnicalDocPageProps) {
    const { id } = await params
    const { q } = await searchParams

    const terms = parseHighlightQuery(q)

    const role = await getCurrentRole()

    const canEdit = canEditTechnicalDocs(role)

    const technicalDoc = await getTechnicalDoc(Number(id))
    const history = await getTechnicalDocHistory(Number(id))

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    backHref="/technical-docs"
                    backLabel="Back to technical documents"
                    eyebrow="Technical document"
                    icon={FileText}
                    title={technicalDoc.title}
                    meta={formatByline(
                        technicalDoc.user?.username,
                        technicalDoc.updatedAt
                    )}
                    actions={
                        canEdit && (
                            <Link
                                href={`/technical-docs/${technicalDoc.id}/edit`}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                        )
                    }
                />

                {/* Content */}
                <div className="mt-8 space-y-6">

                    {/* Main content */}
                    <section className="rounded-2xl border bg-card">
                        <div className="border-b px-6 py-4">
                            <h2 className="font-semibold">
                                Content
                            </h2>
                        </div>

                        <div className="px-6 py-6">
                            <MarkdownContent highlight={terms}>
                                {technicalDoc.content}
                            </MarkdownContent>
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

                            <CodeBlock text={technicalDoc.codeSnippet}>
                                <pre className="overflow-x-auto bg-muted/40 py-6 pl-6 pr-20 text-sm leading-6">
                                    <code>
                                        <HighlightText
                                            text={technicalDoc.codeSnippet}
                                            terms={terms}
                                        />
                                    </code>
                                </pre>
                            </CodeBlock>
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
                                    <HighlightText
                                        text={technicalDoc.gitRef}
                                        terms={terms}
                                    />
                                </code>
                            </div>
                        </section>
                    )}

                    <DocHistory entries={history} />
                </div>
            </div>

            {terms.length > 0 && <ScrollToFirstMatch terms={terms} />}
        </div>
    )
}