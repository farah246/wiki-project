export type Role =
    | "DEVELOPER"
    | "SALES"
    | "MANAGER"
    | "ADMIN"

export function isAdmin(role: string | null | undefined) {
    return role === "ADMIN"
}

export function canCreateTechnicalDocs(
    role: string | null | undefined
) {
    return (
        role === "DEVELOPER" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canEditTechnicalDocs(
    role: string | null | undefined
) {
    return (
        role === "DEVELOPER" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canDeleteTechnicalDocs(
    role: string | null | undefined
) {
    return role === "ADMIN"
}

export function canCreateCommercialDocs(
    role: string | null | undefined
) {
    return (
        role === "SALES" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canEditCommercialDocs(
    role: string | null | undefined
) {
    return (
        role === "SALES" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canDeleteCommercialDocs(
    role: string | null | undefined
) {
    return role === "ADMIN"
}

export function canCreateProcedures(
    role: string | null | undefined
) {
    return (
        role === "DEVELOPER" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canEditProcedures(
    role: string | null | undefined
) {
    return (
        role === "DEVELOPER" ||
        role === "MANAGER" ||
        role === "ADMIN"
    )
}

export function canDeleteProcedures(
    role: string | null | undefined
) {
    return role === "ADMIN"
}