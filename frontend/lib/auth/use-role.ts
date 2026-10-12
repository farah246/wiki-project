"use client"

import { useAuth } from "@clerk/nextjs"

import { normalizeRole, type Role } from "@/lib/auth/roles"

// Client-side counterpart of getCurrentRole() (lib/auth/get-role.ts).
export function useCurrentRole(): Role | null {
    const { sessionClaims } = useAuth()

    return normalizeRole(sessionClaims?.metadata?.role)
}