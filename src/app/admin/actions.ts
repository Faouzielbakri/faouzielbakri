"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, checkPassword, sessionToken } from "@/lib/admin-auth";

export async function signIn(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // A fixed pause makes guessing slow without locking the owner out.
    await new Promise((resolve) => setTimeout(resolve, 700));
    redirect("/admin?wrong=1");
  }
  (await cookies()).set(ADMIN_COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function signOut() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}
