"use client"

import { useState, type KeyboardEvent, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type TabId = "recent" | "activity" | "insights"

const TABS: { id: TabId; label: string }[] = [
    { id: "recent", label: "Recent" },
    { id: "activity", label: "Activity" },
    { id: "insights", label: "Insights" },
]

// One slot per tab, filled by the page
type DashboardTabsProps = Record<TabId, ReactNode>

// One card that shows one thing at a time: recent documents, activity or charts
export function DashboardTabs(panels: DashboardTabsProps) {
    const [active, setActive] = useState<TabId>("recent")

    // Left and right arrows move between the tabs
    const handleKeyDown = (event: KeyboardEvent, index: number) => {
        const offset =
            event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0

        if (offset === 0) return

        event.preventDefault()

        const next = TABS[(index + offset + TABS.length) % TABS.length]

        setActive(next.id)
        document.getElementById(`dashboard-tab-${next.id}`)?.focus()
    }

    return (
        <section className="overflow-hidden rounded-2xl border bg-card">
            <div
                role="tablist"
                aria-label="Workspace overview"
                className="flex gap-7 border-b px-6"
            >
                {TABS.map((tab, index) => {
                    const selected = tab.id === active

                    return (
                        <button
                            key={tab.id}
                            id={`dashboard-tab-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-controls={`dashboard-panel-${tab.id}`}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setActive(tab.id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={cn(
                                "-mb-px border-b-2 py-4 text-sm font-medium transition-colors",
                                selected
                                    ? "border-violet-600 text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* only the open tab is rendered, so charts animate when opened */}
            <div
                role="tabpanel"
                id={`dashboard-panel-${active}`}
                aria-labelledby={`dashboard-tab-${active}`}
            >
                {panels[active]}
            </div>
        </section>
    )
}