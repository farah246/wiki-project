import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { CommercialDocForm } from "@/components/forms/commercial-doc-form"
import { canCreateCommercialDocs } from "@/lib/auth/roles"

export default async function NewCommercialDocPage() {
    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    if (!canCreateCommercialDocs(role)) {
        redirect("/commercial-docs")
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        New commercial document
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Create a new piece of commercial knowledge.
                    </p>
                </div>

                <CommercialDocForm />
            </div>
        </div>
    )
}