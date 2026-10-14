import Link from "next/link"
import { auth } from "@clerk/nextjs/server"

import { PageHeader } from "@/components/ui/page-header"
import { getActivity } from "@/lib/api/activity"
import { getUsers } from "@/lib/api/users"
import { normalizeRole } from "@/lib/auth/roles"
import { formatDateTime } from "@/lib/format"
import { ACTIVITY_ACTIONS, DOC_PATHS } from "@/lib/types/activity"

const badge: Record<string, string> = {
    CREATED: "bg-emerald-500/10 text-emerald-600",
    UPDATED: "bg-blue-500/10 text-blue-600",
    RESTORED: "bg-violet-500/10 text-violet-600",
    DELETED: "bg-red-500/10 text-red-600",
}

const chip = "rounded-lg border px-3 py-1.5 text-sm transition hover:bg-muted"

export default async function ActivityPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<{
        page?: string
        action?: string
        scope?: string
        user?: string
    }>
}) {
    const { sessionClaims } = await auth()
    const isAdmin = normalizeRole(sessionClaims?.metadata?.role) === "ADMIN"

    const params = await searchParams
    const page = Math.max(Number.parseInt(params.page ?? "0", 10) || 0, 0)
    const action = ACTIVITY_ACTIONS.find((a) => a === params.action)
    // Only admins can see everyone's activity; everybody else sees their own
    const scope = isAdmin && params.scope !== "me" ? "all" : "me"

    // The user list is only needed (and only allowed) in the admin "everyone" view
    const users = scope === "all" ? await getUsers() : []
    const requestedUser = Number.parseInt(params.user ?? "", 10)
    // An unknown or tampered id is ignored
    const userId = users.some((u) => u.id === requestedUser)
        ? requestedUser
        : undefined

    const data = await getActivity(page, action, scope, userId)

    const href = (p: number, a?: string, withUser = true) => {
        const query = new URLSearchParams()
        if (a) query.set("action", a)
        if (isAdmin && scope === "me") query.set("scope", "me")
        if (withUser && userId) query.set("user", String(userId))
        if (p > 0) query.set("page", String(p))
        const text = query.toString()
        return `/activity${text ? `?${text}` : ""}`
    }

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
                <PageHeader
                    title={scope === "all" ? "Activity" : "My activity"}
                    description={
                        scope === "all"
                            ? "Everything that happened on the documents, newest first."
                            : "What you created, edited, restored or deleted, newest first."
                    }
                />

                {isAdmin && (
                    <div className="mt-6 flex gap-2">
                        <Link
                            href="/activity"
                            className={`${chip} ${scope === "all" ? "bg-muted font-medium" : ""}`}
                        >
                            Everyone
                        </Link>
                        <Link
                            href="/activity?scope=me"
                            className={`${chip} ${scope === "me" ? "bg-muted font-medium" : ""}`}
                        >
                            Only me
                        </Link>
                    </div>
                )}

                {/* Filter by user (admins, "Everyone" view only) */}
                {scope === "all" && (
                    <form
                        action="/activity"
                        className="mt-6 flex flex-wrap items-center gap-2"
                    >
                        {action && (
                            <input type="hidden" name="action" value={action} />
                        )}

                        <select
                            name="user"
                            defaultValue={userId ?? ""}
                            aria-label="Filter by user"
                            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-violet-400"
                        >
                            <option value="">All users</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.username ?? u.email}
                                </option>
                            ))}
                        </select>

                        <button type="submit" className={chip}>
                            Filter
                        </button>

                        {userId && (
                            <Link href={href(0, action, false)} className={chip}>
                                Clear
                            </Link>
                        )}
                    </form>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                    <Link
                        href={href(0)}
                        className={`${chip} ${!action ? "bg-muted font-medium" : ""}`}
                    >
                        All
                    </Link>
                    {ACTIVITY_ACTIONS.map((a) => (
                        <Link
                            key={a}
                            href={href(0, a)}
                            className={`${chip} ${action === a ? "bg-muted font-medium" : ""}`}
                        >
                            {a.charAt(0) + a.slice(1).toLowerCase()}
                        </Link>
                    ))}
                </div>

                <section className="mt-6 rounded-2xl border bg-card">
                    {data.items.length === 0 ? (
                        <p className="px-5 py-8 text-sm text-muted-foreground">
                            No activity yet.
                        </p>
                    ) : (
                        <ul className="divide-y">
                            {data.items.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex flex-wrap items-start justify-between gap-3 px-5 py-4"
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`rounded-md px-2 py-0.5 text-xs font-medium ${badge[item.action] ?? "bg-muted"}`}
                                            >
                                                {item.action}
                                            </span>

                                            {item.docType && item.docId ? (
                                                <Link
                                                    href={`${DOC_PATHS[item.docType]}/${item.docId}`}
                                                    className="truncate font-medium hover:underline"
                                                >
                                                    {item.docTitle}
                                                </Link>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">
                                                    Document no longer exists
                                                </span>
                                            )}

                                            {item.docVersion ? (
                                                <span className="text-xs text-muted-foreground">
                                                    v{item.docVersion}
                                                </span>
                                            ) : null}
                                        </div>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {item.change}
                                        </p>
                                    </div>

                                    <div className="text-right text-xs text-muted-foreground">
                                        <div>{item.username ?? item.email ?? "Unknown user"}</div>
                                        <div>{formatDateTime(item.createdAt)}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {data.totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between text-sm">
                        {page > 0 ? (
                            <Link href={href(page - 1, action)} className={chip}>
                                Previous
                            </Link>
                        ) : (
                            <span />
                        )}

                        <span className="text-muted-foreground">
                            Page {data.page + 1} of {data.totalPages} · {data.total} entries
                        </span>

                        {page + 1 < data.totalPages ? (
                            <Link href={href(page + 1, action)} className={chip}>
                                Next
                            </Link>
                        ) : (
                            <span />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}