"use client"

import { startTransition, useOptimistic, useState } from "react"
import Link from "next/link"
import { Pencil, Trash2, type LucideIcon } from "lucide-react"

import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog"
import { SearchBar } from "@/components/ui/search-bar"

// Shared list for every document type. The type-specific lists
// (technical docs, commercial docs, procedures) only describe what differs:
// the base path, the texts, which fields to show and which to search.
type DocumentListProps<T extends { id: number; title: string }> = {
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

export function DocumentList<T extends { id: number; title: string }>({
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
                <SearchBar
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={setSearchQuery}
                />

                {filteredItems.length === 0 ? (
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
                    <div className="space-y-4">
                        {filteredItems.map((item) => (
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