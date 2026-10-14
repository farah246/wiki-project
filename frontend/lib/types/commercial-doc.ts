export type CommercialDoc = {
    id: number
    title: string
    proposalText: string
    clientName: string
    createdAt: string
    updatedAt: string
    // author of the document (the API sends the whole user; only the name is used)
    user: {
        username: string | null
    } | null
}