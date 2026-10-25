"use client";

import { useState } from "react";
import {
  IconCamera,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconHelpCircle,
  IconInfoCircle,
  IconLoader2,
  IconPhoto,
  IconRefresh,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";
import { showErrorDialog } from "@/helpers/toolsHelper";
import { getErrorMessage } from "@/helpers/errorHelper";
import type { IdentifyResult } from "@/types";
import { useAppDispatch } from "@/hooks/redux";
import { asyncAddLog } from "@/features/logs/states/action";
import { identifyPhoto } from "../api/healthApi";
import { cardClass } from "./PageHero";
import PhotoFoodItem from "./PhotoFoodItem";
import PhotoHelpPanel from "./PhotoHelpPanel";
import { clampServing, COMMON_HINTS, readBase64, trafficLightBadge } from "./photoIdentifyHelpers";

export { trafficLightBadge };

export default function PhotoIdentify() {
  const dispatch = useAppDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [servingsMap, setServingsMap] = useState<Record<string, number>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});
  const [showHelp, setShowHelp] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      showErrorDialog("Format gambar harus JPEG, PNG, atau WebP");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      showErrorDialog("Ukuran gambar maksimal 5 MB");
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
    setAddedMap({});
  }

  function handleReset() {
    setFile(null);
    URL.revokeObjectURL(previewUrl!);
    setPreviewUrl(null);
    setResult(null);
    setHint("");
    setAddedMap({});
  }

  async function handleAnalyze(overrideHint?: string) {
    const targetFile = file!;
    const activeHint = overrideHint ?? hint;
    setBusy(true);
    try {
      const base64 = await readBase64(targetFile);
      const res = await identifyPhoto(base64, targetFile.type, targetFile.name, activeHint);
      setResult(res);

      const initialServings: Record<string, number> = {};
      res.foods.forEach((f) => {
        initialServings[f.id] = f.servings || 1;
      });
      setServingsMap(initialServings);
    } catch (error) {
      showErrorDialog(getErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleAddLog(foodId: string) {
    const servings = servingsMap[foodId];
    await dispatch(asyncAddLog(foodId, servings));
    setAddedMap((prev) => ({ ...prev, [foodId]: true }));
  }

  function changeServing(foodId: string, delta: number) {
    setServingsMap((prev) => {
      return { ...prev, [foodId]: clampServing(prev[foodId], delta) };
    });
  }

  return (
    <section className={`${cardClass} mt-6 space-y-5`} aria-label="Kenali makanan dari foto">
      {/* Header Utama & Panduan Singkat (Heuristic 10: Help and documentation) */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <IconCamera size={22} />
            </span>
            Kenali Makanan & Label dari Foto
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            AI mengenali objek dan tabel nilai gizi pada kemasan, basis data menghitung estimasi gula secara akurat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          <IconHelpCircle size={16} />
          <span>Cara Kerja</span>
          {showHelp ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        </button>
      </div>

      {showHelp && <PhotoHelpPanel />}

      {/* Bagian 1: Kotak Unggah / Pratinjau Foto (Heuristic 1: Visibility of system status) */}
      {!file ? (
        <label
          htmlFor="photo-upload-input"
          className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/60 cursor-pointer"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm transition group-hover:scale-105">
            <IconPhoto size={30} />
          </span>
          <p className="mt-4 text-sm font-bold text-slate-800">
            Klik atau Tarik Foto Makanan ke Sini
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Mendukung JPG, PNG, atau WebP (Maksimal 5 MB)
          </p>
          <input
            id="photo-upload-input"
            aria-label="Unggah foto makanan"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Pratinjau Gambar */}
            {previewUrl && (
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Pratinjau Makanan" className="h-full w-full object-cover" />
              </div>
            )}

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="truncate text-sm font-extrabold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / 1024).toFixed(1)} KB · Siap dianalisis
              </p>

              {/* Input Petunjuk Opsional (Heuristic 5: Error prevention) */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  placeholder="Beri petunjuk (mis. es teh, donat, boba)..."
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded-xl p-2 text-xs font-semibold text-slate-500 hover:bg-slate-200 hover:text-red-700 transition"
                  title="Hapus / Ganti Foto"
                >
                  <IconTrash size={16} />
                  <span>Ganti</span>
                </button>
              </div>
            </div>

            {/* Tombol Tindakan Utama: Lihat / Mulai Analisis */}
            <div className="shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={busy}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 disabled:opacity-60 transition"
              >
                {busy ? (
                  <>
                    <IconLoader2 size={18} className="animate-spin" />
                    <span>Menganalisis Foto...</span>
                  </>
                ) : (
                  <>
                    <IconSparkles size={18} />
                    <span>Lihat Hasil Analisis</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bagian 2: Status Memuat / Progress (Heuristic 1: Visibility of system status) */}
      {busy && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-emerald-900 animate-pulse">
          <IconLoader2 size={20} className="animate-spin text-emerald-700" />
          <p className="text-sm font-semibold">
            Sedang mengenali makanan dan membaca takaran gula dari foto...
          </p>
        </div>
      )}

      {/* Bagian 3: Hasil Analisis Sukses Ditemukan (Heuristic 2, 6, 7, 8) */}
      {result && result.foods.length > 0 && (
        <div className="space-y-4 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                <IconCheck size={14} /> Analisis Selesai
              </span>
              <h3 className="mt-1 text-base font-extrabold text-slate-900">
                Ditemukan {result.foods.length} Makanan dari Foto
              </h3>
            </div>
            <button
              type="button"
              onClick={() => handleAnalyze()}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-emerald-700 transition"
            >
              <IconRefresh size={14} /> Analisis Ulang
            </button>
          </div>

          <div className="space-y-3">
            {result.foods.map((food) => (
              <PhotoFoodItem
                key={food.id}
                food={food}
                servings={servingsMap[food.id]}
                isAdded={Boolean(addedMap[food.id])}
                onChangeServing={changeServing}
                onAdd={handleAddLog}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bagian 4: Pemulihan Saat Tidak Dikenali (Heuristic 9: Help users recognize, diagnose, and recover from errors) */}
      {result && result.foods.length === 0 && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-amber-100 p-2 text-amber-800">
              <IconInfoCircle size={20} />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-amber-950">
                Foto Belum Dikenali Otomatis
              </h3>
              <p className="mt-1 text-xs text-amber-900/80 leading-relaxed">
                Foto &quot;{file?.name}&quot; belum terdeteksi otomatis oleh sistem lokal.
                Pilih salah satu petunjuk makanan di bawah agar sistem dapat menganalisis gulanya:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {COMMON_HINTS.map((item) => (
              <button
                key={item.hint}
                type="button"
                onClick={() => {
                  setHint(item.hint);
                  handleAnalyze(item.hint);
                }}
                className="rounded-full border border-amber-300 bg-white px-3.5 py-1.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100 active:scale-95 shadow-sm"
              >
                + {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
