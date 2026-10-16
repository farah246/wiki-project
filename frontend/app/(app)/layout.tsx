import AppHeader from "@/components/app-header"
import AppSidebar from "@/components/app-sidebar"
import { AskLauncher } from "@/components/ask/ask-launcher"
import { AskPanel } from "@/components/ask/ask-panel"
import { AskProvider } from "@/components/ask/ask-provider"
import { getCurrentRole } from "@/lib/auth/get-role"
import { isAdmin } from "@/lib/auth/roles"
export default async function AppLayout({
                                            children,
                                        }: Readonly<{
    children: React.ReactNode
}>) {
    const role = await getCurrentRole()
    return (
        // The provider is in the layout, which stays mounted while the user
        // moves from page to page: the conversation survives navigation.
        <AskProvider>
            <div className="flex min-h-screen bg-background">

                <AppSidebar showAdmin={isAdmin(role)} />
                <div className="flex min-w-0 flex-1 flex-col">

                    <AppHeader showAdmin={isAdmin(role)} />

                    <main className="min-w-0 flex-1">
                        {children}
                    </main>

                </div>

                {/* Docked on wide screens: it pushes the page instead of covering it */}
                <AskPanel />

            </div>

            <AskLauncher />
        </AskProvider>
    )
}