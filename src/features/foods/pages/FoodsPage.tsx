"use client";

import { useEffect, useRef } from "react";
import { IconSearch, IconDroplet, IconInfoCircle, IconLeaf } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useInput } from "@/hooks/useInput";
import { asyncAddLog } from "@/features/logs/states/action";
import { asyncSetFoods } from "../states/action";
import FoodCard from "../components/FoodCard";

export default function FoodsPage() {
  const dispatch = useAppDispatch();
  const foods = useAppSelector((state) => state.foods);
  const isFoods = useAppSelector((state) => state.isFoods);
  const [q, onQChange, setQ] = useInput("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "SELECT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => dispatch(asyncSetFoods(q)), 300);
    return () => clearTimeout(timer);
  }, [q, dispatch]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-800 via-emerald-700 to-emerald-600 px-6 py-7 text-white shadow-xl shadow-emerald-900/10 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-10 -top-12 -z-10 h-56 w-56 rounded-full border-[30px] border-white/10" />
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold"><IconLeaf size={15} /> Kenali sebelum memilih</span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Cari makanan</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">Temukan makanan atau minuman, lihat estimasi kandungan gulanya, lalu catat porsi yang kamu konsumsi.</p>
        <div className="mt-6 flex items-center gap-2 text-xs text-emerald-50 sm:text-sm"><IconDroplet size={17} /> Nilai berdasarkan data makanan yang tersedia di GulaSadar.</div>
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
        <label htmlFor="food-search" className="mb-2 block text-sm font-bold text-slate-800">Makanan atau minuman apa yang ingin kamu cari?</label>
        <div className="relative">
          <IconSearch size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="food-search"
            ref={inputRef}
            aria-label="Cari makanan"
            placeholder="Contoh: es teh, martabak, bakso (tekan / untuk mencari)"
            value={q}
            onChange={onQChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="font-semibold text-slate-600">Ide pencarian:</span>{["es teh", "soda", "pisang", "martabak"].map((term) => <button key={term} type="button" onClick={() => setQ(term)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">{term}</button>)}</div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div><h2 className="font-extrabold text-slate-900">Hasil pencarian</h2><p className="mt-1 text-xs text-slate-500">Estimasi per porsi yang tercantum.</p></div>
          {!isFoods && <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{foods.length} hasil</span>}
        </div>
        <div className="px-5 sm:px-6">
          {isFoods && <p className="py-8 text-center text-sm text-slate-500">Mencari...</p>}
          {!isFoods && foods.length === 0 && (
            <div className="py-12 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><IconSearch size={23} /></span>
              <p className="mt-3 font-bold text-slate-800">Makanan tidak ditemukan.</p>
              <p className="mt-1 text-sm text-slate-500">Coba kata kunci lain atau gunakan nama makanan yang lebih umum.</p>
            </div>
          )}
          <ul className="divide-y divide-slate-100">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} onAdd={(id, n) => dispatch(asyncAddLog(id, n))} />
            ))}
          </ul>
        </div>
      </section>

      <aside className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-sm leading-5 text-sky-950">
        <IconInfoCircle size={20} className="mt-0.5 shrink-0 text-sky-700" />
        <p><strong>Catatan:</strong> kandungan gula dapat berbeda menurut resep, ukuran porsi, dan merek. Data di aplikasi adalah perkiraan untuk edukasi, bukan pengukuran laboratorium atau saran medis.</p>
      </aside>
    </div>
  );
}
