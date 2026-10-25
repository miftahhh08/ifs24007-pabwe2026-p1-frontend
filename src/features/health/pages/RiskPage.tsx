"use client";

import { useState } from "react";
import Link from "next/link";
import { IconHeartbeat, IconRefresh } from "@tabler/icons-react";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { getErrorMessage } from "@/helpers/errorHelper";
import type { RiskInput, RiskResult } from "@/types";
import { assessRisk } from "../api/healthApi";
import { validateRisk } from "../validation";
import PageHero, { Field, btnClass, cardClass } from "../components/PageHero";

const CHECKS = [
  ["active", "Aktif bergerak minimal 30 menit per hari"],
  ["dailyVegetables", "Makan sayur atau buah setiap hari"],
  ["bpMedication", "Pernah/sedang minum obat tekanan darah tinggi"],
  ["highGlucoseHistory", "Pernah diketahui gula darah tinggi"],
] as const;

const LEVEL: Record<string, string> = {
  rendah: "border-emerald-200 bg-emerald-50 text-emerald-900",
  sedang: "border-amber-200 bg-amber-50 text-amber-900",
  tinggi: "border-orange-200 bg-orange-50 text-orange-900",
  "sangat tinggi": "border-red-200 bg-red-50 text-red-900",
};

const EMPTY = { age: "", sex: "pria", heightCm: "", weightKg: "", waistCm: "", familyHistory: "tidak" };
const NO_CHECKS = { active: false, dailyVegetables: false, bpMedication: false, highGlucoseHistory: false };

export default function RiskPage() {
  const [f, setF] = useState(EMPTY);
  const [checks, setChecks] = useState(NO_CHECKS);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);
  const errors = submitted ? validateRisk(f) : {};
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  function reset() {
    setF(EMPTY); setChecks(NO_CHECKS); setSubmitted(false); setResult(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateRisk(f)).length) return;
    const input = {
      ...checks, sex: f.sex, familyHistory: f.familyHistory,
      age: Number(f.age), heightCm: Number(f.heightCm), weightKg: Number(f.weightKg), waistCm: Number(f.waistCm),
    } as RiskInput;
    setBusy(true);
    try {
      setResult(await assessRisk(input));
    } catch (error) {
      showErrorDialog(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero badge="Skrining edukatif" title="Cek risiko diabetes" icon={<IconHeartbeat size={15} />}
        description="Jawab beberapa pertanyaan singkat (diadaptasi dari FINDRISC, untuk usia 18 tahun ke atas). Hasilnya bukan diagnosis. Datamu tidak disimpan." />
      <form onSubmit={onSubmit} noValidate className={`${cardClass} grid gap-5 sm:grid-cols-2`}>
        <Field id="risk-age" label="Umur" hint="Dalam tahun, minimal 18." error={errors.age}>
          {(p) => <input {...p} type="number" inputMode="numeric" placeholder="Contoh: 35" value={f.age} onChange={set("age")} />}
        </Field>
        <Field id="risk-sex" label="Jenis kelamin" hint="Memengaruhi batas lingkar pinggang.">
          {(p) => <select {...p} value={f.sex} onChange={set("sex")}><option value="pria">Pria</option><option value="wanita">Wanita</option></select>}
        </Field>
        <Field id="risk-height" label="Tinggi badan" hint="Dalam sentimeter (cm)." error={errors.heightCm}>
          {(p) => <input {...p} type="number" inputMode="numeric" placeholder="Contoh: 165" value={f.heightCm} onChange={set("heightCm")} />}
        </Field>
        <Field id="risk-weight" label="Berat badan" hint="Dalam kilogram (kg)." error={errors.weightKg}>
          {(p) => <input {...p} type="number" inputMode="decimal" placeholder="Contoh: 62" value={f.weightKg} onChange={set("weightKg")} />}
        </Field>
        <Field id="risk-waist" label="Lingkar pinggang" hint="Ukur melingkar tepat di atas pusar, dalam cm." error={errors.waistCm}>
          {(p) => <input {...p} type="number" inputMode="numeric" placeholder="Contoh: 85" value={f.waistCm} onChange={set("waistCm")} />}
        </Field>
        <Field id="risk-family" label="Riwayat keluarga" hint="Anggota keluarga dengan diabetes.">
          {(p) => <select {...p} value={f.familyHistory} onChange={set("familyHistory")}>
            <option value="tidak">Tidak ada</option><option value="kerabat">Kerabat (kakek/nenek, paman, bibi)</option><option value="orangtua">Orang tua/saudara kandung</option></select>}
        </Field>
        <fieldset className="space-y-2 sm:col-span-2">
          <legend className="mb-1 text-sm font-bold text-slate-800">Kebiasaan dan riwayat</legend>
          {CHECKS.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={checks[key]} onChange={(e) => setChecks({ ...checks, [key]: e.target.checked })} /> {label}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={busy} className={btnClass}>{busy ? "Memproses..." : "Lihat hasil"}</button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><IconRefresh size={16} /> Kosongkan</button>
        </div>
      </form>
      {result && (
        <section className={`rounded-3xl border p-5 sm:p-6 ${LEVEL[result.level] ?? LEVEL.sedang}`} aria-live="polite">
          <h2 className="text-xl font-extrabold">Risiko {result.level}</h2>
          <p className="mt-1 text-sm opacity-80">Skor {result.score} · IMT {result.bmi}</p>
          <p className="mt-3 text-sm">{result.advice}</p>
          <p className="mt-3 text-xs opacity-70">{result.disclaimer}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold">
            <Link href="/gula-darah" className="hover:underline">Catat gula darah →</Link>
            <Link href="/sobat-gula" className="hover:underline">Tanya Sobat Gula →</Link>
          </div>
        </section>
      )}
    </div>
  );
}
