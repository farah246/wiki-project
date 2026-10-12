"use client"

import { FileCog } from "lucide-react"

import { deleteProcedure } from "@/actions/procedures"
import { DocumentList } from "@/components/documents/document-list"
import type { Procedure } from "@/lib/types/procedure"
import {
    canDeleteProcedures,
    canEditProcedures,
} from "@/lib/auth/roles"
import { useCurrentRole } from "@/lib/auth/use-role"

type ProcedureListProps = {
    procedures: Procedure[]
}

export function ProcedureList({ procedures }: ProcedureListProps) {
    const role = useCurrentRole()

    return (
        <DocumentList
            items={procedures}
            basePath="/procedures"
            icon={FileCog}
            searchPlaceholder="Search procedures..."
            emptyTitle="No procedures"
            emptyMessage="Create your first procedure to get started."
            noMatchTitle="No matching procedures"
            deleteTitle="Delete procedure?"
            getDescription={(procedure) => procedure.description}
            getSearchText={(procedure) => [
                procedure.title,
                procedure.description,
                procedure.visualModel,
            ]}
            canEdit={canEditProcedures(role)}
            canDelete={canDeleteProcedures(role)}
            onDelete={deleteProcedure}
        />
    )
}