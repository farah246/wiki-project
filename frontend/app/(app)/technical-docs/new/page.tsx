import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"

import { TechnicalDocForm } from "@/components/forms/technical-doc-form"

export default function NewTechnicalDocPage() {
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
                <div className="mt-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                        <FileText className="h-4 w-4" />
                        <span>Technical document</span>
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                        Create a technical document
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Add technical knowledge to your team's workspace.
                    </p>
                </div>

                {/* Form */}
                <div className="mt-8">
                    <TechnicalDocForm />
                </div>
            </div>
        </div>
    )
}