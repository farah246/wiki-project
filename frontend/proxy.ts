import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export default clerkMiddleware(async (auth, req) => {
    const { pathname } = req.nextUrl
    const authObject = await auth ()
    const { userId, sessionClaims } = authObject

    const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/sign-in") ||
        pathname.startsWith("/sign-up")

    const isAdminRoute = pathname.startsWith("/admin")
    const role = sessionClaims?.metadata?.role

    if (!userId && !isPublicRoute) {
        return authObject.redirectToSignIn()
    }

    if (isAdminRoute && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    }
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/__clerk/:path*",
        "/(api|trpc)(.*)",
    ],
}