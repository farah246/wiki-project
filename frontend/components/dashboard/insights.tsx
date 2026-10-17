import { DocumentsByTypeChart } from "@/components/dashboard/charts/documents-by-type-chart"
import { DocumentsGrowthChart } from "@/components/dashboard/charts/documents-growth-chart"
import { countByType, weeklyGrowth } from "@/lib/insights"
import type { DocumentSources } from "@/lib/recent-documents"

const GROWTH_WEEKS = 8

// The charts tab. It has its own container, so the two charts sit side by
// side only when this block is wide enough, whatever the screen is.
export function Insights(sources: DocumentSources) {
    return (
        <div className="@container p-6">
            <div className="grid gap-10 @2xl:grid-cols-2">
                <div>
                    <h3 className="mb-5 text-sm font-medium">
                        Documents by type
                    </h3>

                    <DocumentsByTypeChart data={countByType(sources)} />
                </div>

                <div>
                    <h3 className="text-sm font-medium">New documents</h3>

                    <p className="mb-5 mt-1 text-xs text-muted-foreground">
                        Per week, last {GROWTH_WEEKS} weeks
                    </p>

                    <DocumentsGrowthChart
                        data={weeklyGrowth(sources, GROWTH_WEEKS)}
                    />
                </div>
            </div>
        </div>
    )
}