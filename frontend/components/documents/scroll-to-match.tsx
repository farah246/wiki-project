"use client"

import { useEffect } from "react"

import { MATCH_ATTRIBUTE } from "@/lib/highlight"

type ScrollToFirstMatchProps = {
    // The terms being highlighted. When they change, the page scrolls again.
    terms: string[]
}

// Scrolls to the first highlighted match when a document is opened from a search.
// Renders nothing: the matches themselves are rendered by the server.
export function ScrollToFirstMatch({ terms }: ScrollToFirstMatchProps) {
    const key = terms.join(" ")

    useEffect(() => {
        if (!key) return

        const first = document.querySelector<HTMLElement>(
            `mark[${MATCH_ATTRIBUTE}]`
        )

        if (!first) return

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches

        first.classList.add("ring-2", "ring-violet-500")

        first.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            block: "center",
        })

        return () => {
            first.classList.remove("ring-2", "ring-violet-500")
        }
    }, [key])

    return null
}