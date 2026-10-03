"use client"

import { AlertTriangle, X } from "lucide-react"

type DeleteConfirmationDialogProps = {
    open: boolean
    title?: string
    description?: string
    onCancel: () => void
    onConfirm: () => void
}

export function DeleteConfirmationDialog({
                                             open,
                                             title = "Delete this document?",
                                             description = "This action cannot be undone. The document and its associated data will be permanently deleted.",
                                             onCancel,
                                             onConfirm,
                                         }: DeleteConfirmationDialogProps) {
    if (!open) {
        return null
    }

return (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
    >
        <div className="relative w-full max-w-md rounded-2xl border bg-background p-6 shadow-xl">
            <button
                type="button"
                onClick={onCancel}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>

            <div className="mt-4">
                <h2
                    id="delete-dialog-title"
                    className="text-lg font-semibold"
                >
                    {title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
)

}
