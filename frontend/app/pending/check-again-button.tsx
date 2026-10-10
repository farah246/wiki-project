"use client"

import { useState } from "react"
import { useSession } from "@clerk/nextjs"

// A role change only shows up once the session token is refreshed, so this
// forces a fresh token and reloads. If the role is still missing, the proxy
// sends the user back to /pending.
export function CheckAgainButton() {
    const { session } = useSession()
    const [busy, setBusy] = useState(false)

    async function checkAgain() {
        setBusy(true)

        try {
            await session?.getToken({ skipCache: true })
        } finally {
            window.location.assign("/dashboard")
        }
    }

    return (
        <button
            type="button"
            onClick={checkAgain}
            disabled={busy}
            className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
        >
            {busy ? "Checking..." : "Check again"}
        </button>
    )
}