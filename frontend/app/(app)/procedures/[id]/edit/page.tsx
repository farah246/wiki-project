import { notFound } from "next/navigation"

import { getProcedure } from "@/lib/api/procedures"
import { ProcedureForm } from "@/components/forms/procedure-form"

type EditProcedurePageProps = {
    params: Promise<{
        id: string
    }>
}

export default async function EditProcedurePage({
                                                    params,
                                                }: EditProcedurePageProps) {
    const { id } = await params
    const procedureId = Number(id)

    if (Number.isNaN(procedureId)) {
        notFound()
    }

    let procedure

    try {
        procedure = await getProcedure(procedureId)
    } catch {
        notFound()
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Edit procedure
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Update the procedure information and visual model.
                    </p>
                </div>

                <ProcedureForm procedure={procedure} />
            </div>
        </div>
    )
}