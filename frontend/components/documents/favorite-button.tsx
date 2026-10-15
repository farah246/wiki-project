"use client"

import { useOptimistic, useState, useTransition } from "react"
import { Star } from "lucide-react"

import { setFavorite } from "@/actions/favorites"
import type { FavoriteDocType } from "@/lib/types/favorite"

type FavoriteButtonProps = {
    docType: FavoriteDocType
    docId: number
    isFavorite: boolean
    // "icon": star only (lists). "labeled": star + text (document page header)
    variant?: "icon" | "labeled"
}

export function FavoriteButton({
                                   docType,
                                   docId,
                                   isFavorite,
                                   variant = "icon",
                               }: FavoriteButtonProps) {
    const [optimistic, setOptimistic] = useOptimistic(isFavorite)
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const label = optimistic ? "Remove from favorites" : "Add to favorites"

    const handleClick = () => {
        const next = !optimistic
        setError(null)

        startTransition(async () => {
            setOptimistic(next)

            const result = await setFavorite(docType, docId, next)

            // On error the optimistic value falls back to the real one by itself
            if (result.error) setError(result.error)
        })
    }

    const size =
        variant === "labeled"
            ? "gap-2 px-4 py-2.5 text-sm font-medium"
            : "h-9 w-9 justify-center"

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            aria-pressed={optimistic}
            aria-label={label}
            title={error ?? label}
            className={`inline-flex shrink-0 items-center rounded-lg border transition hover:bg-muted disabled:opacity-70 ${size} ${
                error ? "border-red-300 text-red-600" : ""
            }`}
        >
            <Star
                className={`h-4 w-4 ${
                    optimistic ? "fill-amber-400 text-amber-500" : "text-muted-foreground"
                }`}
            />
            {variant === "labeled" && (optimistic ? "Favorited" : "Favorite")}
        </button>
    )
}