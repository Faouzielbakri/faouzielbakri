import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-user gate for /admin. The password lives in ADMIN_PASSWORD; a correct
 * login sets an httpOnly cookie holding an HMAC of it, so changing the password
 * signs everyone out. With no password set, the dashboard stays closed.
 */
export const ADMIN_COOKIE = "feb_admin";
/**
 * Marks a browser as the owner's, for a year, so the analytics never count it:
 * set at sign-in and deliberately left in place at sign-out. It grants nothing,
 * so anyone faking it only removes themselves from the numbers.
 */
export const OWNER_COOKIE = "feb_owner";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("feb-admin-session").digest("hex");
}

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(candidate: string) {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && same(candidate, password!);
}

export function sessionToken() {
  return expectedToken();
}

export function tokenIsValid(token: string | undefined) {
  const expected = expectedToken();
  return Boolean(expected && token && same(token, expected));
}

export async function isAdmin() {
  return tokenIsValid((await cookies()).get(ADMIN_COOKIE)?.value);
}
