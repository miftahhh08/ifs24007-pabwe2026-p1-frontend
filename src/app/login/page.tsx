import type { Metadata } from "next";
import LoginPage from "@/features/auth/pages/LoginPage";

export const metadata: Metadata = {
  title: "Masuk / Daftar - GulaSadar",
  description: "Masuk ke akun GulaSadar untuk memantau asupan gula harianmu secara aman.",
};

export default function Page() {
  return <LoginPage />;
}
