// What a document list shows (filter, sort, page) and how it is kept in the URL:
//   /technical-docs?filter=spring&sort=title-asc&page=2
// Values that equal the default are left out, so the plain list has a plain URL.

export type SortKey = "updated" | "created" | "title-asc" | "title-desc"

const SORT_KEYS: SortKey[] = ["updated", "created", "title-asc", "title-desc"]

export const DEFAULT_SORT: SortKey = "updated"

export type ListView = {
    filter: string
    sort: SortKey
    page: number
}

const MANAGED_KEYS = ["filter", "sort", "page"]
const MAX_FILTER_LENGTH = 200
const MAX_PAGE = 10000

type ParamsReader = { get(name: string): string | null }

export function readListView(params: ParamsReader): ListView {
    const rawSort = params.get("sort")

    const sort =
        SORT_KEYS.find((key) => key === rawSort) ?? DEFAULT_SORT

    const rawPage = Number.parseInt(params.get("page") ?? "", 10)

    const page =
        Number.isFinite(rawPage) && rawPage >= 1
            ? Math.min(rawPage, MAX_PAGE)
            : 1

    return {
        filter: (params.get("filter") ?? "").trim().slice(0, MAX_FILTER_LENGTH),
        sort,
        page,
    }
}

// The same view always gives the same string, so two of them can be compared.
export function listViewToQuery(view: ListView): string {
    const params = new URLSearchParams()

    const filter = view.filter.trim()

    if (filter) params.set("filter", filter)
    if (view.sort !== DEFAULT_SORT) params.set("sort", view.sort)
    if (view.page > 1) params.set("page", String(view.page))

    return params.toString()
}

// Puts the view into an existing query string and keeps every other parameter.
export function mergeListQuery(currentSearch: string, view: ListView): string {
    const params = new URLSearchParams(currentSearch)

    MANAGED_KEYS.forEach((key) => params.delete(key))

    new URLSearchParams(listViewToQuery(view)).forEach((value, key) => {
        params.set(key, value)
    })

    return params.toString()
}