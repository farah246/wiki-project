export type FavoriteDocType = "TECHNICAL_DOC" | "COMMERCIAL_DOC" | "PROCEDURE"

export type Favorite = {
    docType: FavoriteDocType
    docId: number
    createdAt: string
}