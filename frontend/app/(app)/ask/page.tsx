import { AskChat } from "@/components/ask/ask-chat"

// The layout already gives the page the full screen: the header is h-16, so the
// chat takes the rest. The thread scrolls inside, the question box stays put.
export default function AskPage() {
    return (
        <div className="mx-auto h-[calc(100dvh-4rem)] max-w-4xl px-4 md:px-6">
            <AskChat />
        </div>
    )
}