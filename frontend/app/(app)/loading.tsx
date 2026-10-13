export default function Loading() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-8 lg:px-8 lg:py-10">
            <div className="animate-pulse space-y-4">
                <div className="h-9 w-64 rounded-lg bg-muted" />
                <div className="h-4 w-96 max-w-full rounded bg-muted" />

                <div className="space-y-4 pt-8">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-28 rounded-2xl border bg-muted/40" />
                    ))}
                </div>
            </div>
        </div>
    )
}