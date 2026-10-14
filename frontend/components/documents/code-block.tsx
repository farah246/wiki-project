import type { ReactNode } from "react"

import { CopyButton } from "@/components/ui/copy-button"
import { cn } from "@/lib/utils"

type CodeBlockProps = {
    // The plain text that ends up in the clipboard
    text: string
    // The <pre> to show (the caller decides how it looks)
    children: ReactNode
    className?: string
}

// Puts a copy button in the top right corner of a <pre>.
// The <pre> should keep some right padding (for example pr-16) so a long
// first line does not run under the button.
export function CodeBlock({ text, children, className }: CodeBlockProps) {
    return (
        <div className={cn("group relative [&_pre]:my-0", className)}>
            <CopyButton
                // a fenced block ends with a newline that is not part of the code
                text={text.replace(/\n$/, "")}
                className="absolute right-3 top-3 z-10"
            />

            {children}
        </div>
    )
}