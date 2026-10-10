import { History } from "lucide-react"

import type { DocHistoryEntry } from "@/lib/types/doc-history"

type DocHistoryProps = {
    entries: DocHistoryEntry[]
}

export function DocHistory({ entries }: DocHistoryProps) {
    return (
        <section className="rounded-2xl border bg-card">
            <div className="flex items-center gap-2 border-b px-6 py-4">
                <History className="h-4 w-4 text-violet-600" />
                <h2 className="font-semibold">History</h2>
            </div>

            {entries.length === 0 ? (
                <p className="px-6 py-6 text-sm text-muted-foreground">
                    No changes recorded yet.
                </p>
            ) : (
                <ol className="divide-y">
                    {entries.map((entry) => (
                        <li
                            key={entry.id}
                            className="flex items-start gap-4 px-6 py-4"
                        >
                            <span className="mt-0.5 w-10 shrink-0 text-xs font-medium text-violet-600">
                                {entry.docVersion ? `v${entry.docVersion}` : ""}
                            </span>

                            <div className="min-w-0">
                                <p className="text-sm">{entry.change}</p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {entry.user?.username ?? "Unknown user"}
                                    {" · "}
                                    {new Date(entry.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    )
}