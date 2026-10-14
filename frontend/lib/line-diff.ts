// Line by line comparison of two texts (used to compare saved versions).

export type DiffLine = {
    type: "same" | "added" | "removed"
    text: string
}

// Above this size the comparison table would be too big for the browser
const MAX_CELLS = 4_000_000

function toLines(value: string): string[] {
    return value === "" ? [] : value.replace(/\r\n/g, "\n").split("\n")
}

/**
 * Compares two texts line by line.
 *   removed = only in `before`
 *   added   = only in `after`
 * Returns null when the texts are too long to compare.
 */
export function diffLines(before: string, after: string): DiffLine[] | null {
    const a = toLines(before)
    const b = toLines(after)

    if ((a.length + 1) * (b.length + 1) > MAX_CELLS) return null

    // lcs[i][j] = length of the longest common run of lines in a[i..] and b[j..]
    // (the table has at most 4 million cells, so the values stay below 65535)
    const cols = b.length + 1
    const lcs = new Uint16Array((a.length + 1) * cols)

    for (let i = a.length - 1; i >= 0; i--) {
        for (let j = b.length - 1; j >= 0; j--) {
            lcs[i * cols + j] =
                a[i] === b[j]
                    ? lcs[(i + 1) * cols + j + 1] + 1
                    : Math.max(lcs[(i + 1) * cols + j], lcs[i * cols + j + 1])
        }
    }

    const result: DiffLine[] = []

    let i = 0
    let j = 0

    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            result.push({ type: "same", text: a[i] })
            i++
            j++
        } else if (lcs[(i + 1) * cols + j] >= lcs[i * cols + j + 1]) {
            result.push({ type: "removed", text: a[i] })
            i++
        } else {
            result.push({ type: "added", text: b[j] })
            j++
        }
    }

    while (i < a.length) {
        result.push({ type: "removed", text: a[i++] })
    }

    while (j < b.length) {
        result.push({ type: "added", text: b[j++] })
    }

    return result
}