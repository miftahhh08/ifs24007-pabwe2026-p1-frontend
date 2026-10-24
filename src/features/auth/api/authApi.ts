import { apiRequest, removeAuthToken, setAuthToken } from "@/helpers/apiHelper";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types";

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: input,
  });
  if (res.token) {
    setAuthToken(res.token);
  }
  return res;
}

export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: input,
  });
  if (res.token) {
    setAuthToken(res.token);
  }
  return res;
}

export async function getMeApi(): Promise<User> {
  const res = await apiRequest<{ user: User }>("/api/auth/me");
  return res.user;
}

export async function logoutApi(): Promise<{ message: string }> {
  try {
    const res = await apiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
    return res;
  } finally {
    removeAuthToken();
  }
}
