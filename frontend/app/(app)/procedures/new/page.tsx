import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { ProcedureForm } from "@/components/forms/procedure-form"
import { canCreateProcedures } from "@/lib/auth/roles"

export default async function NewProcedurePage() {
    const { sessionClaims } = await auth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    if (!canCreateProcedures(role)) {
        redirect("/procedures")
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        New procedure
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Create a new procedure for your team's knowledge base.
                    </p>
                </div>

                <ProcedureForm />
            </div>
        </div>
    )
}