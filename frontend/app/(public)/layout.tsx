import Navigation from "@/components/Navigation"

export default function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <div className="min-h-screen">
            <Navigation />

            <main>
                {children}
            </main>
        </div>
    )
}