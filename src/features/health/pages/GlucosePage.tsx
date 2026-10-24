"use client";

import { useCallback, useEffect, useState } from "react";
import { IconDroplet, IconTrash } from "@tabler/icons-react";
import { showConfirmDialog, showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { GlucoseContext, GlucoseLog } from "@/types";
import { addGlucose, deleteGlucose, getGlucose } from "../api/healthApi";
import { validateGlucose } from "../validation";
import PageHero, { Field, btnClass, cardClass } from "../components/PageHero";

const BADGE: Record<string, string> = {
  rendah: "bg-sky-50 text-sky-800 border-sky-200",
  normal: "bg-emerald-50 text-emerald-800 border-emerald-200",
  waspada: "bg-amber-50 text-amber-800 border-amber-200",
  tinggi: "bg-red-50 text-red-800 border-red-200",
};
const CONTEXT_LABEL: Record<string, string> = { puasa: "Puasa", sesudah_makan: "Sesudah makan", sewaktu: "Sewaktu" };

export default function GlucosePage() {
  const [value, setValue] = useState("");
  const [context, setContext] = useState<GlucoseContext>("puasa");
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ category: string; text: string } | null>(null);
  const errors = submitted ? validateGlucose(value) : {};

  const load = useCallback(async () => {
    try {
      const data = await getGlucose();
      setLogs(data);
    } catch (error) {
      showErrorDialog((error as Error).message);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateGlucose(value)).length) return;
    setBusy(true);
    try {
      const added = await addGlucose(Number(value), context);
      setNote({ category: added.category, text: added.note });
      showSuccessDialog("Catatan tersimpan");
      setValue("");
      setSubmitted(false);
      await load();
    } catch (error) {
      showErrorDialog((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    if (!(await showConfirmDialog("Hapus catatan?", "Catatan gula darah ini akan dihapus."))) return;
    try {
      await deleteGlucose(id);
      await load();
    } catch (error) {
      showErrorDialog((error as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      <PageHero badge="Catatan pribadi" title="Catatan gula darah" icon={<IconDroplet size={15} />}
        description="Catat hasil pengukuranmu dan lihat kategorinya. Klasifikasi bersifat edukatif dan bukan pengganti interpretasi dokter." />
      <form onSubmit={onSubmit} noValidate className={`${cardClass} grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start`}>
        <Field id="glu-value" label="Nilai gula darah" hint="Dalam mg/dL, sesuai angka di alat ukurmu." error={errors.value}>
          {(p) => <input {...p} type="number" inputMode="decimal" placeholder="Contoh: 95" value={value} onChange={(e) => setValue(e.target.value)} />}
        </Field>
        <Field id="glu-context" label="Waktu pengukuran" hint="Puasa = minimal 8 jam tidak makan.">
          {(p) => <select {...p} value={context} onChange={(e) => setContext(e.target.value as GlucoseContext)}>
            <option value="puasa">Puasa</option><option value="sesudah_makan">2 jam sesudah makan</option><option value="sewaktu">Sewaktu</option></select>}
        </Field>
        <button type="submit" disabled={busy} className={`${btnClass} sm:mt-7`}>{busy ? "Menyimpan..." : "Simpan"}</button>
      </form>
      {note && (
        <p className={`rounded-2xl border p-4 text-sm ${BADGE[note.category] ?? BADGE.normal}`} aria-live="polite">
          <strong>{note.category.toUpperCase()}:</strong> {note.text}
        </p>
      )}
      <section className={cardClass} aria-label="Acuan edukatif">
        <h2 className="font-extrabold text-slate-900">Acuan edukatif (mg/dL)</h2>
        <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
          <p className="rounded-xl bg-slate-50 p-3"><strong>Puasa:</strong> normal &lt;100 · waspada 100–125 · tinggi ≥126</p>
          <p className="rounded-xl bg-slate-50 p-3"><strong>2 jam sesudah makan:</strong> normal &lt;140 · waspada 140–199 · tinggi ≥200</p>
          <p className="rounded-xl bg-slate-50 p-3"><strong>Di bawah 70:</strong> rendah. Bila gemetar atau pusing, segera cari bantuan.</p>
        </div>
      </section>
      <section className={cardClass}>
        <h2 className="font-extrabold text-slate-900">Riwayat</h2>
        {loaded && logs.length === 0 && <p className="mt-3 text-sm text-slate-500">Belum ada catatan. Masukkan pengukuran pertamamu di atas.</p>}
        <ul className="mt-3 divide-y divide-slate-100">
          {logs.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                <strong>{l.value} mg/dL</strong> · {CONTEXT_LABEL[l.context] ?? l.context}
                <span className={`ml-2 rounded-full border px-2 py-0.5 text-xs font-bold ${BADGE[l.category] ?? BADGE.normal}`}>{l.category}</span>
                <span className="ml-2 text-xs text-slate-400">{l.measured_at}</span>
              </span>
              <button aria-label={`Hapus catatan ${l.id}`} onClick={() => onDelete(l.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><IconTrash size={18} /></button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
