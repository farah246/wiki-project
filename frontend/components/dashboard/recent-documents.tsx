import { FileText } from "lucide-react"

import { SectionCard } from "@/components/dashboard/section-card"
import { DocumentCard } from "@/components/documents/document-card"
import type { RecentDocument } from "@/lib/recent-documents"

export function RecentDocuments({
                                    documents,
                                }: {
    documents: RecentDocument[]
}) {
    return (
        <SectionCard
            kicker="Keep moving"
            title="Recent documents"
            description="Latest activity across your workspace"
        >
            {documents.length > 0 ? (
                <div className="divide-y">
                    {documents.map((doc) => (
                        <DocumentCard
                            key={doc.key}
                            title={doc.title}
                            description={doc.description}
                            type={doc.type}
                            href={doc.href}
                        />
                    ))}
                </div>
            ) : (
                <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-4 font-medium">No documents yet</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Documents will appear here as your team creates them.
                    </p>
                </div>
            )}
        </SectionCard>
    )
}