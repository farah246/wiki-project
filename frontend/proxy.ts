import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl

    const authObject = await auth()
    const { userId, sessionClaims } = authObject

    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up")

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    if (!userId && !isPublicRoute) {
        return authObject.redirectToSignIn()
    }

    // Admin routes
    if (
        pathname.startsWith("/admin") &&
        role !== "ADMIN"
    ) {
        return NextResponse.redirect(
            new URL("/", req.url)
        )
    }

    // Technical document creation/editing
    if (
        (
            pathname === "/technical-docs/new" ||
            /^\/technical-docs\/[^/]+\/edit$/.test(pathname)
        ) &&
        !["DEVELOPER", "MANAGER", "ADMIN"].includes(role ?? "")
    ) {
        return NextResponse.redirect(
            new URL("/technical-docs", req.url)
        )
    }

    // Commercial document creation/editing
    if (
        (
            pathname === "/commercial-docs/new" ||
            /^\/commercial-docs\/[^/]+\/edit$/.test(pathname)
        ) &&
        !["SALES", "MANAGER", "ADMIN"].includes(role ?? "")
    ) {
        return NextResponse.redirect(
            new URL("/commercial-docs", req.url)
        )
    }

    // Procedure creation/editing
    if (
        (
            pathname === "/procedures/new" ||
            /^\/procedures\/[^/]+\/edit$/.test(pathname)
        ) &&
        !["DEVELOPER", "MANAGER", "ADMIN"].includes(role ?? "")
    ) {
        return NextResponse.redirect(
            new URL("/procedures", req.url)
        )
    }
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/__clerk/:path*",
        "/(api|trpc)(.*)",
    ],
}