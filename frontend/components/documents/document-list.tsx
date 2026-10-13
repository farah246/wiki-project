"use client"

import { startTransition, useOptimistic, useState } from "react"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Pencil,
    Trash2,
    type LucideIcon,
} from "lucide-react"

import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { SearchBar } from "@/components/ui/search-bar"

// Shared list for every document type. The type-specific lists
// (technical docs, commercial docs, procedures) only describe what differs:
// the base path, the texts, which fields to show and which to search.
type ListItem = {
    id: number
    title: string
    createdAt: string
    updatedAt: string
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

type SortKey = "updated" | "created" | "title-asc" | "title-desc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "updated", label: "Recently updated" },
    { value: "created", label: "Newest first" },
    { value: "title-asc", label: "Title A–Z" },
    { value: "title-desc", label: "Title Z–A" },
]

const PAGE_SIZE = 10

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

// Fixed locale and time zone so the server and the browser render the same text
function formatDate(value: string | null | undefined) {
    if (!value) return ""

    const time = Date.parse(value)

    if (Number.isNaN(time)) return ""

    return new Date(time).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })
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
    const [searchQuery, setSearchQuery] = useState("")
    const [sort, setSort] = useState<SortKey>("updated")
    const [page, setPage] = useState(1)

    const [optimisticItems, removeOptimistically] = useOptimistic(
        items,
        (currentItems, itemId: number) =>
            currentItems.filter((item) => item.id !== itemId)
    )

    const [itemToDelete, setItemToDelete] = useState<T | null>(null)

    const query = searchQuery.toLowerCase().trim()

    const filteredItems = optimisticItems.filter((item) => {
        if (!query) {
            return true
        }

        return getSearchText(item).some((text) =>
            text?.toLowerCase().includes(query)
        )
    })

    const sortedItems = [...filteredItems].sort((a, b) =>
        compareItems(a, b, sort)
    )

    const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE))

    // Clamp, so deleting the last item of a page never leaves an empty page
    const currentPage = Math.min(page, totalPages)

    const pageItems = sortedItems.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        setPage(1)
    }

    const handleSortChange = (value: SortKey) => {
        setSort(value)
        setPage(1)
    }

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
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />

                    <select
                        value={sort}
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
                            {searchQuery ? noMatchTitle : emptyTitle}
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try a different search term."
                                : emptyMessage}
                        </p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {sortedItems.length}{" "}
                            {sortedItems.length === 1 ? "result" : "results"}
                        </p>

                        <div className="space-y-4">
                            {pageItems.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <Link
                                                href={`${basePath}/${item.id}`}
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

                                            {formatDate(item.updatedAt) && (
                                                <p className="mt-3 text-xs text-muted-foreground">
                                                    Updated {formatDate(item.updatedAt)}
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
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav
                                aria-label="Pagination"
                                className="flex items-center justify-between gap-4"
                            >
                                <button
                                    type="button"
                                    onClick={() => setPage(currentPage - 1)}
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
                                    onClick={() => setPage(currentPage + 1)}
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