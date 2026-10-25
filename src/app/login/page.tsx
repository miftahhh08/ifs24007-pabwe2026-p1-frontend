import { redirect } from "next/navigation";

/** Alamat lama `/login` dialihkan ke satu-satunya halaman masuk: `/auth/login`. */
export default function Page() {
  redirect("/auth/login");
}
