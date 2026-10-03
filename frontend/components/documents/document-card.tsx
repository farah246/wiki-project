import Link from "next/link"
import {
    ArrowRight,
    BriefcaseBusiness,
    ClipboardList,
    FileText,
} from "lucide-react"

type DocumentType = "technical" | "commercial" | "procedure"

type DocumentCardProps = {
    title: string
    description: string
    type: DocumentType
    href: string
}

const documentTypeConfig = {
    technical: {
        label: "Technical",
        icon: FileText,
        iconClassName:
            "bg-violet-50 text-violet-600 dark:bg-violet-950/30",
        badgeClassName:
            "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    },
    commercial: {
        label: "Commercial",
        icon: BriefcaseBusiness,
        iconClassName:
            "bg-sky-50 text-sky-600 dark:bg-sky-950/30",
        badgeClassName:
            "bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300",
    },
    procedure: {
        label: "Procedure",
        icon: ClipboardList,
        iconClassName:
            "bg-violet-50 text-violet-600 dark:bg-violet-950/30",
        badgeClassName:
            "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    },
}

export function DocumentCard({
                                 title,
                                 description,
                                 type,
                                 href,
                             }: DocumentCardProps) {
    const config = documentTypeConfig[type]
    const Icon = config.icon

    return (
        <Link
            href={href}
            className="group block px-6 py-5 transition hover:bg-muted/40"
        >
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.iconClassName}`}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="truncate font-medium group-hover:text-violet-700">
                            {title}
                        </h3>

                        <span
                            className={`hidden rounded-full px-2.5 py-1 text-[11px] font-medium sm:inline-flex ${config.badgeClassName}`}
                        >
                            {config.label}
                        </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <ArrowRight className="mt-1 hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
            </div>
        </Link>
    )
}