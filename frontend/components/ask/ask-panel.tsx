"use client"

import { AskChat } from "@/components/ask/ask-chat"
import { useAsk } from "@/components/ask/ask-provider"

// One element, three layouts (all from the same classes):
//  - below md:     full-screen sheet
//  - md to xl:     420px panel floating over the page, with a light backdrop
//  - xl and above: 420px column docked next to the page, which it pushes
//                  aside (it stays in view while the page scrolls)
export function AskPanel() {
    const { isOpen, onAskPage, closePanel } = useAsk()

    // on /ask the full page is the chat
    if (!isOpen || onAskPage) return null

    return (
        <>
            <div
                className="fixed inset-0 z-40 hidden bg-black/20 md:block xl:hidden"
                onClick={closePanel}
                aria-hidden="true"
            />

            <aside
                aria-label="Ask the wiki"
                className="fixed inset-0 z-50 flex flex-col bg-background md:left-auto md:w-[420px] md:border-l md:shadow-2xl xl:sticky xl:inset-auto xl:top-0 xl:z-auto xl:h-dvh xl:shrink-0 xl:shadow-none"
            >
                <div className="h-full min-h-0 px-4">
                    <AskChat variant="panel" />
                </div>
            </aside>
        </>
    )
}