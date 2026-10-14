import { redirect } from "next/navigation"
import { FileText } from "lucide-react"

import { getTechnicalDoc } from "@/lib/api/technical-doc"
import { TechnicalDocForm } from "@/components/forms/technical-doc-form"
import { PageHeader } from "@/components/ui/page-header"
import { canEditTechnicalDocs } from "@/lib/auth/roles"
import { getCurrentRole } from "@/lib/auth/get-role"

type EditTechnicalDocPageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditTechnicalDocPage({
                                                       params,
                                                   }: EditTechnicalDocPageProps) {
    const { id } = await params

    const role = await getCurrentRole()

    if (!canEditTechnicalDocs(role)) {
        redirect(`/technical-docs/${id}`)
    }

    const document = await getTechnicalDoc(Number(id))

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    backHref={`/technical-docs/${document.id}`}
                    backLabel="Back to document"
                    eyebrow="Technical document"
                    icon={FileText}
                    title="Edit technical document"
                    description="Update the content and technical details of this document."
                />

                <div className="mt-8">
                    <TechnicalDocForm document={document} />
                </div>
            </div>
        </div>
    )
}