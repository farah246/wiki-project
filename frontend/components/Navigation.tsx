"use client"

import Link from "next/link"
import {
    SignInButton,
    SignUpButton,
    SignOutButton,
    UserButton,
    useUser,
} from "@clerk/nextjs"

export default function Navigation() {
    const { isSignedIn } = useUser()

    return (
        <nav className="border-b">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <Link href="/" className="text-xl font-semibold">
                    Wiki
                </Link>

                <div className="flex items-center gap-4">
                    {!isSignedIn ? (
                        <>
                            <SignInButton >
                                <button className="text-sm">
                                    Sign In
                                </button>
                            </SignInButton>

                            <SignUpButton >
                                <button className="rounded-md bg-purple-700 px-4 py-2 text-sm text-white">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="text-sm">
                                Dashboard
                            </Link>

                            <UserButton />
                            <Link href="/user-profile">
                                Profile
                            </Link>


                            <SignOutButton>
                                    <span className="cursor-pointer px-2 py-1 text-sm border border-neutral-300 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700">
                                        Sign Out
                                    </span>
                            </SignOutButton>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}