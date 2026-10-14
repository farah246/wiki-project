"use server"

import { revalidatePath } from "next/cache"

import { serverApi } from "@/lib/api/server-api"
import { DOC_KINDS, type DocKind, type VersionFields } from "@/lib/doc-versions"
import type { DocHistoryEntry } from "@/lib/types/doc-history"

export type LoadVersionResult = {
    fields?: VersionFields
    error?: string
}

export type RestoreVersionResult = {
    error?: string
}

function isId(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0
}

// The document as it was after one history entry
export async function loadVersion(historyId: number): Promise<LoadVersionResult> {
    if (!isId(historyId)) {
        return { error: "This version could not be loaded." }
    }

    try {
        const fields = await serverApi.get<VersionFields>(
            `/api/doc-history/snapshots/${historyId}`
        )

        return { fields }
    } catch {
        return { error: "This version could not be loaded." }
    }
}

// Puts a saved version back as the current document. It goes through the
// normal update endpoint, so the same roles apply and the restoration is
// recorded in the history as a new version.
export async function restoreVersion(
    kind: DocKind,
    docId: number,
    historyId: number
): Promise<RestoreVersionResult> {
    const config = DOC_KINDS[kind]

    if (!config || !isId(docId) || !isId(historyId)) {
        return { error: "This version cannot be restored." }
    }

    try {
        // The version must belong to this document: only the history of the
        // document is trusted, never the ids sent by the browser alone.
        const history = await serverApi.get<DocHistoryEntry[]>(
            `${config.historyApi}/${docId}`
        )

        const entry = history.find((item) => item.id === historyId)

        if (!entry?.hasSnapshot) {
            return { error: "This version cannot be restored." }
        }

        const fields = await serverApi.get<VersionFields>(
            `/api/doc-history/snapshots/${historyId}`
        )

        // only the fields of this kind of document
        const body = Object.fromEntries(
            config.fields.map(({ key }) => [key, fields[key] ?? null])
        )

        await serverApi.put(`${config.api}/${docId}`, body)
    } catch (error) {
        return {
            error:
                error instanceof Error
                    ? error.message
                    : "Something went wrong while restoring the version.",
        }
    }

    revalidatePath(config.basePath)
    revalidatePath(`${config.basePath}/${docId}`)
    revalidatePath("/dashboard")

    return {}
}