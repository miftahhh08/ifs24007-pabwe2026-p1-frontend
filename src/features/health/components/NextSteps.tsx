"use client";

import Link from "next/link";
import { IconCompass } from "@tabler/icons-react";
import { useAppSelector } from "@/hooks/redux";

/** Saran langkah berikutnya sesuai kondisi hari ini (membantu pengguna tahu harus apa). */
export default function NextSteps() {
  const today = useAppSelector((s) => s.today);
  if (!today) return null;

  const tip =
    today.logs.length === 0
      ? { text: "Kamu belum mencatat apa pun hari ini. Mulai dari minuman atau makanan terakhirmu.", href: "/makanan", cta: "Catat sekarang" }
      : today.percent >= 100
        ? { text: "Jatah gula hari ini sudah terlampaui. Pilih air putih atau teh tawar untuk sisa hari ini.", href: "/sobat-gula", cta: "Tanya tips ke Sobat Gula" }
        : today.percent >= 60
          ? { text: "Jatahmu sudah lebih dari separuh terpakai. Hati-hati dengan minuman manis berikutnya.", href: "/sobat-gula", cta: "Minta saran Sobat Gula" }
          : { text: "Bagus, konsumsimu masih terkendali. Cek juga risiko diabetesmu bila belum pernah.", href: "/risiko", cta: "Cek risiko" };

  return (
    <section className="mt-6 flex flex-col gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Langkah berikutnya">
      <p className="flex items-start gap-3 text-sm text-emerald-950"><IconCompass size={22} className="mt-0.5 shrink-0 text-emerald-700" /><span><strong>Langkah berikutnya:</strong> {tip.text}</span></p>
      <Link href={tip.href} className="shrink-0 rounded-xl bg-emerald-700 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-emerald-800">{tip.cta}</Link>
    </section>
  );
}
