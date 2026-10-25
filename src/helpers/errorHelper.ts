import { showErrorDialog } from "@/helpers/toolsHelper";

/** Mengambil pesan yang aman ditampilkan dari nilai error apa pun. */
export function getErrorMessage(error: unknown, fallback = "Terjadi kesalahan"): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

/** Satu-satunya jalur menampilkan error ke pengguna, supaya penanganan error konsisten. */
export function reportError(error: unknown, fallback?: string): void {
  showErrorDialog(getErrorMessage(error, fallback));
}
