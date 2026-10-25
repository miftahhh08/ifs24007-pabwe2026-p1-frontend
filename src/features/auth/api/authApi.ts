import { apiRequest } from "@/helpers/apiHelper";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types";

// Token tidak pernah sampai ke JavaScript: proxy menyimpannya sebagai cookie HttpOnly
// saat login/daftar dan menghapusnya saat logout.

export const registerApi = (input: RegisterInput) =>
  apiRequest<AuthResponse>("/api/auth/register", { method: "POST", body: input });

export const loginApi = (input: LoginInput) =>
  apiRequest<AuthResponse>("/api/auth/login", { method: "POST", body: input });

export async function getMeApi(): Promise<User> {
  const res = await apiRequest<{ user: User }>("/api/auth/me");
  return res.user;
}

export const logoutApi = () =>
  apiRequest<{ message: string }>("/api/auth/logout", { method: "POST" });
