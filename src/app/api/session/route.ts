import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

/** Menyimpan token login sebagai cookie HttpOnly, sehingga tidak bisa dibaca JavaScript di browser. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: unknown };
  if (typeof body.token !== "string" || body.token.length === 0) {
    return Response.json({ error: "Token tidak valid" }, { status: 400 });
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, body.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return Response.json({ data: { ok: true } });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ data: { ok: true } });
}
