import Link from "next/link"
import type { ReactNode } from "react"

import { SectionHeading } from "@/components/dashboard/section-heading"
import { cn } from "@/lib/utils"

type SectionCardProps = {
    title: string
    kicker?: string
    description?: string
    // Optional link on the right of the title, e.g. "View all"
    action?: { label: string; href: string }
    className?: string
    children: ReactNode
}

// The bordered card with a title, shared by the dashboard sections
export function SectionCard({
                                title,
                                kicker,
                                description,
                                action,
                                className,
                                children,
                            }: SectionCardProps) {
    return (
        <section
            className={cn("overflow-hidden rounded-2xl border bg-card", className)}
        >
            <header className="flex items-start justify-between gap-4 border-b px-6 py-5">
                <div>
                    <SectionHeading kicker={kicker} title={title} />

                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {action && (
                    <Link
                        href={action.href}
                        className="shrink-0 text-sm font-medium text-violet-600 transition hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        {action.label}
                    </Link>
                )}
            </header>

            {children}
        </section>
    )
}