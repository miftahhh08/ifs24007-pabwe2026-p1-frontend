"use client";

import { IconPlus, IconDroplet } from "@tabler/icons-react";
import { useInput } from "@/hooks/useInput";
import type { Food, TrafficLight } from "@/types";

const BADGE: Record<TrafficLight, { label: string; className: string; dot: string }> = {
  hijau: { label: "Rendah", className: "border-emerald-200 bg-emerald-50 text-emerald-800", dot: "bg-emerald-500" },
  kuning: { label: "Sedang", className: "border-amber-200 bg-amber-50 text-amber-800", dot: "bg-amber-500" },
  merah: { label: "Tinggi", className: "border-red-200 bg-red-50 text-red-800", dot: "bg-red-500" },
};

interface Props {
  food: Food;
  onAdd: (foodId: string, servings: number) => void;
}

export default function FoodCard({ food, onAdd }: Props) {
  const [servings, onServingsChange] = useInput("1");
  const badge = BADGE[food.light];

  return (
    <li className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <IconDroplet size={23} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-extrabold text-slate-900">{food.name}</p>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${badge.className}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />{badge.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">Takaran acuan: {food.portion}</p>
          <p className="mt-2 flex items-baseline gap-1 text-sm text-slate-600">Estimasi gula <strong className="text-lg font-extrabold text-slate-900">{food.sugar_g} g</strong><span className="text-xs">per porsi</span></p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-2 sm:justify-end">
        <label className="pl-2 text-xs font-semibold text-slate-500" htmlFor={`servings-${food.id}`}>Jumlah porsi</label>
        <input
          id={`servings-${food.id}`}
          aria-label={`Jumlah porsi ${food.name}`}
          type="number"
          min="0.5"
          max="10"
          step="0.5"
          value={servings}
          onChange={onServingsChange}
          className="w-20 rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
        <button
          onClick={() => onAdd(food.id, Number(servings))}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 active:scale-[0.98]"
        >
          <IconPlus size={16} /> Catat
        </button>
      </div>
    </li>
  );
}
