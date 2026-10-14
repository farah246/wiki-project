"use client"

import {
    startTransition,
    useEffect,
    useOptimistic,
    useState,
} from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    type LucideIcon,
} from "lucide-react"

import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { SearchBar } from "@/components/ui/search-bar"
import { formatByline } from "@/lib/format"
import {
    listViewToQuery,
    mergeListQuery,
    readListView,
    type ListView,
    type SortKey,
} from "@/lib/list-view"

// Shared list for every document type. The type-specific lists
// (technical docs, commercial docs, procedures) only describe what differs:
// the base path, the texts, which fields to show and which to search.
type ListItem = {
    id: number
    title: string
    createdAt: string
    updatedAt: string
    user?: { username: string | null } | null
}

type DocumentListProps<T extends ListItem> = {
    items: T[]
    basePath: string
    icon: LucideIcon

    searchPlaceholder: string
    emptyTitle: string
    emptyMessage: string
    noMatchTitle: string
    deleteTitle: string

    getSubtitle?: (item: T) => string
    getDescription: (item: T) => string
    getSearchText: (item: T) => Array<string | null | undefined>

    canEdit: boolean
    canDelete: boolean
    onDelete: (id: number) => Promise<void>
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "updated", label: "Recently updated" },
    { value: "created", label: "Newest first" },
    { value: "title-asc", label: "Title A–Z" },
    { value: "title-desc", label: "Title Z–A" },
]

const PAGE_SIZE = 10

// How long the URL waits after the last change. Filtering the list itself is
// instant; only the address bar is debounced (browsers limit how often
// history.replaceState may be called).
const URL_DELAY_MS = 300

function timestamp(value: string | null | undefined) {
    const time = value ? Date.parse(value) : NaN
    return Number.isNaN(time) ? 0 : time
}

function compareItems(a: ListItem, b: ListItem, sort: SortKey) {
    switch (sort) {
        case "created":
            return timestamp(b.createdAt) - timestamp(a.createdAt)
        case "title-asc":
            return a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
        case "title-desc":
            return b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
        default:
            return timestamp(b.updatedAt) - timestamp(a.updatedAt)
    }
}

export function DocumentList<T extends ListItem>({
                                                     items,
                                                     basePath,
                                                     icon: Icon,
                                                     searchPlaceholder,
                                                     emptyTitle,
                                                     emptyMessage,
                                                     noMatchTitle,
                                                     deleteTitle,
                                                     getSubtitle,
                                                     getDescription,
                                                     getSearchText,
                                                     canEdit,
                                                     canDelete,
                                                     onDelete,
                                                 }: DocumentListProps<T>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // What the address bar says right now (only our own parameters, normalised)
    const urlQuery = listViewToQuery(readListView(searchParams))

    // The screen is driven by local state, so typing and sorting never wait for
    // the router. The URL is a mirror of it, written after a short delay.
    const [view, setView] = useState<ListView>(() => readListView(searchParams))
    const [seenUrlQuery, setSeenUrlQuery] = useState(urlQuery)
    const [writtenQuery, setWrittenQuery] = useState(urlQuery)

    // The URL changed. If it was not us who wrote it (a link to this page with
    // another filter, or without one), show what the URL says.
    if (urlQuery !== seenUrlQuery) {
        setSeenUrlQuery(urlQuery)

        if (urlQuery !== writtenQuery) {
            setView(readListView(searchParams))
            setWrittenQuery(urlQuery)
        }
    }

    const viewQuery = listViewToQuery(view)

    useEffect(() => {
        if (viewQuery === urlQuery) return

        const timer = setTimeout(() => {
            const query = mergeListQuery(window.location.search, view)

            // Next.js syncs history.replaceState with the router, without a
            // server round trip and without adding a history entry
            window.history.replaceState(
                null,
                "",
                query ? `${pathname}?${query}` : pathname
            )

            setWrittenQuery(viewQuery)
        }, URL_DELAY_MS)

        return () => clearTimeout(timer)
    }, [view, viewQuery, urlQuery, pathname])

    const [optimisticItems, removeOptimistically] = useOptimistic(
        items,
        (currentItems, itemId: number) =>
            currentItems.filter((item) => item.id !== itemId)
    )

    const [itemToDelete, setItemToDelete] = useState<T | null>(null)

    const query = view.filter.toLowerCase().trim()

    const filteredItems = optimisticItems.filter((item) => {
        if (!query) {
            return true
        }

        return getSearchText(item).some((text) =>
            text?.toLowerCase().includes(query)
        )
    })

    const sortedItems = [...filteredItems].sort((a, b) =>
        compareItems(a, b, view.sort)
    )

    const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE))

    // Clamp, so deleting the last item of a page never leaves an empty page
    const currentPage = Math.min(view.page, totalPages)

    const pageItems = sortedItems.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    // A new filter or sort always starts on the first page
    const handleSearchChange = (value: string) => {
        setView((current) => ({ ...current, filter: value, page: 1 }))
    }

    const handleSortChange = (value: SortKey) => {
        setView((current) => ({ ...current, sort: value, page: 1 }))
    }

    const goToPage = (page: number) => {
        setView((current) => ({ ...current, page }))
    }

    // Documents opened from a filtered list highlight the same words
    const linkTo = (id: number) =>
        query
            ? `${basePath}/${id}?q=${encodeURIComponent(view.filter.trim())}`
            : `${basePath}/${id}`

    const deleteItem = async (itemId: number) => {
        startTransition(() => {
            removeOptimistically(itemId)
        })

        setItemToDelete(null)

        await onDelete(itemId)
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <SearchBar
                        placeholder={searchPlaceholder}
                        value={view.filter}
                        onChange={handleSearchChange}
                    />

                    <select
                        value={view.sort}
                        onChange={(event) =>
                            handleSortChange(event.target.value as SortKey)
                        }
                        aria-label="Sort documents"
                        className="h-12 shrink-0 rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-950"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {sortedItems.length === 0 ? (
                    <div className="rounded-2xl border bg-card px-6 py-12 text-center">
                        <Icon className="mx-auto h-10 w-10 text-muted-foreground" />

                        <h2 className="mt-4 text-lg font-semibold">
                            {query ? noMatchTitle : emptyTitle}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {query
                                ? "Try a different search term."
                                : emptyMessage}
                        </p>
                    </div>
                ) : (
                    <>
                        <p
                            className="text-sm text-muted-foreground"
                            aria-live="polite"
                        >
                            {query
                                ? `${sortedItems.length} of ${optimisticItems.length} `
                                : `${sortedItems.length} `}
                            {(query ? optimisticItems.length : sortedItems.length) === 1
                                ? "result"
                                : "results"}
                        </p>

                        <div className="space-y-4">
                            {pageItems.map((item) => {
                                const byline = formatByline(
                                    item.user?.username,
                                    item.updatedAt
                                )

                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <Link
                                                    href={linkTo(item.id)}
                                                    className="text-lg font-semibold tracking-tight hover:text-violet-600"
                                                >
                                                    {item.title}
                                                </Link>

                                                {getSubtitle && (
                                                    <p className="mt-2 text-sm font-medium text-muted-foreground">
                                                        {getSubtitle(item)}
                                                    </p>
                                                )}

                                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                                    {getDescription(item)}
                                                </p>

                                                {byline && (
                                                    <p className="mt-3 text-xs text-muted-foreground">
                                                        {byline}
                                                    </p>
                                                )}
                                            </div>

                                            <Icon className="h-5 w-5 shrink-0 text-violet-600" />
                                        </div>

                                        {(canEdit || canDelete) && (
                                            <div className="mt-5 flex items-center gap-2">
                                                {canEdit && (
                                                    <Link
                                                        href={`${basePath}/${item.id}/edit`}
                                                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                )}

                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setItemToDelete(item)}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </article>
                                )
                            })}
                        </div>

                        {totalPages > 1 && (
                            <nav
                                aria-label="Pagination"
                                className="flex items-center justify-between gap-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </button>

                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>

            <DeleteConfirmationDialog
                open={Boolean(itemToDelete)}
                title={deleteTitle}
                description={
                    itemToDelete
                        ? `Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.`
                        : undefined
                }
                onCancel={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) {
                        deleteItem(itemToDelete.id)
                    }
                }}
            />
        </>
    )
}