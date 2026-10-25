"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { IconX } from "@tabler/icons-react";

const KEY = "gulasadar:onboarded";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(KEY) !== "1";
  } catch {
    return true;
  }
}

export function getServerSnapshot(): boolean {
  return false;
}

/** Panduan singkat untuk pengguna baru (heuristik 10), muncul sekali dan bisa ditutup. */
export default function HelpBanner() {
  const isNew = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [closed, setClosed] = useState(false);

  function close() {
    setClosed(true);
    try { localStorage.setItem(KEY, "1"); } catch { /* penyimpanan tidak tersedia */ }
  }

  if (closed || !isNew) return null;
  return (
    <section className="fixed inset-x-4 bottom-4 z-30 max-w-md rounded-3xl border border-emerald-200 bg-emerald-50 p-5 pr-12 text-emerald-950 shadow-xl sm:left-auto sm:right-6 sm:bottom-6" aria-label="Panduan singkat">
      <button onClick={close} aria-label="Tutup panduan" className="absolute right-3 top-3 rounded-lg p-1.5 text-emerald-800 hover:bg-emerald-100"><IconX size={18} /></button>
      <h2 className="font-extrabold">Selamat datang di GulaSadar 👋</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
        <li><strong>Cari makanan</strong> lalu tekan Catat untuk mencatat gula harianmu.</li>
        <li>Pantau jatah <strong>50 g per hari</strong> dan tren 7 hari di Beranda.</li>
        <li>Tanyakan apa saja soal gula ke <strong>Sobat Gula</strong>.</li>
      </ol>
      <div className="mt-3 flex flex-wrap gap-4 text-sm font-bold">
        <button onClick={close} className="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">Mengerti</button>
        <Link href="/bantuan" onClick={close} className="self-center underline">Lihat panduan lengkap</Link>
      </div>
    </section>
  );
}
