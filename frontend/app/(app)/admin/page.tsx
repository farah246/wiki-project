import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { normalizeRole, ROLES } from "@/lib/auth/roles";
import { inviteUser, removeRole, revokeInvitation, setRole } from "./actions";

const inputClass =
    "rounded-lg border bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50";
const primaryButton =
    "rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButton =
    "rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

export default async function Admin() {
  const { userId: currentUserId, sessionClaims } = await auth();

  // Defense in depth: proxy.ts already blocks non-admins on /admin
  if (normalizeRole(sessionClaims?.metadata?.role) !== "ADMIN") {
    redirect("/");
  }

  const client = await clerkClient();

  const [userList, invitationList] = await Promise.all([
    client.users.getUserList({ limit: 100, orderBy: "-created_at" }),
    client.invitations.getInvitationList({ status: "pending" }),
  ]);

  // Users waiting for a role come first
  const users = [...userList.data].sort(
      (a, b) =>
          Number(normalizeRole(a.publicMetadata.role) !== null) -
          Number(normalizeRole(b.publicMetadata.role) !== null)
  );

  const invitations = invitationList.data;

  return (
      <div className="min-h-full">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8 lg:py-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            User management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Assign roles to users and invite new teammates with a role.
          </p>

          {/* Invite */}
          <section className="mt-8 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Invite a user</h2>
            <form
                action={inviteUser}
                className="mt-4 flex flex-wrap items-center gap-2"
            >
              <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  className={`${inputClass} min-w-64 flex-1`}
              />
              <select name="role" required defaultValue="" className={inputClass}>
                <option value="">Choose a role</option>
                {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                ))}
              </select>
              <button type="submit" className={primaryButton}>
                Send invitation
              </button>
            </form>

            {invitations.length > 0 && (
                <ul className="mt-5 divide-y rounded-lg border">
                  {invitations.map((invitation) => (
                      <li
                          key={invitation.id}
                          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                      >
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                          <span>{invitation.emailAddress}</span>
                          <span className="text-muted-foreground">
                      {normalizeRole(invitation.publicMetadata?.role) ??
                          "No role"}
                            , pending
                    </span>
                        </div>
                        <form action={revokeInvitation}>
                          <input type="hidden" name="id" value={invitation.id} />
                          <button type="submit" className={secondaryButton}>
                            Revoke
                          </button>
                        </form>
                      </li>
                  ))}
                </ul>
            )}
          </section>

          {/* Users */}
          <section className="mt-8 rounded-2xl border bg-card">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold">Users</h2>
              {userList.totalCount > users.length && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Showing the {users.length} most recent of {userList.totalCount}{" "}
                    users.
                  </p>
              )}
            </div>

            <ul className="divide-y">
              {users.map((user) => {
                const email = user.emailAddresses.find(
                    (e) => e.id === user.primaryEmailAddressId
                )?.emailAddress;
                const name =
                    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    email;
                const rawRole = user.publicMetadata.role;
                const role = normalizeRole(rawRole);
                const isSelf = user.id === currentUserId;

                return (
                    <li
                        key={user.id}
                        className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {name}
                          {isSelf && (
                              <span className="ml-2 text-xs font-normal text-muted-foreground">
                          (you)
                        </span>
                          )}
                        </div>
                        <div className="truncate text-sm text-muted-foreground">
                          {email}
                        </div>
                        <div className="mt-1 text-xs">
                          {role ? (
                              <span className="text-muted-foreground">
                          Current role: {role}
                        </span>
                          ) : (
                              <span className="text-amber-600">
                          {rawRole
                              ? `Invalid role "${String(rawRole)}"`
                              : "No role, waiting for approval"}
                        </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <form action={setRole} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={user.id} />
                          <select
                              name="role"
                              required
                              defaultValue={role ?? ""}
                              disabled={isSelf}
                              className={inputClass}
                          >
                            {!role && <option value="">Choose a role</option>}
                            {ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                            ))}
                          </select>
                          <button
                              type="submit"
                              disabled={isSelf}
                              className={primaryButton}
                          >
                            Save
                          </button>
                        </form>

                        {rawRole != null && (
                            <form action={removeRole}>
                              <input type="hidden" name="id" value={user.id} />
                              <button
                                  type="submit"
                                  disabled={isSelf}
                                  className={secondaryButton}
                              >
                                Remove role
                              </button>
                            </form>
                        )}
                      </div>
                    </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
  );
}