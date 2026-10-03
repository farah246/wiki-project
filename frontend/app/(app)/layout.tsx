import AppHeader from "@/components/app-header"
import AppSidebar from "@/components/app-sidebar"

export default function AppLayout({
                                      children,
                                  }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="flex min-h-screen bg-background">

            <AppSidebar />

            <div className="flex min-w-0 flex-1 flex-col">

                <AppHeader />

                <main className="min-w-0 flex-1">
                    {children}
                </main>

            </div>

        </div>
    )
}