"use client";

import Link from "next/link";
import { IconHeartHandshake, IconShieldCheck } from "@tabler/icons-react";
import NavbarComponent from "./NavbarComponent";
import HelpBanner from "@/features/health/components/HelpBanner";

// Semua halaman dashboard dapat dibuka tanpa login (mode tamu).
// Pengguna yang ingin menyimpan data cukup memakai tautan "Masuk" di navbar.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6faf8] text-slate-900">
      <a href="#konten" className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-bold text-emerald-800 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Lewati ke konten</a>
      <NavbarComponent />
      <main id="konten" className="mx-auto min-h-[70vh] max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <HelpBanner />
        {children}
      </main>
      <footer className="border-t border-emerald-100 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <IconShieldCheck size={20} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">Informasi kesehatan yang bertanggung jawab</p>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm">
                GulaSadar adalah alat edukasi, bukan diagnosis medis. Angka kandungan gula merupakan estimasi dan dapat berbeda menurut bahan, merek, serta ukuran porsi. Konsultasikan kondisi kesehatanmu dengan tenaga kesehatan.
              </p>
            </div>
          </div>
          <p className="flex items-center gap-2 text-xs font-medium text-slate-500 sm:justify-end">
            <IconHeartHandshake size={16} className="text-emerald-700" /> <Link href="/bantuan" className="underline">Butuh bantuan?</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}