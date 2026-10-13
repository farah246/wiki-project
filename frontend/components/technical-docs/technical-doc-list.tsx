"use client"

import { FileText } from "lucide-react"

import { deleteTechnicalDoc } from "@/actions/technical-docs"
import { DocumentList } from "@/components/documents/document-list"
import type { TechnicalDoc } from "@/lib/types/technical-doc"
import {
    canDeleteTechnicalDocs,
    canEditTechnicalDocs,
} from "@/lib/auth/roles"
import { useCurrentRole } from "@/lib/auth/use-role"
import { toPlainText } from "@/lib/markdown"
type TechnicalDocListProps = {
    documents: TechnicalDoc[]
}

export function TechnicalDocList({ documents }: TechnicalDocListProps) {
    const role = useCurrentRole()

    return (
        <DocumentList
            items={documents}
            basePath="/technical-docs"
            icon={FileText}
            searchPlaceholder="Search technical documents..."
            emptyTitle="No technical documents"
            emptyMessage="Create your first technical document to get started."
            noMatchTitle="No matching documents"
            deleteTitle="Delete technical document?"
            getDescription={(doc) => toPlainText(doc.content)}
            getSearchText={(doc) => [
                doc.title,
                doc.content,
                doc.codeSnippet,
                doc.gitRef,
            ]}
            canEdit={canEditTechnicalDocs(role)}
            canDelete={canDeleteTechnicalDocs(role)}
            onDelete={deleteTechnicalDoc}
        />
    )
}