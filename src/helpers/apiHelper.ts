export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

// Token login disimpan server-side sebagai cookie HttpOnly (lihat /api/session) dan
// ditambahkan oleh /api/proxy. Di browser hanya ada penanda non-rahasia ini, supaya
// aplikasi tahu perlu memeriksa sesi tanpa melakukan request yang pasti gagal.
const SESSION_HINT_KEY = "gulasadar:session";

function setSessionHint(active: boolean): void {
  try {
    if (active) localStorage.setItem(SESSION_HINT_KEY, "1");
    else localStorage.removeItem(SESSION_HINT_KEY);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

export function hasAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SESSION_HINT_KEY) === "1";
  } catch {
    return false;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  if (typeof window === "undefined") return;
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("Gagal menyimpan sesi login");
  setSessionHint(true);
}

export async function removeAuthToken(): Promise<void> {
  if (typeof window === "undefined") return;
  setSessionHint(false);
  try {
    await fetch("/api/session", { method: "DELETE" });
  } catch {
    /* sesi di server akan kedaluwarsa dengan sendirinya */
  }
}

/**
 * Wrapper fetch ke REST API GulaSadar (Express) lewat /api/proxy.
 * Server mengembalikan { data } saat sukses dan { error } saat gagal.
 */
export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", query, body } = options;

  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined) params.set(key, String(value));
  });
  const qs = params.toString();
  const url = `/api/proxy${path}${qs ? `?${qs}` : ""}`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };

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
