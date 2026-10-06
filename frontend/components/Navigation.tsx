"use client"

import Link from "next/link"
import {
    SignInButton,
    SignUpButton,
    SignOutButton,
    UserButton,
    useAuth,
} from "@clerk/nextjs"

import { isAdmin } from "@/lib/auth/roles"

export default function Navigation() {
    const { isSignedIn, sessionClaims } = useAuth()

    const role =
        typeof sessionClaims?.metadata?.role === "string"
            ? sessionClaims.metadata.role.toUpperCase()
            : null

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-sm font-bold text-white">
                        W
                    </div>

                    <span className="text-lg font-semibold tracking-tight text-slate-900">
                        Wiki
                    </span>
                </Link>

                {!isSignedIn ? (
                    <div className="flex items-center gap-3">

                        <SignInButton>
                            <button className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
                                Sign In
                            </button>
                        </SignInButton>

                        <SignUpButton>
                            <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-violet-700">
                                Sign Up
                            </button>
                        </SignUpButton>

                    </div>
                ) : (
                    <div className="flex items-center gap-4">

                        {/* Admin */}
                        {isAdmin(role) && (
                            <Link
                                href="/admin"
                                className="hidden text-sm font-medium text-violet-600 transition hover:text-violet-700 sm:block"
                            >
                                Admin
                            </Link>
                        )}

                        {/* Profile */}
                        <Link
                            href="/user-profile"
                            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block"
                        >
                            Profile
                        </Link>

                        {/* Sign out */}
                        <SignOutButton>
                            <button className="hidden rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 sm:block">
                                Sign Out
                            </button>
                        </SignOutButton>

                        <UserButton />

                    </div>
                )}
            </div>
        </header>
    )
}