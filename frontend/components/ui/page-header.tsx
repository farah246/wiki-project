import Link from "next/link"
import { ArrowLeft, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type PageHeaderProps = {
    title: string
    // One line under the title (list pages, forms)
    description?: ReactNode
    // Small muted line for details such as author and date (document pages)
    meta?: ReactNode
    // Small label above the title, with an optional icon
    eyebrow?: string
    icon?: LucideIcon
    // "Back to ..." link above the header
    backHref?: string
    backLabel?: string
    // Buttons on the right (New, Edit, ...)
    actions?: ReactNode
}

// The header shared by every document page: list, detail, create and edit.
export function PageHeader({
                               title,
                               description,
                               meta,
                               eyebrow,
                               icon: Icon,
                               backHref,
                               backLabel,
                               actions,
                           }: PageHeaderProps) {
    return (
        <header>
            {backHref && (
                <Link
                    href={backHref}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    {backLabel ?? "Back"}
                </Link>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    {eyebrow && (
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{eyebrow}</span>
                        </div>
                    )}

                    <h1 className="text-3xl font-semibold tracking-tight">
                        {title}
                    </h1>

                    {description && (
                        <div className="mt-2 text-muted-foreground">
                            {description}
                        </div>
                    )}

                    {meta && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            {meta}
                        </div>
                    )}
                </div>

                {actions && (
                    <div className="flex shrink-0 items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    )
}