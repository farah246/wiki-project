"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { serverApi } from "@/lib/api/server-api"

export type CommercialDocFormState = {
    error?: string
}

export async function createCommercialDoc(
    _previousState: CommercialDocFormState,
    formData: FormData
): Promise<CommercialDocFormState> {
    const title = formData.get("title")?.toString().trim()
    const proposalText = formData.get("proposalText")?.toString().trim()
    const clientName = formData.get("clientName")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!proposalText) {
        return {
            error: "Proposal text is required.",
        }
    }

    if (!clientName) {
        return {
            error: "Client name is required.",
        }
    }

    let commercialDoc: { id: number }

    try {
        commercialDoc = await serverApi.post<{ id: number }>(
            "/api/commercial-docs",
            {
                title,
                proposalText,
                clientName,
            }
        )
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating the document.",
        }
    }

    revalidatePath("/commercial-docs")
    revalidatePath("/dashboard")

    redirect(`/commercial-docs/${commercialDoc.id}`)
}

export async function updateCommercialDoc(
    id: number,
    _previousState: CommercialDocFormState,
    formData: FormData
): Promise<CommercialDocFormState> {
    const title = formData.get("title")?.toString().trim()
    const proposalText = formData.get("proposalText")?.toString().trim()
    const clientName = formData.get("clientName")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!proposalText) {
        return {
            error: "Proposal text is required.",
        }
    }

    if (!clientName) {
        return {
            error: "Client name is required.",
        }
    }

    try {
        await serverApi.put(
            `/api/commercial-docs/${id}`,
            {
                title,
                proposalText,
                clientName,
            }
        )
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while updating the document.",
        }
    }

    revalidatePath("/commercial-docs")
    revalidatePath(`/commercial-docs/${id}`)
    revalidatePath("/dashboard")

    redirect(`/commercial-docs/${id}`)
}

export async function deleteCommercialDoc(id: number) {
    try {
        await serverApi.delete(`/api/commercial-docs/${id}`)
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Something went wrong while deleting the document."
        )
    }

    revalidatePath("/commercial-docs")
    revalidatePath("/dashboard")
}

