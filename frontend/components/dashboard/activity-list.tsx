import Link from "next/link"

import { formatRelativeTime } from "@/lib/format"
import { DOC_PATHS, type ActivityEntry } from "@/lib/types/activity"
import { cn } from "@/lib/utils"

const actions: Record<string, { label: string; dot: string }> = {
    CREATED: { label: "Created", dot: "bg-emerald-500" },
    UPDATED: { label: "Updated", dot: "bg-blue-500" },
    RESTORED: { label: "Restored", dot: "bg-violet-500" },
    DELETED: { label: "Deleted", dot: "bg-red-500" },
}

const unknownAction = { label: "Changed", dot: "bg-muted-foreground" }

const rowClassName = "flex items-start gap-3 px-6 py-4"

function ActivityRow({
                         entry,
                         showUser,
                     }: {
    entry: ActivityEntry
    showUser: boolean
}) {
    const { label, dot } = actions[entry.action] ?? unknownAction

    // A deleted document has no page to open
    const href =
        entry.docType && entry.docId
            ? `${DOC_PATHS[entry.docType]}/${entry.docId}`
            : null

    const author = showUser ? (entry.username ?? entry.email) : null
    const detail = [label, author].filter(Boolean).join(" · ")

    const content = (
        <>
            <span
                aria-hidden="true"
                className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dot)}
            />

            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                    {entry.docTitle ?? "Document no longer exists"}
                </span>

                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {detail}
                </span>
            </span>

            <time
                dateTime={entry.createdAt}
                className="shrink-0 text-xs text-muted-foreground"
            >
                {formatRelativeTime(entry.createdAt)}
            </time>
        </>
    )

    return href ? (
        <Link
            href={href}
            className={cn(rowClassName, "transition hover:bg-muted/40")}
        >
            {content}
        </Link>
    ) : (
        <div className={rowClassName}>{content}</div>
    )
}

type ActivityListProps = {
    entries: ActivityEntry[]
    // Admins see everyone's activity, so each row names its author
    showUser: boolean
}

export function ActivityList({ entries, showUser }: ActivityListProps) {
    if (entries.length === 0) {
        return (
            <p className="px-6 py-14 text-center text-sm text-muted-foreground">
                No activity yet.
            </p>
        )
    }

    return (
        <>
            <ul className="divide-y">
                {entries.map((entry) => (
                    <li key={entry.id}>
                        <ActivityRow entry={entry} showUser={showUser} />
                    </li>
                ))}
            </ul>

            <div className="border-t px-6 py-4 text-right">
                <Link
                    href="/activity"
                    className="text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                    View all activity
                </Link>
            </div>
        </>
    )
}