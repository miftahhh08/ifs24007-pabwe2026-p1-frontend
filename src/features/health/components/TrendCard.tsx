"use client";

import { useEffect, useState } from "react";
import { IconFlame } from "@tabler/icons-react";
import { reportError } from "@/helpers/errorHelper";
import { getStats } from "@/features/logs/api/logApi";
import type { StatsData } from "@/types";

export default function TrendCard() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    getStats().then(setStats).catch((error: Error) => reportError(error));
  }, []);

  if (!stats) return null;
  const max = Math.max(stats.limit_g, ...stats.days.map((d) => d.sugar_g));

  return (
    <section className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-extrabold text-slate-900">Tren 7 hari</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800"><IconFlame size={14} /> {stats.streak} hari berturut-turut</span>
      </div>
      <div className="mt-4 flex h-32 items-end gap-2" role="img" aria-label="Grafik gula 7 hari">
        {stats.days.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <div title={`${d.sugar_g} g`} className={`w-full rounded-t-lg ${d.sugar_g > stats.limit_g ? "bg-red-500" : "bg-emerald-500"}`} style={{ height: `${(d.sugar_g / max) * 100}%`, minHeight: 2 }} />
            <span className="text-[10px] text-slate-500">{d.day.slice(8)}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">Batas anjuran {stats.limit_g} g per hari.</p>
    </section>
  );
}
