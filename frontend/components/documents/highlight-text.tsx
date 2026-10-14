import { MARK_CLASS, MATCH_ATTRIBUTE, splitByTerms } from "@/lib/highlight"

type HighlightTextProps = {
    text: string
    terms: string[]
}

// Plain-text counterpart of the Markdown highlight plugin: wraps each match
// of the terms in a <mark>. Used for code snippets and other raw text.
export function HighlightText({ text, terms }: HighlightTextProps) {
    if (terms.length === 0) {
        return <>{text}</>
    }

    // spread into a props object: a data-* name cannot be written as a JSX attribute
    const matchProps = { [MATCH_ATTRIBUTE]: "true" }

    return (
        <>
            {splitByTerms(text, terms).map((part, index) =>
                part.match ? (
                    <mark key={index} className={MARK_CLASS} {...matchProps}>
                        {part.text}
                    </mark>
                ) : (
                    <span key={index}>{part.text}</span>
                )
            )}
        </>
    )
}