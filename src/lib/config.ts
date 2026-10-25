/**
 * Alamat backend GulaSadar. Hanya dipakai di sisi server (proxy `/api/proxy`):
 * browser selalu memanggil aplikasi ini sendiri, bukan backend secara langsung.
 * `GULASADAR_API_URL` (runtime) diutamakan; `NEXT_PUBLIC_GULASADAR_BASEURL` dipertahankan
 * sebagai cadangan agar konfigurasi lama tetap berfungsi.
 */
export const BASE_URL: string =
  process.env.GULASADAR_API_URL ||
  process.env.NEXT_PUBLIC_GULASADAR_BASEURL ||
  "http://127.0.0.1:4000";

export const APP_PORT: number = Number(process.env.APP_PORT) || 3000;
