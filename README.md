# GulaSadar Frontend

Antarmuka web aplikasi edukasi pencegahan diabetes **GulaSadar** (Kenali gula di piringmu).
Repo backend (wajib berjalan): *(isi link repo backend di sini)*

## Teknologi
Next.js (App Router), TypeScript, Redux Toolkit, Tailwind CSS. Pengujian memakai Vitest dan Testing Library.

## Menjalankan secara lokal
Pastikan [Bun](https://bun.sh) terpasang dan **backend sudah berjalan** di `http://localhost:4000`.
```bash
git clone <URL-REPO-FRONTEND>
cd gulasadar-frontend
cp .env.example .env      # Windows PowerShell: copy .env.example .env
bun install
bun run test
bun run dev
```
Buka `http://localhost:3000`.

## Konfigurasi
| Variabel | Fungsi |
|---|---|
| `NEXT_PUBLIC_GULASADAR_BASEURL` | Alamat API backend (default `http://127.0.0.1:4000`). Dibaca saat **build**, jadi ubah lalu build ulang untuk deployment. |
| `APP_PORT` | Port aplikasi (default 3000) |

## Halaman
`/auth/login` Masuk/Daftar · `/` Beranda · `/makanan` Cari makanan · `/label` Hitung dari label · `/risiko` Cek risiko · `/gula-darah` Catatan gula darah · `/sobat-gula` Chatbot · `/bantuan` Panduan dan FAQ

## Deploy dengan Docker
```bash
PUBLIC_API_URL=https://URL-BACKEND docker compose up -d --build
```
Pastikan backend mengizinkan origin frontend lewat `CORS_ORIGIN`.

## CI
`Jenkinsfile` menjalankan: install Bun, install dependency, test (coverage minimal 90%), build, lalu (cabang `main`) deploy.

> GulaSadar bersifat edukatif dan bukan alat diagnosis medis.
