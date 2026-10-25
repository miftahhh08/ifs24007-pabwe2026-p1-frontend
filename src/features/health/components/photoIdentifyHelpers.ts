export const COMMON_HINTS = [
  { label: "Es Teh Manis", hint: "es teh" },
  { label: "Kopi Susu Aren", hint: "kopi susu" },
  { label: "Donat", hint: "donat" },
  { label: "Boba Brown Sugar", hint: "boba" },
  { label: "Pisang Goreng", hint: "pisang goreng" },
  { label: "Martabak Manis", hint: "martabak" },
  { label: "Cokelat / Snack", hint: "cokelat" },
  { label: "Biskuit / Wafer", hint: "biskuit" },
  { label: "Susu UHT", hint: "susu uht" },
  { label: "Soda", hint: "soda" },
];

export function readBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Gagal membaca gambar"));
    reader.readAsDataURL(file);
  });
}

export function trafficLightBadge(sugarG: number) {
  if (sugarG <= 5) {
    return {
      text: "Rendah (Aman)",
      className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    };
  }
  if (sugarG <= 15) {
    return {
      text: "Sedang (Batasi)",
      className: "bg-amber-100 text-amber-800 border-amber-300",
    };
  }
  return {
    text: "Tinggi (Waspada)",
    className: "bg-red-100 text-red-800 border-red-300",
  };
}

export const MIN_SERVING = 0.5;
export const MAX_SERVING = 10;
export const SUGAR_PER_SPOON_G = 12.5;

/** Menggeser jumlah porsi dengan batas aman dan pembulatan satu desimal. */
export function clampServing(current: number, delta: number): number {
  return Math.max(MIN_SERVING, Math.min(MAX_SERVING, Math.round((current + delta) * 10) / 10));
}

/** Total gula (g) untuk sejumlah porsi, dibulatkan satu desimal. */
export function totalSugar(sugarPerServing: number, servings: number): number {
  return Math.round(sugarPerServing * servings * 10) / 10;
}

/** Perkiraan jumlah sendok makan gula pasir. */
export function toSpoons(sugarG: number): number {
  return Math.round((sugarG / SUGAR_PER_SPOON_G) * 10) / 10;
}
