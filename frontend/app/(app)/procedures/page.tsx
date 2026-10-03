import Link from "next/link"
import { Plus } from "lucide-react"

import { getProcedures } from "@/lib/api/procedures"
import { ProcedureList } from "@/components/procedures/procedure-list"

export default async function ProceduresPage() {
    const procedures = await getProcedures()

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Procedures
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Browse and manage your team's procedures.
                        </p>
                    </div>

                    <Link
                        href="/procedures/new"
                        className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                    >
                        <Plus className="h-4 w-4" />
                        New procedure
                    </Link>
                </div>

                <div className="mt-8 space-y-6">

                    <ProcedureList procedures={procedures} />
                </div>
            </div>
        </div>
    )
}