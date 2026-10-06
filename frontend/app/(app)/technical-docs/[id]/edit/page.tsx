import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { ArrowLeft, FileText } from "lucide-react"

import { getTechnicalDoc } from "@/lib/api/technical-doc"
import { TechnicalDocForm } from "@/components/forms/technical-doc-form"
import { canEditTechnicalDocs } from "@/lib/auth/roles"

type EditTechnicalDocPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditTechnicalDocPage({
                                                       params,
                                                   }: EditTechnicalDocPageProps) {
    const { id } = await params

    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    if (!canEditTechnicalDocs(role)) {
        redirect(`/technical-docs/${id}`)
    }

    const document = await getTechnicalDoc(Number(id))

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
                <Link
                    href={`/technical-docs/${document.id}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to document
                </Link>

                <div className="mt-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                        <FileText className="h-4 w-4" />
                        <span>Technical document</span>
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                        Edit technical document
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Update the content and technical details of this
                        document.
                    </p>
                </div>

                <div className="mt-8">
                    <TechnicalDocForm document={document} />
                </div>
            </div>
        </div>
    )
}