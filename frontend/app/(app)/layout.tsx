import AppHeader from "@/components/app-header"
import AppSidebar from "@/components/app-sidebar"
import { getCurrentRole } from "@/lib/auth/get-role"
import { isAdmin } from "@/lib/auth/roles"
export default async function AppLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode
}>) {
    const role = await getCurrentRole()
    return (

        <div className="flex min-h-screen bg-background">

            <AppSidebar showAdmin={isAdmin(role)} />
            <div className="flex min-w-0 flex-1 flex-col">

                <AppHeader showAdmin={isAdmin(role)} />

                <main className="min-w-0 flex-1">
                    {children}
                </main>

            </div>

        </div>
    )
}