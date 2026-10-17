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

export function formatDateTime(value: string | null | undefined) {
    if (!value) return ""

    const time = Date.parse(value)

    if (Number.isNaN(time)) return ""

    return new Date(time).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    })
}

// "Just now", "5m ago", "2h ago", "Yesterday", "3d ago", then a plain date.
// Meant for server components: the text depends on the current time.
export function formatRelativeTime(
    value: string | null | undefined,
    now: number = Date.now()
) {
    if (!value) return ""

    const time = Date.parse(value)

    if (Number.isNaN(time)) return ""

    const minutes = Math.floor((now - time) / 60_000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`

    const hours = Math.floor(minutes / 60)

    if (hours < 24) return `${hours}h ago`

    const days = Math.floor(hours / 24)

    if (days === 1) return "Yesterday"
    if (days < 7) return `${days}d ago`

    return formatDate(value)
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