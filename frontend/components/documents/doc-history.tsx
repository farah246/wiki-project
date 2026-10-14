"use client"

import { useState, useTransition } from "react"
import { History, Loader2, RotateCcw } from "lucide-react"

import { loadVersion, restoreVersion } from "@/actions/doc-history"
import {
    DOC_KINDS,
    type DocKind,
    type VersionFields,
} from "@/lib/doc-versions"
import { diffLines, type DiffLine } from "@/lib/line-diff"
import type { DocHistoryEntry } from "@/lib/types/doc-history"

type DocHistoryProps = {
    entries: DocHistoryEntry[]
    kind: DocKind
    docId: number
    // the document as it is now, to compare the saved versions with it
    current: VersionFields
    // whether the user may edit this kind of document (the API checks it too)
    canRestore: boolean
}

type CompareTarget = "none" | "current" | number

const DIFF_STYLES: Record<DiffLine["type"], string> = {
    same: "text-muted-foreground",
    added: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200",
    removed: "bg-red-50 text-red-900 dark:bg-red-950/30 dark:text-red-200",
}

const DIFF_PREFIX: Record<DiffLine["type"], string> = {
    same: " ",
    added: "+",
    removed: "−",
}

const DIFF_SCREEN_READER: Record<DiffLine["type"], string> = {
    same: "",
    added: "Added: ",
    removed: "Removed: ",
}

function text(value: string | null | undefined) {
    return value ?? ""
}

function entryLabel(entry: DocHistoryEntry) {
    return entry.docVersion
        ? `v${entry.docVersion}`
        : new Date(entry.createdAt).toLocaleDateString()
}

function PlainValue({ value }: { value: string }) {
    return (
        <pre className="mt-1 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-muted/40 p-3 text-sm leading-6">
            {value || (
                <span className="italic text-muted-foreground">(empty)</span>
            )}
        </pre>
    )
}

function DiffValue({ lines }: { lines: DiffLine[] }) {
    return (
        <div className="mt-1 max-h-96 overflow-auto rounded-lg border text-sm leading-6">
            {lines.map((line, index) => (
                <div
                    key={index}
                    className={`flex gap-2 whitespace-pre-wrap break-words px-3 ${DIFF_STYLES[line.type]}`}
                >
                    <span aria-hidden className="select-none">
                        {DIFF_PREFIX[line.type]}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="sr-only">
                            {DIFF_SCREEN_READER[line.type]}
                        </span>
                        {line.text || " "}
                    </span>
                </div>
            ))}
        </div>
    )
}

// One field of a saved version. With `compareTo`, only what differs is shown.
function FieldView({
                       label,
                       value,
                       compareTo,
                   }: {
    label: string
    value: string
    compareTo?: string
}) {
    let body

    if (compareTo === undefined) {
        body = <PlainValue value={value} />
    } else {
        if (compareTo === value) return null

        const lines = diffLines(compareTo, value)

        body = lines ? (
            <DiffValue lines={lines} />
        ) : (
            <>
                <p className="mt-1 text-xs text-muted-foreground">
                    Too long to compare line by line. Showing this version.
                </p>
                <PlainValue value={value} />
            </>
        )
    }

    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>

            {body}
        </div>
    )
}

export function DocHistory({
                               entries,
                               kind,
                               docId,
                               current,
                               canRestore,
                           }: DocHistoryProps) {
    const fields = DOC_KINDS[kind].fields

    const [openId, setOpenId] = useState<number | null>(null)
    const [versions, setVersions] = useState<Record<number, VersionFields>>({})
    const [loadingId, setLoadingId] = useState<number | null>(null)
    const [compareWith, setCompareWith] = useState<CompareTarget>("none")
    const [confirming, setConfirming] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isRestoring, startRestore] = useTransition()

    // Loads a saved version once, then keeps it
    async function ensureVersion(id: number) {
        if (versions[id]) return true

        const result = await loadVersion(id)
        const loaded = result.fields

        if (!loaded) {
            setMessage(result.error ?? "This version could not be loaded.")
            return false
        }

        setVersions((previous) => ({ ...previous, [id]: loaded }))

        return true
    }

    async function toggle(entry: DocHistoryEntry) {
        setMessage(null)
        setConfirming(false)
        setCompareWith("none")

        if (openId === entry.id) {
            setOpenId(null)
            return
        }

        setOpenId(entry.id)
        setLoadingId(entry.id)

        await ensureVersion(entry.id)

        setLoadingId(null)
    }

    async function changeCompare(value: string) {
        setMessage(null)

        const target: CompareTarget =
            value === "none" || value === "current" ? value : Number(value)

        setCompareWith(target)

        if (typeof target === "number") {
            setLoadingId(target)

            const loaded = await ensureVersion(target)

            setLoadingId(null)

            if (!loaded) setCompareWith("none")
        }
    }

    function handleRestore(entry: DocHistoryEntry) {
        setMessage(null)

        startRestore(async () => {
            const result = await restoreVersion(kind, docId, entry.id)

            if (result.error) {
                setMessage(result.error)
                return
            }

            // the page is refreshed by the action: the new version shows up
            setConfirming(false)
            setOpenId(null)
        })
    }

    return (
        <section className="rounded-2xl border bg-card">
            <div className="flex items-center gap-2 border-b px-6 py-4">
                <History className="h-4 w-4 text-violet-600" />
                <h2 className="font-semibold">History</h2>
            </div>

            {entries.length === 0 ? (
                <p className="px-6 py-6 text-sm text-muted-foreground">
                    No changes recorded yet.
                </p>
            ) : (
                <ol className="divide-y">
                    {entries.map((entry) => {
                        const isOpen = openId === entry.id
                        const version = isOpen ? versions[entry.id] : undefined

                        const baseFields: VersionFields | undefined =
                            compareWith === "current"
                                ? current
                                : typeof compareWith === "number"
                                    ? versions[compareWith]
                                    : undefined

                        const compareEntry =
                            typeof compareWith === "number"
                                ? entries.find((item) => item.id === compareWith)
                                : undefined

                        const baseLabel =
                            compareWith === "current"
                                ? "the current document"
                                : compareEntry
                                    ? entryLabel(compareEntry)
                                    : ""

                        const comparing = compareWith !== "none"
                        const ready = Boolean(version) && (!comparing || Boolean(baseFields))

                        const sameAsCurrent = version
                            ? fields.every(
                                ({ key }) =>
                                    text(version[key]) === text(current[key])
                            )
                            : false

                        const hasDifferences =
                            version && baseFields
                                ? fields.some(
                                    ({ key }) =>
                                        text(version[key]) !== text(baseFields[key])
                                )
                                : true

                        return (
                            <li key={entry.id}>
                                <div className="flex items-start gap-4 px-6 py-4">
                                    <span className="mt-0.5 w-10 shrink-0 text-xs font-medium text-violet-600">
                                        {entry.docVersion ? `v${entry.docVersion}` : ""}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm">{entry.change}</p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {entry.user?.username ?? "Unknown user"}
                                            {" · "}
                                            {new Date(entry.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {entry.hasSnapshot && (
                                        <button
                                            type="button"
                                            onClick={() => toggle(entry)}
                                            aria-expanded={isOpen}
                                            className="shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                                        >
                                            {isOpen ? "Hide" : "View"}
                                        </button>
                                    )}
                                </div>

                                {isOpen && (
                                    <div className="space-y-4 border-t bg-muted/20 px-6 py-5">
                                        {loadingId !== null && (
                                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading...
                                            </p>
                                        )}

                                        {message && (
                                            <p role="alert" className="text-sm text-red-600">
                                                {message}
                                            </p>
                                        )}

                                        {version && (
                                            <div className="flex flex-wrap items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    Compare with
                                                    <select
                                                        value={String(compareWith)}
                                                        onChange={(event) =>
                                                            changeCompare(event.target.value)
                                                        }
                                                        className="h-9 rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus:border-violet-400"
                                                    >
                                                        <option value="none">Nothing</option>
                                                        <option value="current">
                                                            Current document
                                                        </option>

                                                        {entries
                                                            .filter(
                                                                (item) =>
                                                                    item.hasSnapshot &&
                                                                    item.id !== entry.id
                                                            )
                                                            .map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {entryLabel(item)}
                                                                    {" · "}
                                                                    {new Date(
                                                                        item.createdAt
                                                                    ).toLocaleDateString()}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </label>

                                                {canRestore &&
                                                    (sameAsCurrent ? (
                                                        <span className="text-xs text-muted-foreground">
                                                            This is the current version.
                                                        </span>
                                                    ) : confirming ? (
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-sm">
                                                                Restore {entryLabel(entry)}? It is saved as a
                                                                new version.
                                                            </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleRestore(entry)}
                                                                disabled={isRestoring}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
                                                            >
                                                                {isRestoring && (
                                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                )}
                                                                Confirm
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirming(false)}
                                                                disabled={isRestoring}
                                                                className="rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted disabled:opacity-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirming(true)}
                                                            className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition hover:bg-muted"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5" />
                                                            Restore this version
                                                        </button>
                                                    ))}
                                            </div>
                                        )}

                                        {version && comparing && baseFields && (
                                            <p className="text-xs text-muted-foreground">
                                                Compared with {baseLabel}:{" "}
                                                <span className="rounded bg-red-50 px-1 text-red-900 dark:bg-red-950/30 dark:text-red-200">
                                                    red
                                                </span>{" "}
                                                lines are only there,{" "}
                                                <span className="rounded bg-emerald-50 px-1 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                                                    green
                                                </span>{" "}
                                                lines are only in {entryLabel(entry)}.
                                            </p>
                                        )}

                                        {version && ready && !hasDifferences && (
                                            <p className="text-sm text-muted-foreground">
                                                No differences.
                                            </p>
                                        )}

                                        {version && ready && hasDifferences && (
                                            <div className="space-y-4">
                                                {fields.map(({ key, label }) => (
                                                    <FieldView
                                                        key={key}
                                                        label={label}
                                                        value={text(version[key])}
                                                        compareTo={
                                                            baseFields
                                                                ? text(baseFields[key])
                                                                : undefined
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ol>
            )}
        </section>
    )
}