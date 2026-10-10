export type Role =
    | "DEVELOPER"
    | "SALES"
    | "MANAGER"
    | "ADMIN"

export const ROLES: Role[] = ["DEVELOPER", "SALES", "MANAGER", "ADMIN"]

// Normalize a role value to its canonical uppercase form, or null if the value is
// missing or is not one of the 4 known roles (e.g. a leftover "moderator").
export function normalizeRole(value: unknown): Role | null {
    if (typeof value !== "string") return null

    const upper = value.trim().toUpperCase()

    return (ROLES as string[]).includes(upper) ? (upper as Role) : null
}

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