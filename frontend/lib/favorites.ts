import type { Favorite, FavoriteDocType } from "@/lib/types/favorite"

export const FAVORITE_DOC_TYPES: FavoriteDocType[] = [
    "TECHNICAL_DOC",
    "COMMERCIAL_DOC",
    "PROCEDURE",
]

export function favoriteIdsOf(favorites: Favorite[], docType: FavoriteDocType) {
    return favorites
        .filter((favorite) => favorite.docType === docType)
        .map((favorite) => favorite.docId)
}

export function isFavorite(
    favorites: Favorite[],
    docType: FavoriteDocType,
    docId: number
) {
    return favorites.some(
        (favorite) => favorite.docType === docType && favorite.docId === docId
    )
}