import { Sparkles } from "lucide-react"

import { ActivityList } from "@/components/dashboard/activity-list"
import { AskHero } from "@/components/dashboard/ask-hero"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { GlobalSearch } from "@/components/dashboard/global-search"
import { Insights } from "@/components/dashboard/insights"
import { RecentDocuments } from "@/components/dashboard/recent-documents"
import { getActivity, type ActivityScope } from "@/lib/api/activity"
import { getCommercialDocs } from "@/lib/api/commercial-doc"
import { getProcedures } from "@/lib/api/procedures"
import { getTechnicalDocs } from "@/lib/api/technical-doc"
import { getCurrentUser } from "@/lib/api/users"
import { getCurrentRole } from "@/lib/auth/get-role"
import { isAdmin } from "@/lib/auth/roles"
import { buildRecentDocuments } from "@/lib/recent-documents"

const ACTIVITY_LIMIT = 4

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

    const sources = { technicalDocs, commercialDocs, procedures }

    const firstName = currentUser.username?.split(" ")[0] || "there"

    return (
        <div className="min-h-full">
            {/*
              The layout follows the width of this block, not of the screen:
              the Ask panel can be docked next to the page and takes 420px.

              Narrow: one column (welcome, Ask, search and tabs).
              Wide: welcome, search and tabs on the left, the Ask card on the
              right. The Ask card hides while the panel is open, and the right
              column then takes no space.
            */}
            <div className="mx-auto max-w-7xl px-6 py-10 @container lg:px-8 lg:py-12">
                <div className="grid grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-10 @4xl:grid-cols-[minmax(0,1fr)_auto]">

                    <section className="@4xl:col-start-1 @4xl:row-start-1">
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

                    <AskHero className="@4xl:col-start-2 @4xl:row-start-1 @4xl:row-end-3 @4xl:w-[380px] @4xl:self-start" />

                    <div className="min-w-0 space-y-6 @4xl:col-start-1 @4xl:row-start-2">
                        <section aria-labelledby="search-title">
                            <h2 id="search-title" className="sr-only">
                                Search knowledge
                            </h2>

                            <GlobalSearch />
                        </section>

                        <DashboardTabs
                            recent={
                                <RecentDocuments
                                    documents={buildRecentDocuments(sources)}
                                />
                            }
                            activity={
                                <ActivityList
                                    entries={activity}
                                    showUser={admin}
                                />
                            }
                            insights={<Insights {...sources} />}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}