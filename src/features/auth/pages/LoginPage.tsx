"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowRight,
  IconDroplet,
  IconLock,
  IconMail,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getAuthToken } from "@/helpers/apiHelper";
import { asyncLogin, asyncRegister } from "../states/action";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser);
  const isLoading = useAppSelector((state) => state.isAuthLoading);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (authUser || getAuthToken()) {
      router.push("/");
    }
  }, [authUser, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setFormError("Format email tidak valid");
      return;
    }
    if (!password || password.length < 6) {
      setFormError("Kata sandi minimal 6 karakter");
      return;
    }

    if (mode === "register") {
      const cleanName = name.trim();
      if (cleanName.length < 2 || cleanName.length > 100) {
        setFormError("Nama lengkap wajib diisi (2-100 karakter)");
        return;
      }
      dispatch(
        asyncRegister({ name: cleanName, email: cleanEmail, password }, () => {
          try {
            localStorage.removeItem("gulasadar:guest");
          } catch {}
          router.push("/");
        })
      );
    } else {
      dispatch(
        asyncLogin({ email: cleanEmail, password }, () => {
          try {
            localStorage.removeItem("gulasadar:guest");
          } catch {}
          router.push("/");
        })
      );
    }
  }

  function handleGuestMode() {
    try {
      localStorage.setItem("gulasadar:guest", "true");
    } catch {}
    router.push("/");
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#eef7f2] font-sans">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        {/* SISI KIRI: Ilustrasi Belanja Makanan Sehat, Wave Organik, & Elemen Bergerak */}
        <section className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-10 lg:col-span-7 lg:p-12">
          {/* Gelembung Bergerak (Floating Bubbles) */}
          <div className="pointer-events-none absolute left-12 top-20 h-16 w-16 rounded-full bg-emerald-200/50 blur-[1px] animate-bubble-1" />
          <div className="pointer-events-none absolute bottom-36 left-1/4 h-24 w-24 rounded-full bg-teal-200/40 blur-[2px] animate-bubble-2" />
          <div className="pointer-events-none absolute right-20 top-1/4 h-14 w-14 rounded-full bg-emerald-300/30 blur-[1px] animate-bubble-3" />
          <div className="pointer-events-none absolute bottom-12 right-1/3 h-20 w-20 rounded-full bg-emerald-100/60 blur-[2px] animate-bubble-1" />

          {/* Header Brand */}
          <header className="relative z-10 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-700/25">
              <IconDroplet size={28} stroke={2.4} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-emerald-950 sm:text-2xl">
                GulaSadar
              </h1>
              <p className="text-xs font-semibold text-emerald-700">Kenali gula di piringmu</p>
            </div>
          </header>

          {/* Area Ilustrasi Utama (Tas Belanja, Makanan Sehat, Gerobak, Indikator Gula) */}
          <div className="relative my-auto flex flex-col items-center justify-center py-8">
            {/* Blob Organik Berlapis di Belakang Ilustrasi */}
            <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl sm:h-96 sm:w-96 animate-pulse-glow" />
            <div className="pointer-events-none absolute h-64 w-80 rounded-[40%_60%_70%_30%] bg-teal-300/30 blur-2xl animate-float-reverse" />

            {/* Ilustrasi Makanan & Kantong Belanja Bergerak */}
            <div className="relative z-10 w-full max-w-md animate-float-slow">
              <svg viewBox="0 0 500 400" className="w-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Latar Belakang Blob Hijau */}
                <path
                  d="M120 220C90 140 180 80 260 90C340 100 420 160 400 240C380 320 280 360 200 340C130 320 140 270 120 220Z"
                  fill="#78B998"
                  opacity="0.35"
                />
                <path
                  d="M140 240C110 170 190 120 260 130C330 140 380 190 370 250C360 310 270 340 210 330C160 320 160 280 140 240Z"
                  fill="#A2D6BC"
                  opacity="0.5"
                />

                {/* Kantong Belanja Kertas */}
                <rect x="180" y="180" width="140" height="150" rx="12" fill="#E2BA87" />
                <path d="M180 180L190 200H310L320 180H180Z" fill="#D3A871" />
                <path d="M250 180V330" stroke="#D3A871" strokeWidth="2" strokeDasharray="4 4" />

                {/* Semangka */}
                <g transform="translate(300, 240)">
                  <path d="M0 60C33 60 60 33 60 0H0V60Z" fill="#2E7D32" />
                  <path d="M4 56C30 56 56 30 56 4H4V56Z" fill="#E53935" />
                  <circle cx="18" cy="20" r="2" fill="#212121" />
                  <circle cx="28" cy="35" r="2" fill="#212121" />
                  <circle cx="38" cy="18" r="2" fill="#212121" />
                  <circle cx="22" cy="40" r="2" fill="#212121" />
                </g>

                {/* Apel Segar */}
                <circle cx="310" cy="320" r="16" fill="#D32F2F" />
                <path d="M310 304C310 298 314 294 316 292" stroke="#5D4037" strokeWidth="2" strokeLinecap="round" />
                <path d="M316 294C322 294 326 298 326 298" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" />

                {/* Botol Susu Rendah Gula */}
                <rect x="150" y="240" width="28" height="65" rx="5" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="2" />
                <rect x="155" y="230" width="18" height="10" rx="2" fill="#0288D1" />
                <rect x="154" y="260" width="20" height="20" rx="3" fill="#E1F5FE" />

                {/* Pisang */}
                <path d="M290 325C310 325 330 310 340 295" stroke="#FBC02D" strokeWidth="9" strokeLinecap="round" />
                <path d="M285 335C305 335 325 320 335 305" stroke="#FBC02D" strokeWidth="8" strokeLinecap="round" />

                {/* Baguette & Sayuran dalam Kantong */}
                <path d="M200 130L220 200" stroke="#D7A15C" strokeWidth="22" strokeLinecap="round" />
                <path d="M230 140L245 200" stroke="#4CAF50" strokeWidth="18" strokeLinecap="round" />
                <path d="M270 135L260 200" stroke="#FF7043" strokeWidth="16" strokeLinecap="round" />

                {/* Pria dengan Keranjang Belanja */}
                <g transform="translate(60, 240)">
                  {/* Kepala */}
                  <circle cx="50" cy="25" r="10" fill="#F8BBD0" />
                  <path d="M44 20C44 14 56 14 56 20" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
                  {/* Badan (Baju Biru) */}
                  <path d="M42 35C42 35 45 65 45 75H55C55 65 58 35 58 35Z" fill="#1976D2" />
                  {/* Celana */}
                  <path d="M45 75L35 125M55 75L62 125" stroke="#263238" strokeWidth="6" strokeLinecap="round" />
                  {/* Sepatu Merah */}
                  <ellipse cx="30" cy="127" rx="8" ry="4" fill="#D32F2F" />
                  <ellipse cx="67" cy="127" rx="8" ry="4" fill="#D32F2F" />
                  {/* Lengan Mendorong */}
                  <path d="M46 42L75 60" stroke="#1976D2" strokeWidth="5" strokeLinecap="round" />

                  {/* Keranjang Belanja Beroda */}
                  <g transform="translate(70, 45)">
                    {/* Gagang */}
                    <path d="M5 15L15 25H60L50 65H15L10 15Z" fill="none" stroke="#607D8B" strokeWidth="3" strokeLinejoin="round" />
                    <line x1="20" y1="35" x2="55" y2="35" stroke="#90A4AE" strokeWidth="2" />
                    <line x1="18" y1="50" x2="48" y2="50" stroke="#90A4AE" strokeWidth="2" />
                    {/* Isi Keranjang */}
                    <circle cx="28" cy="30" r="7" fill="#E53935" />
                    <rect x="36" y="22" width="10" height="15" rx="2" fill="#FFA000" />
                    <circle cx="48" cy="28" r="6" fill="#43A047" />
                    {/* Kaki & Roda */}
                    <line x1="20" y1="65" x2="20" y2="78" stroke="#607D8B" strokeWidth="3" />
                    <line x1="45" y1="65" x2="45" y2="78" stroke="#607D8B" strokeWidth="3" />
                    <circle cx="20" cy="80" r="4" fill="#37474F" />
                    <circle cx="45" cy="80" r="4" fill="#37474F" />
                  </g>
                </g>

                {/* Badge Indikator Gula Hijau */}
                <g transform="translate(195, 80)" className="animate-bounce" style={{ animationDuration: "3s" }}>
                  <rect width="110" height="30" rx="15" fill="#047857" />
                  <circle cx="16" cy="15" r="6" fill="#10B981" />
                  <text x="32" y="19" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                    Pilih Sadar Gula
                  </text>
                </g>
              </svg>
            </div>

            <p className="mt-4 max-w-md text-center text-xs font-medium text-emerald-800/80 sm:text-sm">
              Pantau jatah <strong>50 gram gula/hari</strong>, pelajari label makanan, dan bangun kebiasaan sehat langkah demi langkah.
            </p>
          </div>

          <footer className="relative z-10 text-xs text-emerald-900/60">
            © 2026 GulaSadar · Edukasi Pencegahan Diabetes
          </footer>
        </section>

        {/* SISI KANAN: Panel Form LOGIN / REGISTER Berwarna Hijau Tua Pekat */}
        <section className="relative flex flex-col justify-center bg-[#0a3525] px-6 py-10 sm:px-12 lg:col-span-5 lg:px-14">
          {/* Gelombang Masking Halus di Sisi Kiri Panel Hijau */}
          <div className="pointer-events-none absolute -left-8 top-0 hidden h-full w-10 text-[#0a3525] lg:block">
            <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="h-full w-full fill-current">
              <path d="M40 0C25 150 0 250 15 450C30 650 5 800 40 1000V0Z" />
            </svg>
          </div>

          <div className="mx-auto w-full max-w-sm">
            {/* Judul Besar Form */}
            <div className="text-center sm:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-400">
                Selamat Datang
              </span>
              <h2 className="mt-1 text-3xl font-black uppercase tracking-wider text-white sm:text-4xl">
                {mode === "login" ? "LOGIN" : "DAFTAR"}
              </h2>
              <p className="mt-2 text-xs text-emerald-200/70 sm:text-sm">
                {mode === "login"
                  ? "Masuk ke akunmu untuk memantau asupan gula harian."
                  : "Buat akun baru untuk mulai perjalanan hidup sadar gula."}
              </p>
            </div>

            {/* Tab Switcher Masuk / Daftar */}
            <div className="mt-6 flex rounded-full bg-[#124230] p-1 text-xs font-bold text-white shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setFormError(null);
                }}
                className={`flex-1 rounded-full py-2.5 transition ${
                  mode === "login"
                    ? "bg-[#276a52] text-white shadow-md"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setFormError(null);
                }}
                className={`flex-1 rounded-full py-2.5 transition ${
                  mode === "register"
                    ? "bg-[#276a52] text-white shadow-md"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                Daftar
              </button>
            </div>

            {/* Alert Error Validasi */}
            {formError && (
              <div role="alert" className="mt-4 rounded-2xl bg-red-950/80 p-3 text-xs font-semibold text-red-200 border border-red-800">
                {formError}
              </div>
            )}

            {/* Formulir Input Pil Sesuai Desain Gambar */}
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {mode === "register" && (
                <div>
                  <label htmlFor="login-name" className="block text-xs font-semibold text-emerald-200/90 mb-1 pl-3">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-300/80">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#124230]">
                        <IconUser size={16} />
                      </span>
                    </span>
                    <input
                      id="login-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkapmu"
                      className="w-full rounded-full border border-emerald-600/30 bg-[#164634] py-3.5 pl-14 pr-5 text-sm text-white placeholder-emerald-300/40 outline-none transition focus:border-emerald-400 focus:bg-[#1a513c] focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="block text-xs font-semibold text-emerald-200/90 mb-1 pl-3">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-300/80">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#124230]">
                      <IconMail size={16} />
                    </span>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-full border border-emerald-600/30 bg-[#164634] py-3.5 pl-14 pr-5 text-sm text-white placeholder-emerald-300/40 outline-none transition focus:border-emerald-400 focus:bg-[#1a513c] focus:ring-4 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-emerald-200/90 mb-1 pl-3">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-300/80">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#124230]">
                      <IconLock size={16} />
                    </span>
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-full border border-emerald-600/30 bg-[#164634] py-3.5 pl-14 pr-5 text-sm text-white placeholder-emerald-300/40 outline-none transition focus:border-emerald-400 focus:bg-[#1a513c] focus:ring-4 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Tombol Aksi Pil */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full rounded-full bg-[#276a52] py-4 text-sm font-extrabold uppercase tracking-widest text-white shadow-xl shadow-emerald-950/40 transition hover:bg-[#318063] hover:shadow-2xl active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? "MEMPROSES..." : mode === "login" ? "LOGIN" : "DAFTAR SEKARANG"}
              </button>
            </form>

            {/* Opsi Lewati / Tamu */}
            <div className="mt-6 flex flex-col items-center gap-3 border-t border-emerald-800/60 pt-5 text-center">
              <button
                type="button"
                onClick={handleGuestMode}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300/80 hover:text-white transition"
              >
                <IconUserCheck size={16} />
                <span>Lanjutkan sebagai Tamu (Mode Offline)</span>
                <IconArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
