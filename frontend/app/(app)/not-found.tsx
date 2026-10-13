import Link from "next/link"

export default function NotFound() {
    return (
        <div className="mx-auto max-w-xl px-6 py-24 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
                Document not found
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
                It may have been deleted, or the link is wrong.
            </p>

            <Link
                href="/dashboard"
                className="mt-6 inline-flex rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
            >
                Back to dashboard
            </Link>
        </div>
    )
}