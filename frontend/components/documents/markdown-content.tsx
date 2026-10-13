import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type MarkdownContentProps = {
    children: string
}

// Renders user-written Markdown. react-markdown does not render raw HTML
// by default, so content cannot inject scripts. Do NOT add rehype-raw.
export function MarkdownContent({ children }: MarkdownContentProps) {
    return (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-violet-600 prose-pre:bg-muted prose-pre:text-foreground prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                        </a>
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    )
}