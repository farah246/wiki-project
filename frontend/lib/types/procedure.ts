export type Procedure = {
    id: number
    title: string
    description: string
    visualModel: string | null
    createdAt: string
    updatedAt: string
    // author of the document (the API sends the whole user; only the name is used)
    user: {
        username: string | null
    } | null
}