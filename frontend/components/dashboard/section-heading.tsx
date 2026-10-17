type SectionHeadingProps = {
    // Small uppercase line above the title
    kicker?: string
    title: string
    id?: string
}

export function SectionHeading({ kicker, title, id }: SectionHeadingProps) {
    return (
        <div>
            {kicker && (
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {kicker}
                </p>
            )}

            <h2 id={id} className="text-xl font-semibold tracking-tight">
                {title}
            </h2>
        </div>
    )
}