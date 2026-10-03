"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { serverApi } from "@/lib/api/server-api"

export type TechnicalDocFormState = {
    error?: string
}

export async function createTechnicalDoc(
    _previousState: TechnicalDocFormState,
    formData: FormData
): Promise<TechnicalDocFormState> {
    const title = formData.get("title")?.toString().trim()
    const content = formData.get("content")?.toString().trim()
    const codeSnippet = formData.get("codeSnippet")?.toString().trim()
    const gitRef = formData.get("gitRef")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!content) {
        return {
            error: "Content is required.",
        }
    }

    let technicalDoc: { id: number }

    try {
        technicalDoc = await serverApi.post<{ id: number }>(
            "/api/technical-docs",
            {
                title,
                content,
                codeSnippet: codeSnippet || null,
                gitRef: gitRef || null,
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

    revalidatePath("/technical-docs")
    revalidatePath("/dashboard")

    redirect(`/technical-docs/${technicalDoc.id}`)
}

export async function updateTechnicalDoc(
    id: number,
    _previousState: TechnicalDocFormState,
    formData: FormData
): Promise<TechnicalDocFormState> {
    const title = formData.get("title")?.toString().trim()
    const content = formData.get("content")?.toString().trim()
    const codeSnippet = formData.get("codeSnippet")?.toString().trim()
    const gitRef = formData.get("gitRef")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!content) {
        return {
            error: "Content is required.",
        }
    }

    try {
        await serverApi.put(
            `/api/technical-docs/${id}`,
            {
                title,
                content,
                codeSnippet: codeSnippet || null,
                gitRef: gitRef || null,
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

    revalidatePath("/technical-docs")
    revalidatePath(`/technical-docs/${id}`)
    revalidatePath("/dashboard")

    redirect(`/technical-docs/${id}`)
}