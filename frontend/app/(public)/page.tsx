import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Sparkles,
} from "lucide-react"

export default async function Home() {
  const { userId } = await auth()
  const isSignedIn = Boolean(userId)

  return (
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/70 via-background to-background dark:from-violet-950/20" />

          <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium text-violet-600 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              AI-powered knowledge workspace
            </div>

            <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
              Your team's knowledge,
              <span className="block text-violet-600">
                intelligently organized.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Store, discover and manage your team's technical,
              commercial and procedural knowledge in one
              intelligent workspace.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>

              {!isSignedIn && (
                  <Link
                      href="/sign-in"
                      className="inline-flex items-center rounded-xl border bg-background px-5 py-3 text-sm font-medium transition hover:bg-muted"
                  >
                    Sign in
                  </Link>
              )}
            </div>
          </div>
        </section>

        {/* Knowledge types */}
        <section className="border-y bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-violet-600">
                One workspace
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Everything your team knows, in one place.
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                Organize different types of organizational
                knowledge without separating your team's
                information.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/30">
                  <FileText className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold">
                  Technical documents
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Keep technical knowledge, code snippets,
                  architecture notes and Git references
                  organized.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/30">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold">
                  Commercial documents
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Centralize proposals, client information and
                  commercial knowledge for your team.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <h3 className="mt-5 font-semibold">
                  Procedures
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Document workflows, processes and operational
                  knowledge your team relies on.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI search */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-sky-100 text-violet-600">
                <Sparkles className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-3xl">
                Find knowledge without knowing exactly where it
                lives.
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                Search across your organization's knowledge and
                discover relevant information from technical,
                commercial and procedural documents.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" />
                  Search across all document types
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" />
                  Discover relevant knowledge quickly
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-violet-600" />
                  Keep your team's knowledge centralized
                </div>
              </div>
            </div>

            <div className="rounded-3xl border bg-card p-6 shadow-sm">
              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-violet-600" />

                  <span className="text-sm text-muted-foreground">
                    Search your team's knowledge...
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-violet-600" />

                    <span className="text-sm font-medium">
                      Authentication architecture
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Technical document
                  </p>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-4 w-4 text-indigo-600" />

                    <span className="text-sm font-medium">
                      User authentication procedure
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Procedure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Build a smarter knowledge base for your team.
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Bring your team's knowledge together and make it
              easier to discover.
            </p>

            <Link
                href={isSignedIn ? "/dashboard" : "/sign-up"}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
  )
}