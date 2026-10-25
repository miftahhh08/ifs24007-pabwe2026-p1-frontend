"use client";

import { useEffect, useState } from "react";
import { IconBolt, IconPlus } from "@tabler/icons-react";
import { useAppDispatch } from "@/hooks/redux";
import { searchFoods } from "@/features/foods/api/foodApi";
import { asyncAddLog } from "@/features/logs/states/action";
import type { Food } from "@/types";

const POPULAR = ["es-teh-manis", "kopi-susu-gula-aren", "nasi-putih", "bakso", "air-putih", "pisang-goreng"];

/** Catat cepat 1 porsi dari makanan populer (heuristik 7: efisiensi penggunaan). */
export default function QuickAdd() {
  const dispatch = useAppDispatch();
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    searchFoods("")
      .then((all) => setFoods(POPULAR.map((id) => all.find((f) => f.id === id)).filter((f): f is Food => Boolean(f))))
      .catch(() => setFoods([]));
  }, []);

  if (foods.length === 0) return null;
  return (
    <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6" aria-label="Catat cepat">
      <h2 className="flex items-center gap-2 font-extrabold text-slate-900"><IconBolt size={20} className="text-amber-500" /> Catat cepat</h2>
      <p className="mt-1 text-sm text-slate-500">Tekan untuk mencatat 1 porsi. Bisa diurungkan setelahnya.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((f) => (
          <button key={f.id} onClick={() => dispatch(asyncAddLog(f.id, 1))}
            className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm transition hover:border-emerald-300 hover:bg-emerald-50">
            <span><strong className="block text-slate-800">{f.name}</strong><span className="text-xs text-slate-500">{f.sugar_g} g gula · {f.portion}</span></span>
            <IconPlus size={18} className="text-emerald-700" />
          </button>
        ))}
      </div>
    </section>
  );
}
