"use server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { normalizeRole } from "@/lib/auth/roles";

async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();

  if (!userId || normalizeRole(sessionClaims?.metadata?.role) !== "ADMIN") {
    throw new Error("Not Authorized");
  }

  return userId;
}

export async function setRole(formData: FormData) {
  const adminId = await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const role = normalizeRole(formData.get("role"));

  if (!id || !role) {
    throw new Error("Invalid request");
  }

  if (id === adminId && role !== "ADMIN") {
    throw new Error("You cannot change your own role");
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to set role");
  }
}

export async function removeRole(formData: FormData) {
  const adminId = await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Invalid request");
  }

  if (id === adminId) {
    throw new Error("You cannot remove your own role");
  }

  const client = await clerkClient();

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role: null },
    });
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to remove role");
  }
}

export async function inviteUser(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = normalizeRole(formData.get("role"));

  if (!email || !role) {
    throw new Error("Invalid invitation");
  }

  const client = await clerkClient();

  const existing = await client.users.getUserList({
    emailAddress: [email],
  });

  if (existing.data.length > 0) {
    throw new Error(
        "This email already has an account. Change its role in the user list."
    );
  }

  const origin = (await headers()).get("origin") ?? process.env.APP_URL;

  try {
    await client.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: { role },
      // explicit: the Backend API reference lists notify as false by default
      notify: true,
      ...(origin ? { redirectUrl: `${origin}/sign-up` } : {}),
    });
    revalidatePath("/admin");
  } catch {
    throw new Error(
        "Could not create the invitation (one may already be pending for this email)."
    );
  }
}

export async function revokeInvitation(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Invalid request");
  }

  const client = await clerkClient();

  try {
    await client.invitations.revokeInvitation(id);
    revalidatePath("/admin");
  } catch {
    throw new Error("Failed to revoke invitation");
  }
}