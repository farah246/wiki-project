"use server"

import { revalidatePath } from "next/cache"

import { serverApi } from "@/lib/api/server-api"
import { FAVORITE_DOC_TYPES } from "@/lib/favorites"
import type { FavoriteDocType } from "@/lib/types/favorite"
import { DOC_PATHS } from "@/lib/types/activity"

export type SetFavoriteResult = {
    error?: string
}

export async function setFavorite(
    docType: FavoriteDocType,
    docId: number,
    favorite: boolean
): Promise<SetFavoriteResult> {
    if (
        !FAVORITE_DOC_TYPES.includes(docType) ||
        !Number.isInteger(docId) ||
        docId <= 0
    ) {
        return { error: "This document cannot be starred." }
    }

    const endpoint = `/api/favorites/${docType}/${docId}`

    try {
        if (favorite) {
            await serverApi.put(endpoint, undefined)
        } else {
            await serverApi.delete(endpoint)
        }
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while updating your favorites.",
        }
    }

    const basePath = DOC_PATHS[docType]

    revalidatePath(basePath)
    revalidatePath(`${basePath}/${docId}`)
    revalidatePath("/favorites")

    return {}
}