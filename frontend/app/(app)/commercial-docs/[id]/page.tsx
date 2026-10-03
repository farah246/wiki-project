
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"

import { getCommercialDoc } from "@/lib/api/commercial-doc"

type CommercialDocPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function CommercialDocPage({
    params,
}: CommercialDocPageProps) {
    const { id } = await params
    const documentId = Number(id)

    if (Number.isNaN(documentId)) {
        notFound()
    }

    let document

    try {
        document = await getCommercialDoc(documentId)
    } catch {
        notFound()
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div>
                        <Link
                            href="/commercial-docs"
                            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to commercial documents
                        </Link>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            {document.title}
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            {document.clientName}
                        </p>
                    </div>

                    <Link
                        href={`/commercial-docs/${document.id}/edit`}
className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
    >
    <Pencil className="h-4 w-4" />
    Edit
    </Link>
</div>

<article className="rounded-2xl border bg-card">
    <div className="border-b px-6 py-4">
        <h2 className="font-semibold">
            Proposal
        </h2>
    </div>

    <div className="px-6 py-6">
        <div className="whitespace-pre-wrap text-sm leading-7">
            {document.proposalText}
        </div>
    </div>
</article>

<div className="mt-6 text-xs text-muted-foreground">
    <p>
        Created:{" "}
        {new Date(document.createdAt).toLocaleString()}
    </p>

    <p className="mt-1">
        Updated:{" "}
        {new Date(document.updatedAt).toLocaleString()}
    </p>
</div>
</div>
</div>
)
}
