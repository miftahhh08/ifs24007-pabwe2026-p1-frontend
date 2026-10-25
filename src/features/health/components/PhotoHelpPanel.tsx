import { IconInfoCircle } from "@tabler/icons-react";

/** Panduan singkat cara kerja identifikasi foto. */
export default function PhotoHelpPanel() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs leading-relaxed text-emerald-950 animate-in fade-in">
      <p className="font-bold mb-1 flex items-center gap-1.5">
        <IconInfoCircle size={16} className="text-emerald-700" />
        Panduan Evaluasi Heuristik (Status & Deteksi Otomatis):
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Unggah Foto:</strong> Masukkan foto makanan rumahan, jajanan, atau tabel Informasi Nilai Gizi kemasan.</li>
        <li><strong>Prinsip Aman:</strong> Sistem mencocokkan makanan dengan basis data gizi terpercaya sesuai anjuran batas Kemenkes RI (50 g/hari).</li>
        <li><strong>Petunjuk Cepat:</strong> Jika file foto memiliki nama umum (misal hasil tangkapan layar/kamera), kamu bisa memilih petunjuk makanan di bawah untuk pencocokan instan.</li>
      </ul>
    </div>
  );
}
