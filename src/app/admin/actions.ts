"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, OWNER_COOKIE, checkPassword, sessionToken } from "@/lib/admin-auth";

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // A fixed pause makes guessing slow without locking the owner out.
    await new Promise((resolve) => setTimeout(resolve, 700));
    redirect("/admin?wrong=1");
  }
  const jar = await cookies();
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  jar.set(ADMIN_COOKIE, sessionToken()!, { ...base, maxAge: 60 * 60 * 24 * 30 });
  jar.set(OWNER_COOKIE, "1", { ...base, maxAge: 60 * 60 * 24 * 365 });
  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}
