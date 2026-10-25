import { CLIENT_HEADER, CLIENT_HEADER_VALUE } from "@/lib/proxyGuard";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

/** Semua request lewat proxy Next.js yang menyimpan token di cookie HttpOnly. */
export const API_PROXY_PREFIX = "/api/proxy";

/**
 * Wrapper fetch ke REST API GulaSadar (Express) melalui proxy sisi server.
 * Server mengembalikan { data } saat sukses dan { error } saat gagal.
 */
export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", query, body } = options;

  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const qs = params.toString();
  const url = `${API_PROXY_PREFIX}${path}${qs ? `?${qs}` : ""}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", [CLIENT_HEADER]: CLIENT_HEADER_VALUE },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      credentials: "same-origin",
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internetmu dan pastikan backend berjalan (jalankan `bun run dev` di folder backend), lalu coba lagi.");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Terjadi kesalahan pada server");
  return json.data as T;
}
