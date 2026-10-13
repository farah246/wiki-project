"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPage({
                                      error,
                                      reset,
                                  }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
                Something went wrong
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
                We couldn&apos;t load this page. Please try again.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={reset}
                    className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                >
                    Try again
                </button>

                <Link
                    href="/dashboard"
                    className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                    Back to dashboard
                </Link>
            </div>
        </div>
    )
}