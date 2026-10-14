// Helpers for highlighting a search query inside a document page (?q=...).

// Classes of every highlighted match. Kept as one constant so the Markdown
// plugin and the plain-text helper render matches identically.
export const MARK_CLASS =
    "rounded bg-violet-200 px-0.5 text-violet-950 dark:bg-violet-800/60 dark:text-violet-100"

// Attribute used to find the matches in the DOM (scroll to the first one).
export const MATCH_ATTRIBUTE = "data-search-match"

const MAX_QUERY_LENGTH = 200
const MAX_TERMS = 8
const MIN_TERM_LENGTH = 2

// Common words that would highlight half of a page for a natural-language search
const STOPWORDS = new Set([
    // two letters (short technical words such as "ai", "db" or "ci" are kept)
    "do", "to", "is", "in", "of", "on", "at", "an", "as", "it", "be", "or",
    "if", "by", "my", "we", "me", "so", "no", "up", "us", "am",
    // longer
    "the", "and", "for", "are", "but", "not", "you", "all", "any", "can",
    "how", "what", "when", "where", "why", "who", "which", "with", "from",
    "that", "this", "these", "those", "your", "does", "did", "has", "have",
    "was", "were", "will", "into", "about", "than", "then", "there", "their",
])

/**
 * Turns the raw ?q= value into the list of terms to highlight.
 * Words are matched one by one, case-insensitively. If every word is a
 * stopword (for example "how to"), the whole query is used instead.
 */
export function parseHighlightQuery(
    raw: string | string[] | undefined
): string[] {
    const value = (Array.isArray(raw) ? raw[0] : raw)?.trim().slice(0, MAX_QUERY_LENGTH)

    if (!value) return []

    const words = value
        .toLowerCase()
        .split(/\s+/)
        // strip punctuation around a word, keep it inside ("node.js", "c++")
        .map((word) => word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}+#]+$/gu, ""))
        .filter((word) => word.length >= MIN_TERM_LENGTH)

    const meaningful = words.filter((word) => !STOPWORDS.has(word))

    const terms = meaningful.length > 0
        ? meaningful
        : value.length >= MIN_TERM_LENGTH
            ? [value.toLowerCase()]
            : []

    // de-duplicate and keep the list short
    return Array.from(new Set(terms)).slice(0, MAX_TERMS)
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export type TextPart = { text: string; match: boolean }

/** Splits a text into plain parts and matching parts. */
export function splitByTerms(text: string, terms: string[]): TextPart[] {
    if (!text || terms.length === 0) {
        return [{ text, match: false }]
    }

    // longest first, so "spring boot" wins over "spring"
    const pattern = [...terms]
        .sort((a, b) => b.length - a.length)
        .map(escapeRegExp)
        .join("|")

    const regex = new RegExp(pattern, "gi")

    const parts: TextPart[] = []
    let lastIndex = 0

    for (const match of text.matchAll(regex)) {
        const start = match.index ?? 0

        // an empty match would loop forever; terms are never empty, but be safe
        if (match[0].length === 0) continue

        if (start > lastIndex) {
            parts.push({ text: text.slice(lastIndex, start), match: false })
        }

        parts.push({ text: match[0], match: true })
        lastIndex = start + match[0].length
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), match: false })
    }

    return parts.length > 0 ? parts : [{ text, match: false }]
}


// Number of characters of a description that are visible in a list card
// (two lines of text). A match further away would be hidden by line-clamp.
const VISIBLE_CHARS = 140

/**
 * Returns the text, starting a little before the first match when that match
 * would be out of sight. Otherwise the text is returned unchanged.
 */
export function excerptAround(text: string, terms: string[]): string {
    if (!text || terms.length === 0) return text

    const lower = text.toLowerCase()

    let index = -1
    let length = 0

    for (const term of terms) {
        const found = lower.indexOf(term.toLowerCase())

        if (found !== -1 && (index === -1 || found < index)) {
            index = found
            length = term.length
        }
    }

    // no match in this text, or already visible
    if (index === -1 || index + length <= VISIBLE_CHARS) return text

    // start ~40 characters before the match, on a word boundary
    const start = Math.max(0, index - 40)
    const space = text.indexOf(" ", start)
    const from = space !== -1 && space < index ? space + 1 : start

    return "\u2026" + text.slice(from)
}