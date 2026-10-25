import Link from "next/link";
import { IconHelpCircle } from "@tabler/icons-react";
import PageHero, { cardClass } from "../components/PageHero";

const FAQ: [string, string][] = [
  ["Dari mana angka gula berasal?", "Dari tabel makanan di GulaSadar, berupa estimasi per porsi. Angka bisa berbeda karena resep, merek, dan ukuran porsi. Untuk produk kemasan, gunakan menu Label dengan angka dari kemasannya."],
  ["Kenapa batasnya 50 gram?", "Itu anjuran umum Kemenkes untuk gula tambahan, sekitar 4 sendok makan per hari. Angka ini acuan edukasi, bukan target medis pribadi."],
  ["Apakah hasil Cek Risiko berarti aku sakit?", "Tidak. Skrining ini edukatif dan bukan diagnosis. Bila hasilnya sedang sampai tinggi, periksakan gula darah ke fasilitas kesehatan."],
  ["Apakah datakuku aman?", "Data disimpan di basis data lokal server GulaSadar dan tidak memerlukan identitas. Hindari memasukkan data pribadi yang tidak perlu."],
  ["Bagaimana kalau aku salah mencatat?", "Setelah mencatat, tekan Urungkan pada notifikasi yang muncul, atau hapus dari daftar Catatan hari ini di Beranda."],
  ["Sobat Gula bisa memberi dosis obat?", "Tidak. Dosis obat dan insulin hanya boleh ditentukan dokter atau apoteker. Pada keadaan darurat hubungi 119."],
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <PageHero badge="Pusat bantuan" title="Panduan penggunaan" icon={<IconHelpCircle size={15} />}
        description="Cara memakai GulaSadar, arti indikator warna, dan jawaban pertanyaan umum." />

      <section className={cardClass}>
        <h2 className="font-extrabold text-slate-900">Cara memakai</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Buka <Link href="/makanan" className="font-bold text-emerald-800 underline">Cari Makanan</Link>, ketik nama makanan, atur jumlah porsi, lalu tekan Catat.</li>
          <li>Lihat total dan sisa jatah di <Link href="/" className="font-bold text-emerald-800 underline">Beranda</Link>, termasuk tren 7 hari.</li>
          <li>Untuk produk kemasan, hitung lewat <Link href="/label" className="font-bold text-emerald-800 underline">Label</Link>.</li>
          <li>Cek <Link href="/risiko" className="font-bold text-emerald-800 underline">Risiko</Link> dan catat pengukuran di <Link href="/gula-darah" className="font-bold text-emerald-800 underline">Gula Darah</Link>.</li>
          <li>Punya pertanyaan? Tanya <Link href="/sobat-gula" className="font-bold text-emerald-800 underline">Sobat Gula</Link>.</li>
        </ol>
        <p className="mt-4 text-xs text-slate-500">Pintasan: tekan <kbd className="rounded border border-slate-300 bg-slate-50 px-1.5">/</kbd> di halaman Cari Makanan untuk langsung mengetik pencarian.</p>
      </section>

      <section className={cardClass}>
        <h2 className="font-extrabold text-slate-900">Arti warna indikator gula</h2>
        <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
          <li className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3"><strong className="text-emerald-800">Hijau, rendah</strong><br />sampai 5 g gula per porsi</li>
          <li className="rounded-2xl border border-amber-200 bg-amber-50 p-3"><strong className="text-amber-800">Kuning, sedang</strong><br />6–15 g gula per porsi</li>
          <li className="rounded-2xl border border-red-200 bg-red-50 p-3"><strong className="text-red-800">Merah, tinggi</strong><br />di atas 15 g gula per porsi</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">Warna selalu disertai teks (Rendah/Sedang/Tinggi) agar mudah dibaca semua orang.</p>
      </section>

      <section className={cardClass}>
        <h2 className="font-extrabold text-slate-900">Pertanyaan umum</h2>
        <div className="mt-3 divide-y divide-slate-100">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-3">
              <summary className="cursor-pointer text-sm font-bold text-slate-800">{q}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="ai" className={cardClass}>
        <h2 className="font-extrabold text-slate-900">Mengaktifkan mode AI (opsional)</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">Tanpa pengaturan apa pun, Sobat Gula menjawab dari basis data GulaSadar. Untuk percakapan bebas dan identifikasi makanan dari foto, pasang salah satu API key di <code className="rounded bg-slate-100 px-1">backend/.env</code>, lalu restart backend:</p>
        <pre tabIndex={0} aria-label="Contoh konfigurasi" className="mt-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-emerald-100">{`# Gemini (ada tier gratis, key di aistudio.google.com)
GEMINI_API_KEY=isi_key_kamu

# atau Anthropic
ANTHROPIC_API_KEY=isi_key_kamu`}</pre>
        <p className="mt-3 text-xs text-slate-500">Jangan pernah meng-commit API key ke repositori publik.</p>
      </section>
    </div>
  );
}
