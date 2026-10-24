import { BASE_URL } from "@/lib/config";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

const TOKEN_KEY = "gulasadar:token";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

/**
 * Wrapper fetch ke REST API GulaSadar (Express).
 * Server mengembalikan { data } saat sukses dan { error } saat gagal.
 */
export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", query, body } = options;

  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const qs = params.toString();
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internetmu dan pastikan backend berjalan (jalankan `bun run dev` di folder backend), lalu coba lagi.");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Terjadi kesalahan pada server");
  return json.data as T;
}
