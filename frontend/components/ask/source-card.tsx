import Link from "next/link"
import { BriefcaseBusiness, ClipboardList, FileText } from "lucide-react"

import type { AskSource, DocumentType } from "@/lib/ask"
import { cn } from "@/lib/utils"

// Same colours and routes as the dashboard search results
const TYPE_CONFIG = {
    TECHNICAL: {
        label: "Technical",
        hrefPrefix: "/technical-docs",
        Icon: FileText,
        iconClassName: "bg-violet-50 text-violet-600 dark:bg-violet-950/30",
    },
    COMMERCIAL: {
        label: "Commercial",
        hrefPrefix: "/commercial-docs",
        Icon: BriefcaseBusiness,
        iconClassName: "bg-sky-50 text-sky-600 dark:bg-sky-950/30",
    },
    PROCEDURE: {
        label: "Procedure",
        hrefPrefix: "/procedures",
        Icon: ClipboardList,
        iconClassName: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30",
    },
} satisfies Record<DocumentType, unknown>

type SourceCardProps = {
    // DOM id, so a citation chip can scroll to this card
    id: string
    source: AskSource
    // the question, passed as ?q= so the document page highlights its words
    question: string
    active: boolean
    // called when the document is opened (the panel closes itself on small screens)
    onOpen?: () => void
}

export function SourceCard({
                               id,
                               source,
                               question,
                               active,
                               onOpen,
                           }: SourceCardProps) {
    const config = TYPE_CONFIG[source.documentType] ?? TYPE_CONFIG.TECHNICAL
    const Icon = config.Icon

    return (
        <Link
            id={id}
            href={`${config.hrefPrefix}/${source.documentId}?q=${encodeURIComponent(question)}`}
            // same tab: the conversation lives in the layout, so it is still
            // there after the document opens
            onClick={onOpen}
            className={cn(
                "flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5 transition hover:bg-muted/50",
                active && "border-violet-400 ring-2 ring-violet-100 dark:ring-violet-950"
            )}
        >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-100 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                {source.number}
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{source.title}</p>

                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {source.excerpt}
                </p>
            </div>

            <span
                className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    config.iconClassName
                )}
                title={config.label}
            >
                <Icon className="h-3.5 w-3.5" />
                <span className="sr-only">{config.label}</span>
            </span>
        </Link>
    )
}