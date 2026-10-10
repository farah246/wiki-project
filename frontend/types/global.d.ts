export {};

// The 4 application roles, stored in uppercase in Clerk publicMetadata.role
export type Roles = "DEVELOPER" | "SALES" | "MANAGER" | "ADMIN";

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            // string on purpose: legacy values such as "admin" may still exist
            // in Clerk. Always read it through normalizeRole() (lib/auth/roles.ts).
            role?: string;
        };
    }
}