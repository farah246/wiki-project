import type { DocumentSources, RecentDocument } from "@/lib/recent-documents"

export type DocumentType = RecentDocument["type"]

// One entry per document type: the order and the colors used by every chart
export const DOCUMENT_TYPES: {
    key: DocumentType
    label: string
    color: string
}[] = [
    { key: "technical", label: "Technical", color: "#7c3aed" },
    { key: "commercial", label: "Commercial", color: "#0ea5e9" },
    { key: "procedure", label: "Procedures", color: "#d946ef" },
]

export type TypeCount = {
    key: DocumentType
    label: string
    color: string
    value: number
}

export type WeeklyPoint = { week: string } & Record<DocumentType, number>

const DAY = 86_400_000
const WEEK = 7 * DAY

export function countByType({
                                technicalDocs,
                                commercialDocs,
                                procedures,
                            }: DocumentSources): TypeCount[] {
    const counts: Record<DocumentType, number> = {
        technical: technicalDocs.length,
        commercial: commercialDocs.length,
        procedure: procedures.length,
    }

    return DOCUMENT_TYPES.map((type) => ({ ...type, value: counts[type.key] }))
}

// Monday 00:00 UTC of the week that contains the given time
function startOfWeek(time: number) {
    const date = new Date(time)
    const daysSinceMonday = (date.getUTCDay() + 6) % 7

    return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate() - daysSinceMonday
    )
}

function formatWeek(start: number) {
    return new Date(start).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    })
}

// New documents per week for the last `weeks` weeks (the current one included),
// oldest first, split by type. Only documents that still exist are counted.
export function weeklyGrowth(
    { technicalDocs, commercialDocs, procedures }: DocumentSources,
    weeks = 8,
    now: number = Date.now()
): WeeklyPoint[] {
    const currentWeek = startOfWeek(now)
    const starts = Array.from(
        { length: weeks },
        (_, index) => currentWeek - (weeks - 1 - index) * WEEK
    )

    const points: WeeklyPoint[] = starts.map((start) => ({
        week: formatWeek(start),
        technical: 0,
        commercial: 0,
        procedure: 0,
    }))

    const count = (docs: { createdAt: string }[], type: DocumentType) => {
        for (const doc of docs) {
            const time = Date.parse(doc.createdAt)

            if (Number.isNaN(time) || time < starts[0]) continue

            const index = Math.round((startOfWeek(time) - starts[0]) / WEEK)

            // anything after the current week (clock skew) is ignored
            if (points[index]) points[index][type] += 1
        }
    }

    count(technicalDocs, "technical")
    count(commercialDocs, "commercial")
    count(procedures, "procedure")

    return points
}