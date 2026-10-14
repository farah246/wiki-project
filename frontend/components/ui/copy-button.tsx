"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Copy } from "lucide-react"

import { cn } from "@/lib/utils"

async function copyToClipboard(text: string): Promise<boolean> {
    // The Clipboard API only exists on HTTPS pages and on localhost.
    // The app is currently served over plain HTTP, so it needs the fallback below.
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch {
        // permission denied: try the legacy way
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.setAttribute("readonly", "")
    textarea.style.position = "fixed"
    textarea.style.top = "0"
    textarea.style.opacity = "0"
    document.body.appendChild(textarea)
    textarea.select()

    try {
        return document.execCommand("copy")
    } catch {
        return false
    } finally {
        document.body.removeChild(textarea)
    }
}

type CopyButtonProps = {
    text: string
    className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    async function handleClick() {
        const copied = await copyToClipboard(text)

        setStatus(copied ? "copied" : "failed")

        if (timer.current) clearTimeout(timer.current)
        timer.current = setTimeout(() => setStatus("idle"), 2000)
    }

    const label =
        status === "copied" ? "Copied" : status === "failed" ? "Failed" : "Copy"

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={
                status === "copied" ? "Code copied" : "Copy code to clipboard"
            }
            className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-md border bg-background/90 px-2.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition hover:text-foreground",
                className
            )}
        >
            {status === "copied" ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}

            <span aria-live="polite">{label}</span>
        </button>
    )
}