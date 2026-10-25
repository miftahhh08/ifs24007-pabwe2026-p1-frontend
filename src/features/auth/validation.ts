export type AuthMode = "login" | "register";

export interface AuthFormValues {
  name: string;
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validasi bersama untuk formulir masuk/daftar. Mengembalikan pesan error, atau null jika valid. */
export function validateAuthForm(mode: AuthMode, { name, email, password }: AuthFormValues): string | null {
  if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) return "Format email tidak valid";
  if (!password || password.length < 6) return "Kata sandi minimal 6 karakter";
  if (mode === "register") {
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 100) return "Nama lengkap wajib diisi (2-100 karakter)";
  }
  return null;
}
