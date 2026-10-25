import { BASE_URL } from "@/lib/config";

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

const TOKEN_KEY = "gulasadar:token";
const TOKEN_COOKIE = "gulasadar_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

// Token disimpan di localStorage DAN cookie. Cookie dipertahankan saat browser
// dibuka ulang / storage direset (mis. oleh alat audit seperti Lighthouse),
// sehingga sesi login tetap terbaca di halaman terproteksi.
function readCookie(): string | null {
  try {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${TOKEN_COOKIE}=`));
    return match ? decodeURIComponent(match.slice(TOKEN_COOKIE.length + 1)) : null;
  } catch {
    return null;
  }
}

function writeCookie(token: string | null): void {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    if (token === null) {
      document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
    } else {
      document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
    }
  } catch {
    /* cookie tidak tersedia */
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const fromStorage = localStorage.getItem(TOKEN_KEY);
    if (fromStorage) return fromStorage;
  } catch {
    /* lanjut ke cookie */
  }
  return readCookie();
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  writeCookie(token);
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* penyimpanan tidak tersedia */
  }
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  writeCookie(null);
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
