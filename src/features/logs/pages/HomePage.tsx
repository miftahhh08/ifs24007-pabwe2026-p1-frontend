"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  IconArrowRight,
  IconBook2,
  IconClockHour4,
  IconDroplet,
  IconLeaf,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { formatTime } from "@/helpers/toolsHelper";
import { asyncDeleteLog, asyncSetToday } from "../states/action";

export function barColor(percent: number): string {
  if (percent < 60) return "bg-emerald-500";
  if (percent < 100) return "bg-amber-500";
  return "bg-red-500";
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const today = useAppSelector((state) => state.today);
  const isToday = useAppSelector((state) => state.isToday);

  useEffect(() => {
    dispatch(asyncSetToday());
  }, [dispatch]);

  if (!today) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <IconDroplet size={28} />
        </span>
        {isToday ? (
          <p className="text-sm text-slate-600">Memuat data...</p>
        ) : (
          <>
            <h1 className="text-xl font-bold text-slate-900">Data belum dapat dimuat</h1>
            <p className="mb-5 mt-2 text-sm text-slate-500">Pastikan backend GulaSadar sedang berjalan, lalu coba lagi.</p>
            <button
              onClick={() => dispatch(asyncSetToday())}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Coba lagi
            </button>
          </>
        )}
      </div>
    );
  }

  const remaining = Math.max(today.limit_g - today.total_sugar_g, 0);
  const progressWidth = Math.min(today.percent, 100);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 px-6 py-7 text-white shadow-xl shadow-emerald-900/10 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-64 w-64 rounded-full border-[36px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-28 -z-10 h-52 w-52 rounded-full bg-teal-400/20 blur-2xl" />
        <div className="relative max-w-2xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-50">
            <IconSparkles size={15} /> Ruang kecil untuk kebiasaan yang lebih baik
          </span>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Kenali gula di piringmu.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">
            Catat makanan, kenali perkiraan kandungan gula, dan bangun kebiasaan memilih dengan lebih sadar—satu langkah setiap hari.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/makanan" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50">
              <IconPlus size={18} /> Catat konsumsi <IconArrowRight size={16} />
            </Link>
            <Link href="/sobat-gula" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              <IconSparkles size={18} /> Tanya Sobat Gula
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">Ringkasan konsumsi hari ini</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">Pantau jatah gula harianmu</h2>
            </div>
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><IconDroplet size={24} /></span>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Total tercatat</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900">{today.total_sugar_g}</span>
                <span className="text-lg font-bold text-slate-500">gram</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">dari {today.limit_g} g sebagai batas acuan aplikasi</p>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-700">Pemakaian acuan</span>
                <span className={`font-extrabold ${today.percent >= 100 ? "text-red-600" : today.percent >= 60 ? "text-amber-600" : "text-emerald-700"}`}>{today.percent}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Pemakaian acuan gula harian" aria-valuenow={progressWidth} aria-valuemin={0} aria-valuemax={100}>
                <div className={`h-full rounded-full transition-all duration-500 ${barColor(today.percent)}`} style={{ width: `${progressWidth}%` }} />
              </div>
              <p className="mt-3 text-sm leading-5 text-slate-600">
                {today.percent >= 100
                  ? "Batas anjuran hari ini sudah terlampaui."
                  : `${today.percent}% dari batas anjuran harian terpakai.`}
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                <IconLeaf size={18} className="shrink-0 text-emerald-700" />
                <span className="text-slate-600">{remaining > 0 ? `Sisa terhadap acuan: ${remaining} g` : "Kamu sudah mencapai atau melewati acuan hari ini"}</span>
              </div>
            </div>
          </div>
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">Angka merupakan estimasi dari makanan yang tercatat. Acuan di aplikasi bukan target pribadi atau pengganti saran tenaga kesehatan.</p>
        </div>

        <div className="flex flex-col rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm sm:p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm"><IconBook2 size={24} /></span>
          <h2 className="mt-4 text-lg font-extrabold text-slate-900">Kenali sebelum memilih</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Kandungan gula bisa berbeda karena ukuran porsi, resep, dan merek. Gunakan estimasi sebagai titik awal untuk lebih memperhatikan pilihan sehari-hari.</p>
          <div className="mt-5 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-white bg-white/80 p-3">
              <span className="mt-0.5 rounded-lg bg-emerald-100 p-1.5 text-emerald-700"><IconSearch size={17} /></span>
              <div><p className="text-sm font-bold text-slate-800">Cari makanan</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Lihat estimasi gula per porsi.</p></div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white bg-white/80 p-3">
              <span className="mt-0.5 rounded-lg bg-teal-100 p-1.5 text-teal-700"><IconClockHour4 size={17} /></span>
              <div><p className="text-sm font-bold text-slate-800">Catat secara konsisten</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Riwayat membantu melihat kebiasaanmu.</p></div>
            </div>
          </div>
          <Link href="/makanan" className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-emerald-800 hover:text-emerald-950">Mulai dari pencarian makanan <IconArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Aktivitasmu</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">Catatan hari ini</h2>
          </div>
          <Link href="/makanan" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"><IconPlus size={17} /> Tambah catatan</Link>
        </div>
        {today.logs.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-5 py-9 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm"><IconBook2 size={23} /></span>
            <p className="mt-3 font-bold text-slate-800">Belum ada catatan</p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-slate-500">Mulai dengan mencari makanan atau minuman yang kamu konsumsi hari ini.</p>
            <Link href="/makanan" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800">Cari makanan <IconArrowRight size={16} /></Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-slate-100">
            {today.logs.map((log) => (
              <li key={log.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><IconDroplet size={21} /></span>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800">{log.name} <span className="font-medium text-slate-400">×{log.servings}</span></p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><IconClockHour4 size={14} /> {formatTime(log.eaten_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-base font-extrabold text-slate-800">{log.sugar_g} <span className="text-xs font-semibold text-slate-500">g gula</span></span>
                  <button aria-label={`Hapus ${log.name}`} onClick={() => dispatch(asyncDeleteLog(log.id))} className="rounded-xl border border-slate-200 p-2.5 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><IconTrash size={17} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><IconShieldCheck size={22} /></span>
          <div><h2 className="font-extrabold text-slate-900">Satu catatan, satu langkah belajar</h2><p className="mt-1 max-w-2xl text-sm leading-5 text-slate-500">GulaSadar membantu edukasi dan pencatatan. Aplikasi ini tidak mendiagnosis diabetes atau menentukan kebutuhan medis pribadi.</p></div>
        </div>
        <Link href="/makanan" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">Jelajahi makanan <IconArrowRight size={16} /></Link>
      </section>
    </div>
  );
}
