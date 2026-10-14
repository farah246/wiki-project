// Fixed locale and time zone so the server and the browser render the same text
export function formatDate(value: string | null | undefined) {
    if (!value) return ""

    const time = Date.parse(value)

    if (Number.isNaN(time)) return ""

    return new Date(time).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })
}

// "By Farah · Updated 13 Oct 2026", skipping what is missing
export function formatByline(
    author: string | null | undefined,
    updatedAt: string | null | undefined
) {
    const updated = formatDate(updatedAt)

    return [
        author ? `By ${author}` : "",
        updated ? `Updated ${updated}` : "",
    ]
        .filter(Boolean)
        .join(" · ")
}