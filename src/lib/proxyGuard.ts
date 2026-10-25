/**
 * Aturan keamanan untuk proxy `/api/proxy/*` ke backend GulaSadar.
 * Dipisahkan dari route handler agar mudah diuji dan tidak bercampur dengan I/O.
 */

/** Cookie sesi HttpOnly yang menyimpan token login. */
export const SESSION_COOKIE = "gulasadar_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

/** Nama header penanda request berasal dari aplikasi ini (pertahanan CSRF). */
export const CLIENT_HEADER = "x-requested-with";
export const CLIENT_HEADER_VALUE = "GulaSadar";

const SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;
const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE"]);

/** Endpoint backend yang menerbitkan token; tokennya disimpan sebagai cookie HttpOnly. */
export const TOKEN_ISSUING_PATHS = new Set(["api/auth/login", "api/auth/register"]);
export const LOGOUT_PATH = "api/auth/logout";

/**
 * Membangun path tujuan dari segmen URL. Hanya path di bawah `/api/` dengan segmen
 * alfanumerik yang diteruskan; segmen kosong, `.`/`..`, atau yang ter-encode ditolak
 * sehingga request tidak bisa keluar dari API backend (path traversal / SSRF).
 */
export function buildUpstreamPath(segments: string[]): string | null {
  if (segments.length < 2 || segments[0] !== "api") return null;
  if (!segments.every((segment) => SEGMENT_PATTERN.test(segment))) return null;
  return segments.join("/");
}

/**
 * Pertahanan CSRF untuk request yang mengubah data: wajib membawa header khusus
 * (tidak bisa dikirim lintas-situs tanpa preflight) dan, bila ada, `Origin` harus sama
 * dengan host aplikasi ini.
 */
export function isTrustedRequest(method: string, headers: Headers): boolean {
  if (!MUTATING_METHODS.has(method.toUpperCase())) return true;
  if (headers.get(CLIENT_HEADER) !== CLIENT_HEADER_VALUE) return false;

  const origin = headers.get("origin");
  if (!origin) return true;
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Cookie `Secure` hanya dipasang pada koneksi HTTPS agar tetap berfungsi di HTTP lokal. */
export function isSecureRequest(url: string, headers: Headers): boolean {
  const proto = headers.get("x-forwarded-proto") ?? new URL(url).protocol.replace(":", "");
  return proto === "https";
}

export interface IssuedSession {
  token: string;
  /** Isi respons tanpa token, aman dikirim ke JavaScript di browser. */
  body: string;
}

/** Mengambil token dari respons login/daftar dan menghapusnya dari isi respons. */
export function extractSessionToken(responseText: string): IssuedSession | null {
  try {
    const json = JSON.parse(responseText) as { data?: { token?: unknown } & Record<string, unknown> };
    const token = json.data?.token;
    if (typeof token !== "string" || token.length === 0 || !json.data) return null;
    const { token: _removed, ...data } = json.data;
    void _removed;
    return { token, body: JSON.stringify({ ...json, data }) };
  } catch {
    return null;
  }
}
