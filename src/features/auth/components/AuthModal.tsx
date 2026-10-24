"use client";

import { useEffect, useState } from "react";
import { IconLock, IconMail, IconUser, IconX } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLogin, asyncRegister } from "../states/action";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.isAuthLoading);

  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);


  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

    if (tab === "register") {
      const cleanName = name.trim();
      if (cleanName.length < 2 || cleanName.length > 100) {
        setFormError("Nama lengkap wajib diisi (2-100 karakter)");
        return;
      }
      dispatch(
        asyncRegister({ name: cleanName, email: cleanEmail, password }, () => {
          onClose();
        })
      );
    } else {
      dispatch(
        asyncLogin({ email: cleanEmail, password }, () => {
          onClose();
        })
      );
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup formulir masuk"
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <IconX size={20} />
        </button>

        <h2 id="auth-modal-title" className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
          {tab === "login" ? "Masuk ke GulaSadar" : "Daftar Akun Baru"}
        </h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          {tab === "login"
            ? "Masuk untuk menyimpan catatan konsumsi dan gula darahmu di cloud."
            : "Buat akun untuk memantau asupan gula harianmu secara personal."}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setFormError(null);
            }}
            className={`rounded-xl py-2 transition ${
              tab === "login" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setFormError(null);
            }}
            className={`rounded-xl py-2 transition ${
              tab === "register" ? "bg-white text-emerald-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Daftar
          </button>
        </div>

        {formError && (
          <div role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          {tab === "register" && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <IconUser size={18} />
                </span>
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkapmu"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 mb-1.5">
              Alamat Email
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <IconMail size={18} />
              </span>
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <IconLock size={18} />
              </span>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-emerald-700 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : tab === "login" ? "Masuk Sekarang" : "Buat Akun"}
          </button>
        </form>
      </div>
    </div>
  );
}
