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
import { hasAuthSession } from "@/helpers/apiHelper";
import { disableGuestMode, enableGuestMode } from "@/helpers/guestMode";
import { asyncLogin, asyncRegister } from "../states/action";
import { validateAuthForm } from "../validation";
import LoginIllustration from "../components/LoginIllustration";
import AuthTextField from "../components/AuthTextField";

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
    if (authUser || hasAuthSession()) {
      router.push("/");
    }
  }, [authUser, router]);

  function onAuthSuccess() {
    disableGuestMode();
    router.push("/");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const errorMessage = validateAuthForm(mode, { name, email, password });
    if (errorMessage) {
      setFormError(errorMessage);
      return;
    }
    const cleanEmail = email.trim();
    const cleanName = name.trim();

    if (mode === "register") {
      dispatch(
        asyncRegister({ name: cleanName, email: cleanEmail, password }, onAuthSuccess)
      );
    } else {
      dispatch(
        asyncLogin({ email: cleanEmail, password }, onAuthSuccess)
      );
    }
  }

  function handleGuestMode() {
    enableGuestMode();
    router.push("/");
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#eef7f2] font-sans">
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
              <LoginIllustration />
            </div>

            <p className="mt-4 max-w-md text-center text-xs font-medium text-emerald-900 sm:text-sm">
              Pantau jatah <strong>50 gram gula/hari</strong>, pelajari label makanan, dan bangun kebiasaan sehat langkah demi langkah.
            </p>
          </div>

          <footer className="relative z-10 text-xs text-emerald-900/80">
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
              <p className="mt-2 text-xs text-emerald-100 sm:text-sm">
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
                    : "text-emerald-100 hover:text-white"
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
                    : "text-emerald-100 hover:text-white"
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
                <AuthTextField
                  id="login-name"
                  label="Nama Lengkap"
                  icon={IconUser}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkapmu"
                />
              )}

              <AuthTextField
                id="username"
                name="username"
                label="Email"
                icon={IconMail}
                autoComplete="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
              />

              <AuthTextField
                id="password"
                name="password"
                label="Password"
                icon={IconLock}
                autoComplete="current-password"
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
              />

              {/* Tombol Aksi Pil */}
              <button
                type="submit"
                id="btn-submit"
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
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 hover:text-white transition"
              >
                <IconUserCheck size={16} />
                <span>Lanjutkan sebagai Tamu (Mode Offline)</span>
                <IconArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
