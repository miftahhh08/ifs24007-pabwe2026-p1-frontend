import { cookies } from "next/headers";
import { BASE_URL } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/session";

type RouteContext = { params: Promise<{ path: string[] }> };

/**
 * Meneruskan request browser ke backend GulaSadar. Token dibaca dari cookie HttpOnly
 * di sisi server lalu dikirim sebagai header Authorization, jadi tidak pernah
 * terlihat oleh JavaScript di browser.
 */
async function forward(req: Request, { params }: RouteContext): Promise<Response> {
  const { path } = await params;
  const target = `${BASE_URL}/${path.join("/")}${new URL(req.url).search}`;

  const headers = new Headers({
    "Content-Type": req.headers.get("content-type") ?? "application/json",
  });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const hasBody = req.method !== "GET" && req.method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return Response.json({ error: "Server backend tidak dapat dihubungi" }, { status: 502 });
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { forward as GET, forward as POST, forward as PUT, forward as DELETE };
