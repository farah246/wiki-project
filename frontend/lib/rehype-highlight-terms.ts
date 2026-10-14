import { MARK_CLASS, MATCH_ATTRIBUTE, splitByTerms } from "@/lib/highlight"

// Minimal shape of a hast node. Declared here on purpose, so this file does not
// depend on the types of a package that react-markdown only pulls in indirectly.
type HastNode = {
    type: string
    value?: string
    tagName?: string
    properties?: Record<string, unknown>
    children?: HastNode[]
}

/** All the text below a node, in order. Used to copy a code block as plain text. */
export function hastToText(node: unknown): string {
    const current = node as HastNode | null | undefined

    if (!current) return ""
    if (current.type === "text") return current.value ?? ""

    return (current.children ?? []).map(hastToText).join("")
}

function createMark(text: string): HastNode {
    return {
        type: "element",
        tagName: "mark",
        properties: {
            className: MARK_CLASS.split(" "),
            [MATCH_ATTRIBUTE]: "true",
        },
        children: [{ type: "text", value: text }],
    }
}

function highlightChildren(parent: HastNode, terms: string[]) {
    if (!parent.children) return

    const next: HastNode[] = []

    for (const child of parent.children) {
        if (child.type !== "text" || !child.value) {
            highlightChildren(child, terms)
            next.push(child)
            continue
        }

        const parts = splitByTerms(child.value, terms)

        // no match in this text: keep the original node untouched
        if (parts.length === 1 && !parts[0].match) {
            next.push(child)
            continue
        }

        for (const part of parts) {
            next.push(
                part.match
                    ? createMark(part.text)
                    : { type: "text", value: part.text }
            )
        }
    }

    parent.children = next
}

/**
 * rehype plugin: wraps every occurrence of the given terms in a <mark>.
 * Works on text nodes only, so it can never break the Markdown structure
 * or inject HTML.
 */
export function rehypeHighlightTerms(options: { terms: string[] }) {
    return (tree: unknown) => {
        if (options.terms.length === 0) return

        highlightChildren(tree as HastNode, options.terms)
    }
}