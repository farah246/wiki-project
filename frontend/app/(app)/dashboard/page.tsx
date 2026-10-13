import Link from "next/link"
import {
    ArrowRight,
    BriefcaseBusiness,
    ClipboardList,
    FileText,
    Sparkles,
} from "lucide-react"

import { getTechnicalDocs } from "@/lib/api/technical-doc"
import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { getProcedures } from "@/lib/api/procedures"
import { getCurrentUser } from "@/lib/api/users"
import { getCurrentRole } from "@/lib/auth/get-role"
import {
    canCreateCommercialDocs,
    canCreateProcedures,
    canCreateTechnicalDocs,
} from "@/lib/auth/roles"
import { DocumentCard } from "@/components/documents/document-card"
import { GlobalSearch } from "@/components/dashboard/global-search"

type RecentItem = {
    key: string
    title: string
    description: string
    type: "technical" | "commercial" | "procedure"
    href: string
    date: string
}

export default async function Dashboard() {
    const clerkRole = await getCurrentRole()

    const [
        technicalDocs,
        commercialDocs,
        procedures,
        currentUser,
    ] = await Promise.all([
        getTechnicalDocs(),
        getCommercialDocs(),
        getProcedures(),
        getCurrentUser(),
    ])

    // Latest activity across the three document types
    const recentDocs: RecentItem[] = [
        ...technicalDocs.map((doc) => ({
            key: `technical-${doc.id}`,
            title: doc.title,
            description: doc.content,
            type: "technical" as const,
            href: `/technical-docs/${doc.id}`,
            date: doc.updatedAt || doc.createdAt || "",
        })),
        ...commercialDocs.map((doc) => ({
            key: `commercial-${doc.id}`,
            title: doc.title,
            description: doc.proposalText,
            type: "commercial" as const,
            href: `/commercial-docs/${doc.id}`,
            date: doc.updatedAt || doc.createdAt || "",
        })),
        ...procedures.map((doc) => ({
            key: `procedure-${doc.id}`,
            title: doc.title,
            description: doc.description,
            type: "procedure" as const,
            href: `/procedures/${doc.id}`,
            date: doc.updatedAt || doc.createdAt || "",
        })),
    ]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6)

    // Only what this role is allowed to create
    const quickActions = [
        {
            label: "New technical document",
            href: "/technical-docs/new",
            allowed: canCreateTechnicalDocs(clerkRole),
        },
        {
            label: "New commercial document",
            href: "/commercial-docs/new",
            allowed: canCreateCommercialDocs(clerkRole),
        },
        {
            label: "New procedure",
            href: "/procedures/new",
            allowed: canCreateProcedures(clerkRole),
        },
    ].filter((action) => action.allowed)

    const firstName =
        currentUser.username?.split(" ")[0] || "there"

    return (
        <div className="min-h-full">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">

                {/* Welcome */}
                <section className="mb-10">
                    <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                        <Sparkles className="h-4 w-4" />
                        <span>Your knowledge workspace</span>
                    </div>

                    <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                        Welcome back, {firstName}
                    </h1>

                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        Everything your team knows, organized in one
                        intelligent workspace.
                    </p>
                </section>

                {/* Global search */}
                <section className="mb-8">
                    <GlobalSearch />
                </section>

                {/* Statistics */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Technical documents */}
                    <Link
                        href="/technical-docs"
                        className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                <FileText className="h-5 w-5" />
                            </div>

                            <span className="text-xs text-muted-foreground">
                                Knowledge
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-semibold">
                            {technicalDocs.length}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Technical documents
                        </p>
                    </Link>

                    {/* Commercial documents */}
                    <Link
                        href="/commercial-docs"
                        className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/30">
                                <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <span className="text-xs text-muted-foreground">
                                Workspace
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-semibold">
                            {commercialDocs.length}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Commercial documents
                        </p>
                    </Link>

                    {/* Procedures */}
                    <Link
                        href="/procedures"
                        className="rounded-2xl border bg-card p-5 transition hover:shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                                <ClipboardList className="h-5 w-5" />
                            </div>

                            <span className="text-xs text-muted-foreground">
                                Processes
                            </span>
                        </div>

                        <p className="mt-5 text-3xl font-semibold">
                            {procedures.length}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Procedures
                        </p>
                    </Link>
                </section>

                {/* Main content */}
                <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">

                    {/* Recent documents */}
                    <div className="overflow-hidden rounded-2xl border bg-card">

                        <div className="border-b px-6 py-5">
                            <h2 className="font-semibold">
                                Recent documents
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Latest activity across your workspace
                            </p>
                        </div>

                        <div className="divide-y">
                            {recentDocs.length > 0 ? (
                                recentDocs.map((doc) => (
                                    <DocumentCard
                                        key={doc.key}
                                        title={doc.title}
                                        description={doc.description}
                                        type={doc.type}
                                        href={doc.href}
                                    />
                                ))
                            ) : (
                                <div className="px-6 py-12 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                    </div>

                                    <p className="mt-4 font-medium">
                                        No documents yet
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Documents will appear here as your
                                        team creates them.
                                    </p>

                                    {quickActions.length > 0 && (
                                        <Link
                                            href={quickActions[0].href}
                                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                                        >
                                            {quickActions[0].label}
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Workspace */}
                    <aside className="rounded-2xl border bg-card p-6">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-sky-100 text-violet-600 dark:from-violet-950/40 dark:to-sky-950/30">
                            <Sparkles className="h-5 w-5" />
                        </div>

                        <h2 className="mt-5 text-lg font-semibold">
                            Your workspace
                        </h2>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                            {currentUser.email}
                        </p>

                        <div className="mt-6 rounded-xl bg-muted/50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Current role
                            </p>

                            <p className="mt-2 font-medium capitalize">
                                {clerkRole?.toLowerCase() || "unknown"}
                            </p>
                        </div>

                        <div className="mt-4 space-y-2">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                                >
                                    {action.label}

                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ))}

                            <Link
                                href="/user-profile"
                                className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                            >
                                Your profile

                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </aside>
                </section>
            </div>
        </div>
    )
}