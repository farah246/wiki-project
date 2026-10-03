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
import { DocumentCard } from "@/components/documents/document-card"

export default async function Dashboard() {
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

    const recentDocs = [...technicalDocs]
        .sort((a, b) => {
            const dateA = a.updatedAt || a.createdAt || ""
            const dateB = b.updatedAt || b.createdAt || ""

            return dateB.localeCompare(dateA)
        })
        .slice(0, 5)

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

                {/* Statistics */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Technical documents */}
                    <div className="rounded-2xl border bg-card p-5 transition hover:shadow-sm">
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
                    </div>

                    {/* Commercial documents */}
                    <div className="rounded-2xl border bg-card p-5 transition hover:shadow-sm">
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
                    </div>

                    {/* Procedures */}
                    <div className="rounded-2xl border bg-card p-5 transition hover:shadow-sm">
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
                    </div>

                    {/* Role */}
                    <div className="rounded-2xl border bg-card p-5 transition hover:shadow-sm">
                        <p className="text-sm text-muted-foreground">
                            Your role
                        </p>

                        <p className="mt-5 text-2xl font-semibold capitalize">
                            {currentUser.role.toLowerCase()}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Workspace access
                        </p>
                    </div>
                </section>

                {/* Main content */}
                <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">

                    {/* Recent documents */}
                    <div className="overflow-hidden rounded-2xl border bg-card">

                        <div className="flex items-center justify-between border-b px-6 py-5">
                            <div>
                                <h2 className="font-semibold">
                                    Recent documents
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Your latest technical knowledge
                                </p>
                            </div>

                            <Link
                                href="/technical-docs"
                                className="flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700"
                            >
                                View all

                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="divide-y">
                            {recentDocs.length > 0 ? (
                                recentDocs.map((doc) => (
                                    <DocumentCard
                                        key={doc.id}
                                        title={doc.title}
                                        description={doc.content}
                                        type="technical"
                                        href={`/technical-docs/${doc.id}`}
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
                                        Your technical documents will appear
                                        here.
                                    </p>

                                    <Link
                                        href="/technical-docs/new"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
                                    >
                                        Create document
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
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
                                {currentUser.role.toLowerCase()}
                            </p>
                        </div>

                        <div className="mt-4 space-y-2">
                            <Link
                                href="/technical-docs"
                                className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                            >
                                Browse documents

                                <ArrowRight className="h-4 w-4" />
                            </Link>

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