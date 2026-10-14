import ReactMarkdown, { type Options } from "react-markdown"
import remarkGfm from "remark-gfm"

import { CodeBlock } from "@/components/documents/code-block"
import { hastToText, rehypeHighlightTerms } from "@/lib/rehype-highlight-terms"

type MarkdownContentProps = {
    children: string
    // Words to highlight (from ?q=). Matches are wrapped in <mark>.
    highlight?: string[]
}

// Renders user-written Markdown. react-markdown does not render raw HTML
// by default, so content cannot inject scripts. Do NOT add rehype-raw.
export function MarkdownContent({
                                    children,
                                    highlight = [],
                                }: MarkdownContentProps) {
    const rehypePlugins: NonNullable<Options["rehypePlugins"]> =
        highlight.length > 0
            ? [[rehypeHighlightTerms, { terms: highlight }]]
            : []

    return (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-violet-600 prose-pre:bg-muted prose-pre:pr-16 prose-pre:text-foreground prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={rehypePlugins}
                components={{
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                    pre: ({ node, children }) => (
                        <CodeBlock text={hastToText(node)} className="my-6">
                            <pre>{children}</pre>
                        </CodeBlock>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    )
}