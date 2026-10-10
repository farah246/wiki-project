import { SignOutButton } from "@clerk/nextjs"

import { CheckAgainButton } from "./check-again-button"

export default function PendingPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6">
            <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Waiting for access
                </h1>

                <p className="mt-3 text-sm text-muted-foreground">
                    Your account is created, but an administrator still has to
                    assign you a role before you can open the workspace.
                    You will get access as soon as that is done.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                    <CheckAgainButton />

                    <SignOutButton redirectUrl="/">
                        <button
                            type="button"
                            className="rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                        >
                            Sign out
                        </button>
                    </SignOutButton>
                </div>
            </div>
        </main>
    )
}