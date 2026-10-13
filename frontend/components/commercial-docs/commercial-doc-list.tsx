"use client"

import { FileText } from "lucide-react"

import { deleteCommercialDoc } from "@/actions/commercial-doc"
import { DocumentList } from "@/components/documents/document-list"
import type { CommercialDoc } from "@/lib/types/commercial-doc"
import {
    canDeleteCommercialDocs,
    canEditCommercialDocs,
} from "@/lib/auth/roles"
import { useCurrentRole } from "@/lib/auth/use-role"
import { toPlainText } from "@/lib/markdown"
type CommercialDocListProps = {
    documents: CommercialDoc[]
}

export function CommercialDocList({ documents }: CommercialDocListProps) {
    const role = useCurrentRole()

    return (
        <DocumentList
            items={documents}
            basePath="/commercial-docs"
            icon={FileText}
            searchPlaceholder="Search commercial documents..."
            emptyTitle="No commercial documents"
            emptyMessage="Create your first commercial document to get started."
            noMatchTitle="No matching documents"
            deleteTitle="Delete commercial document?"
            getSubtitle={(doc) => doc.clientName}
            getDescription={(doc) => toPlainText(doc.proposalText)}
            getSearchText={(doc) => [
                doc.title,
                doc.proposalText,
                doc.clientName,
            ]}
            canEdit={canEditCommercialDocs(role)}
            canDelete={canDeleteCommercialDocs(role)}
            onDelete={deleteCommercialDoc}
        />
    )
}