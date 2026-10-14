import { FileText } from "lucide-react"
import { redirect } from "next/navigation"

import { TechnicalDocForm } from "@/components/forms/technical-doc-form"
import { PageHeader } from "@/components/ui/page-header"
import { canCreateTechnicalDocs } from "@/lib/auth/roles"
import { getCurrentRole } from "@/lib/auth/get-role"

export default async function NewTechnicalDocPage() {
    const role = await getCurrentRole()

    if (!canCreateTechnicalDocs(role)) {
        redirect("/technical-docs")
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    backHref="/technical-docs"
                    backLabel="Back to technical documents"
                    eyebrow="Technical document"
                    icon={FileText}
                    title="Create a technical document"
                    description="Add technical knowledge to your team's workspace."
                />

                <div className="mt-8">
                    <TechnicalDocForm />
                </div>
            </div>
        </div>
    )
}