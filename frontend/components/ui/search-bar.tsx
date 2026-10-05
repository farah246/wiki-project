"use client"

import { Search, X } from "lucide-react"

type SearchBarProps = {
    placeholder?: string
    value?: string
    onChange?: (value: string) => void
    onSubmit?: () => void
}

export function SearchBar({
                              placeholder = "Search...",
                              value = "",
                              onChange,
                              onSubmit,
                          }: SearchBarProps) {
    return (
        <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <input
                type="search"
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        onSubmit?.()
                    }
                }}
                placeholder={placeholder}
                className="h-12 w-full rounded-xl border bg-background pl-12 pr-12 text-sm outline-none transition placeholder:text-muted-foreground focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-950 [&::-webkit-search-cancel-button]:appearance-none"
            />

            {value && (
                <button
                    type="button"
                    onClick={() => onChange?.("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    )
}