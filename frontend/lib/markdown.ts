/**
 * Turns a Markdown string into a short plain-text preview (for cards and lists).
 * Not a full parser: it only removes the most common Markdown syntax.
 */
export function toPlainText(markdown: string | null | undefined, maxLength = 200): string {
    if (!markdown) return ""

    const text = markdown
        .replace(/```[\s\S]*?```/g, " ")                    // fenced code blocks
        .replace(/`([^`]*)`/g, "$1")                         // inline code
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")               // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")             // links -> label only
        .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")  // headings, quotes, list markers
        .replace(/(\*\*|~~|\*)(.+?)\1/g, "$2")               // bold, strikethrough, italic
        .replace(/\s+/g, " ")
        .trim()

    return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text
}