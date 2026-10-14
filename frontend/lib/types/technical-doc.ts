export type TechnicalDoc = {
    id: number
    title: string
    content: string
    codeSnippet: string | null
    gitRef: string | null
    createdAt: string
    updatedAt: string
    // author of the document (the API sends the whole user; only the name is used)
    user: {
        username: string | null
    } | null
}