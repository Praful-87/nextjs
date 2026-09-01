import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getUserById } from "@/lib/services/authService";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("Please define JWT_SECRET");
}

const encodedSecret = new TextEncoder().encode(secret);

type SessionPayload = {
  userId: string;
  email: string;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return null;
  }

  return getUserById(session.userId);
}
