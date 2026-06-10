import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "admin_session";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 86400, // 24 hours
};

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET env var is not set");
  return new TextEncoder().encode(s);
}

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ role: string }> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { role: string };
}
