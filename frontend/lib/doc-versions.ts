// What the saved versions of each kind of document contain, and where the
// document lives in the API. The field keys are the ones the backend stores in
// a snapshot and accepts in an update, so a version can be sent back as is.

export type DocKind = "technical" | "commercial" | "procedure"

// field key -> text (null when the field is empty)
export type VersionFields = Record<string, string | null>

type VersionField = {
    key: string
    label: string
}

type DocKindConfig = {
    // page path, e.g. /technical-docs
    basePath: string
    // document API, e.g. /api/technical-docs
    api: string
    // history API of one document, e.g. /api/doc-history/technical-docs
    historyApi: string
    fields: VersionField[]
}

export const DOC_KINDS: Record<DocKind, DocKindConfig> = {
    technical: {
        basePath: "/technical-docs",
        api: "/api/technical-docs",
        historyApi: "/api/doc-history/technical-docs",
        fields: [
            { key: "title", label: "Title" },
            { key: "content", label: "Content" },
            { key: "codeSnippet", label: "Code snippet" },
            { key: "gitRef", label: "Git reference" },
        ],
    },
    commercial: {
        basePath: "/commercial-docs",
        api: "/api/commercial-docs",
        historyApi: "/api/doc-history/commercial-docs",
        fields: [
            { key: "title", label: "Title" },
            { key: "proposalText", label: "Proposal" },
            { key: "clientName", label: "Client" },
        ],
    },
    procedure: {
        basePath: "/procedures",
        api: "/api/procedures",
        historyApi: "/api/doc-history/procedures",
        fields: [
            { key: "title", label: "Title" },
            { key: "description", label: "Description" },
            { key: "visualModel", label: "Visual model" },
        ],
    },
}