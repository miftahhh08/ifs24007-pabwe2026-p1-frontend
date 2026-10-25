"use client";

import { useState } from "react";
import Link from "next/link";
import { IconTag, IconRefresh } from "@tabler/icons-react";
import { reportError } from "@/helpers/errorHelper";
import type { LabelResult } from "@/types";
import { calcLabel } from "../api/healthApi";
import { validateLabel } from "../validation";
import PageHero, { Field, btnClass, cardClass } from "../components/PageHero";

const LIGHT = {
  hijau: ["Rendah", "bg-emerald-50 text-emerald-800 border-emerald-200"],
  kuning: ["Sedang", "bg-amber-50 text-amber-800 border-amber-200"],
  merah: ["Tinggi", "bg-red-50 text-red-800 border-red-200"],
} as const;

export default function LabelPage() {
  const [sugar, setSugar] = useState("");
  const [pack, setPack] = useState("1");
  const [eaten, setEaten] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<LabelResult | null>(null);
  const errors = submitted ? validateLabel(sugar, pack, eaten) : {};

  function reset() {
    setSugar(""); setPack("1"); setEaten("1"); setSubmitted(false); setResult(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateLabel(sugar, pack, eaten)).length) return;
    setBusy(true);
    try {
      setResult(await calcLabel(Number(sugar), Number(pack), Number(eaten)));
    } catch (error) {
      reportError(error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero badge="Baca label kemasan" title="Hitung gula dari label" icon={<IconTag size={15} />}
        description="Cari baris “Gula” pada Informasi Nilai Gizi di kemasan, masukkan angkanya di bawah, dan lihat total gula yang kamu konsumsi." />
      <form onSubmit={onSubmit} noValidate className={`${cardClass} grid gap-5 sm:grid-cols-3`}>
        <Field id="label-sugar" label="Gula per sajian" hint="Dalam gram (g), lihat baris “Gula” di label." error={errors.sugar}>
          {(p) => <input {...p} type="number" inputMode="decimal" step="0.1" placeholder="Contoh: 12" value={sugar} onChange={(e) => setSugar(e.target.value)} />}
        </Field>
        <Field id="label-pack" label="Sajian per kemasan" hint="Tertulis di label, misalnya “2 sajian”." error={errors.pack}>
          {(p) => <input {...p} type="number" inputMode="decimal" step="0.5" value={pack} onChange={(e) => setPack(e.target.value)} />}
        </Field>
        <Field id="label-eaten" label="Sajian dikonsumsi" hint="Berapa sajian yang kamu habiskan? 0,5 = setengah." error={errors.eaten}>
          {(p) => <input {...p} type="number" inputMode="decimal" step="0.5" value={eaten} onChange={(e) => setEaten(e.target.value)} />}
        </Field>
        <div className="flex flex-wrap gap-3 sm:col-span-3">
          <button type="submit" disabled={busy} className={btnClass}>{busy ? "Menghitung..." : "Hitung"}</button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><IconRefresh size={16} /> Kosongkan</button>
        </div>
      </form>
      {result && (
        <section className={cardClass} aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-extrabold text-slate-900">Hasil perkiraan</h2>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${LIGHT[result.light][1]}`}>Kategori gula: {LIGHT[result.light][0]}</span>
          </div>
          <p className="mt-2 text-4xl font-extrabold text-emerald-800">{result.total_sugar_g} g gula</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Persen dari batas harian" aria-valuenow={Math.min(result.percent_of_limit, 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className={`h-full rounded-full ${result.percent_of_limit >= 100 ? "bg-red-500" : result.percent_of_limit >= 60 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(result.percent_of_limit, 100)}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm text-slate-600">
            <li>Setara sekitar <strong>{result.spoons} sendok makan</strong> gula.</li>
            <li>{result.percent_of_limit}% dari batas harian 50 g.</li>
            <li>Gula seluruh kemasan: {result.pack_sugar_g} g.</li>
          </ul>
          <Link href="/sobat-gula" className="mt-4 inline-block text-sm font-bold text-emerald-800 hover:underline">Tanya Sobat Gula cara menguranginya →</Link>
        </section>
      )}
    </div>
  );
}
