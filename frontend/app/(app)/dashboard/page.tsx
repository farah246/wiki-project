import {
    BriefcaseBusiness,
    ClipboardList,
    FileText,
    Sparkles,
} from "lucide-react"

import { ActivityList } from "@/components/dashboard/activity-list"
import { AskHero } from "@/components/dashboard/ask-hero"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { StatCard, type StatCardProps } from "@/components/dashboard/stat-card"
import { getActivity, type ActivityScope } from "@/lib/api/activity"
import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { getProcedures } from "@/lib/api/procedures"
import { getTechnicalDocs } from "@/lib/api/technical-doc"
import { getCurrentUser } from "@/lib/api/users"
import { getCurrentRole } from "@/lib/auth/get-role"
import { isAdmin } from "@/lib/auth/roles"
import { buildRecentDocuments } from "@/lib/recent-documents"

const ACTIVITY_LIMIT = 5

// The dashboard must still load when the activity feed is unavailable
async function getRecentActivity(scope: ActivityScope) {
    try {
        const page = await getActivity(0, undefined, scope)

        return page?.items.slice(0, ACTIVITY_LIMIT) ?? []
    } catch {
        return []
    }
}

export default async function Dashboard() {
    const role = await getCurrentRole()
    const admin = isAdmin(role)

    const [technicalDocs, commercialDocs, procedures, currentUser, activity] =
        await Promise.all([
            getTechnicalDocs(),
            getCommercialDocs(),
            getProcedures(),
            getCurrentUser(),
            // admins see everyone's activity, everybody else their own
            getRecentActivity(admin ? "all" : "me"),
        ])

    const recentDocuments = buildRecentDocuments({
        technicalDocs,
        commercialDocs,
        procedures,
    })

    const stats: StatCardProps[] = [
        {
            label: "Knowledge",
            description: "Technical documents",
            value: technicalDocs.length,
            href: "/technical-docs",
            icon: FileText,
            tone: "violet",
        },
        {
            label: "Workspace",
            description: "Commercial documents",
            value: commercialDocs.length,
            href: "/commercial-docs",
            icon: BriefcaseBusiness,
            tone: "sky",
        },
        {
            label: "Processes",
            description: "Procedures",
            value: procedures.length,
            href: "/procedures",
            icon: ClipboardList,
            tone: "violet",
        },
    ]

    const firstName = currentUser.username?.split(" ")[0] || "there"

    return (
        <div className="min-h-full">
            {/*
              The layout follows the width of this block, not of the screen:
              the Ask panel can be docked next to the page and takes 420px.

              Narrow: one column, in this order: welcome, Ask, main, activity.
              Wide: two columns that start at the same height. The left one
              holds the welcome text and the main content, the right one the
              Ask card and the activity.

              "contents" removes the two column wrappers on narrow screens, so
              their children become items of the grid and "order" can mix them.
            */}
            <div className="mx-auto max-w-7xl px-6 py-8 @container lg:px-8 lg:py-10">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-6 @4xl:grid-cols-[minmax(0,1fr)_380px] @4xl:items-start">

                    {/* Left column */}
                    <div className="contents @4xl:flex @4xl:flex-col @4xl:gap-8">
                        <section className="order-1 @4xl:order-none">
                            <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
                                <Sparkles className="h-4 w-4" />
                                <span>Your knowledge workspace</span>
                            </div>

                            <h1 className="mt-3 text-3xl font-semibold leading-[1.06] tracking-[-0.045em] md:text-[2.75rem]">
                                Welcome back, {firstName}
                            </h1>

                            <p className="mt-2 max-w-2xl text-muted-foreground">
                                Everything your team knows, organized in one
                                intelligent workspace.
                            </p>
                        </section>

                        <div className="order-3 min-w-0 space-y-8 @4xl:order-none">
                            <section aria-labelledby="search-title">
                                <div className="mb-3">
                                    <SectionHeading
                                        id="search-title"
                                        kicker="Browse your workspace"
                                        title="Search knowledge"
                                    />
                                </div>

                                <GlobalSearch />
                            </section>

                            <section className="grid gap-4 @xl:grid-cols-3">
                                {stats.map((stat) => (
                                    <StatCard key={stat.href} {...stat} />
                                ))}
                            </section>

                            <RecentDocuments documents={recentDocuments} />
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="contents @4xl:flex @4xl:flex-col @4xl:gap-6">
                        <AskHero className="order-2 @4xl:order-none" />

                        <ActivityList
                            entries={activity}
                            showUser={admin}
                            className="order-4 @4xl:order-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}