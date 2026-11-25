// ═══════════════════════════════════════════════════════════
// MAISON NOIR — Authentication & Session Utility
// Secure password hashing & JWT token management using jose & bcryptjs
// ═══════════════════════════════════════════════════════════

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "maison_noir_development_secret_key_change_in_production_2026"
);

export const COOKIE_NAME = "mn_session";
const TOKEN_EXPIRY = "7d"; // 7 days session

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

// ── Password Hashing ───
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// ── JWT Token Signing & Verification ───
export async function signSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: (payload.name as string) || null,
      role: (payload.role as string) || "CUSTOMER",
    };
  } catch {
    return null;
  }
}

// ── Server-Side Session Retrieval ───
export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
