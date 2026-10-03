"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

import { serverApi } from "@/lib/api/server-api"

export type ProcedureFormState = {
    error?: string

}

export async function createProcedure(
    _previousState: ProcedureFormState,
    formData: FormData
): Promise<ProcedureFormState> {
    const title = formData.get("title")?.toString().trim()
    const description = formData.get("description")?.toString().trim()
    const visualModel = formData.get("visualModel")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!description) {
        return {
            error: "Description is required.",
        }
    }

    let procedure: { id: number }

    try {
        procedure = await serverApi.post<{ id: number }>(
            "/api/procedures",
            {
                title,
                description,
                visualModel: visualModel || null,
            }
        )
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while creating the procedure.",
        }
    }

    revalidatePath("/procedures")
    revalidatePath("/dashboard")

    redirect(`/procedures/${procedure.id}`)
}

export async function updateProcedure(
    id: number,
    _previousState: ProcedureFormState,
    formData: FormData
): Promise<ProcedureFormState> {
    const title = formData.get("title")?.toString().trim()
    const description = formData.get("description")?.toString().trim()
    const visualModel = formData.get("visualModel")?.toString().trim()

    if (!title) {
        return {
            error: "Title is required.",
        }
    }

    if (!description) {
        return {
            error: "Description is required.",
        }
    }

    try {
        await serverApi.put(
            `/api/procedures/${id}`,
            {
                title,
                description,
                visualModel: visualModel || null,
            }
        )
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while updating the procedure.",
        }
    }

    revalidatePath("/procedures")
    revalidatePath(`/procedures/${id}`)
    revalidatePath("/dashboard")

    redirect(`/procedures/${id}`)
}

export async function deleteProcedure(id: number) {
    try {
        await serverApi.delete(`/api/procedures/${id}`)
    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Something went wrong while deleting the procedure."
        )
    }

    revalidatePath("/procedures")
    revalidatePath("/dashboard")
}