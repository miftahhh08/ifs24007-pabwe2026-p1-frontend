import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/config";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  LOGOUT_PATH,
  TOKEN_ISSUING_PATHS,
  buildUpstreamPath,
  extractSessionToken,
  isSecureRequest,
  isTrustedRequest,
} from "@/lib/proxyGuard";

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Meneruskan request browser ke backend GulaSadar.
 * - Token disimpan sebagai cookie HttpOnly oleh proxy ini (diterbitkan saat login/daftar,
 *   dihapus saat logout atau token ditolak), jadi tidak pernah terlihat oleh JavaScript.
 * - Token dibaca dari cookie lalu dikirim ke backend sebagai header Authorization.
 */
async function forward(req: Request, { params }: RouteContext): Promise<Response> {
  if (!isTrustedRequest(req.method, req.headers)) {
    return Response.json({ error: "Request ditolak" }, { status: 403 });
  }

  const upstreamPath = buildUpstreamPath((await params).path);
  if (!upstreamPath) {
    return Response.json({ error: "Alamat tidak valid" }, { status: 400 });
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const headers = new Headers({
    "Content-Type": req.headers.get("content-type") ?? "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  let upstream: Response;
  try {
    upstream = await fetch(`${BASE_URL}/${upstreamPath}${new URL(req.url).search}`, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return Response.json({ error: "Server backend tidak dapat dihubungi" }, { status: 502 });
  }

  let payload = await upstream.text();

  if (upstream.ok && TOKEN_ISSUING_PATHS.has(upstreamPath)) {
    const session = extractSessionToken(payload);
    if (session) {
      store.set(SESSION_COOKIE, session.token, {
        httpOnly: true,
        secure: isSecureRequest(req.url, req.headers),
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      payload = session.body;
    }
  } else if (upstreamPath === LOGOUT_PATH || (upstream.status === 401 && token)) {
    store.delete(SESSION_COOKIE);
  }

  return new Response(payload, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as DELETE };
