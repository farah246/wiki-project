import { ProcedureForm } from "@/components/forms/procedure-form"

export default function NewProcedurePage() {
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