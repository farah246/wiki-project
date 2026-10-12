import "server-only"

import { auth } from "@clerk/nextjs/server"

import { normalizeRole, type Role } from "@/lib/auth/roles"

// The role of the signed-in user in canonical uppercase form, or null when
// there is no valid role (for example a user waiting for approval).
export async function getCurrentRole(): Promise<Role | null> {
    const { sessionClaims } = await auth()

    return normalizeRole(sessionClaims?.metadata?.role)
}