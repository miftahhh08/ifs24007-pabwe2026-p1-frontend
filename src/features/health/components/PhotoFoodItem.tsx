import { IconCheck, IconPlus } from "@tabler/icons-react";
import type { IdentifyResult } from "@/types";
import { MAX_SERVING, MIN_SERVING, toSpoons, totalSugar, trafficLightBadge } from "./photoIdentifyHelpers";

type FoodItem = IdentifyResult["foods"][number];

interface Props {
  food: FoodItem;
  servings: number;
  isAdded: boolean;
  onChangeServing: (foodId: string, delta: number) => void;
  onAdd: (foodId: string) => void;
}

/** Satu baris hasil identifikasi: nama, estimasi gula, pengatur porsi, dan tombol catat. */
export default function PhotoFoodItem({ food, servings, isAdded, onChangeServing, onAdd }: Props) {
  const sugar = totalSugar(food.sugar_g, servings);
  const spoons = toSpoons(sugar);
  const badge = trafficLightBadge(sugar);

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-extrabold text-slate-900 sm:text-base">
            {food.name}
          </h4>
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.className}`}>
            {badge.text}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Porsi standar: {food.portion} · {food.category}
        </p>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-black text-slate-900">{sugar} g</span>
          <span className="text-xs font-medium text-slate-500">
            gula (~{spoons} sdm gula pasir)
          </span>
        </div>
      </div>

      {/* Pengaturan Porsi & Tombol Catat (Heuristic 3 & 7: User control and efficiency) */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs font-bold text-slate-700">
          <button
            type="button"
            onClick={() => onChangeServing(food.id, -0.5)}
            disabled={servings <= MIN_SERVING}
            className="rounded-lg px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
            title="Kurangi porsi"
          >
            -
          </button>
          <span className="px-2">{servings} porsi</span>
          <button
            type="button"
            onClick={() => onChangeServing(food.id, 0.5)}
            disabled={servings >= MAX_SERVING}
            className="rounded-lg px-2 py-1 hover:bg-slate-100 disabled:opacity-40"
            title="Tambah porsi"
          >
            +
          </button>
        </div>

        <button
          type="button"
          disabled={isAdded}
          onClick={() => onAdd(food.id)}
          className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
            isAdded
              ? "bg-slate-200 text-slate-600 cursor-default"
              : "bg-emerald-700 text-white hover:bg-emerald-800 shadow-emerald-700/10"
          }`}
        >
          {isAdded ? (
            <>
              <IconCheck size={16} />
              <span>Tercatat</span>
            </>
          ) : (
            <>
              <IconPlus size={16} />
              <span>Catat Hari Ini</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
