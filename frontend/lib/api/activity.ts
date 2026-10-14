import { serverApi } from "@/lib/api/server-api"
import type { ActivityPage } from "@/lib/types/activity"

export type ActivityScope = "all" | "me"

export function getActivity(
    page: number,
    action?: string,
    scope: ActivityScope = "me",
    userId?: number
) {
    const params = new URLSearchParams({ page: String(page), size: "20" })
    if (action) params.set("action", action)
    if (scope === "all" && userId) params.set("userId", String(userId))

    const path =
        scope === "all"
            ? "/api/doc-history/activity"
            : "/api/doc-history/activity/me"

    return serverApi.get<ActivityPage>(`${path}?${params}`)
}