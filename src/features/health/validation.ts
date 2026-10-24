// Validasi sisi klien: mencegah kesalahan sebelum dikirim (heuristik 5) dengan pesan yang jelas (heuristik 9).
export type Errors = Record<string, string>;

const num = (v: string) => (v.trim() === "" ? NaN : Number(v));

function range(v: string, min: number, max: number, name: string, unit = ""): string | undefined {
  const n = num(v);
  if (Number.isNaN(n)) return `${name} wajib diisi dengan angka.`;
  if (n < min || n > max) return `${name} harus antara ${min} dan ${max}${unit}.`;
}

function pick(entries: [string, string | undefined][]): Errors {
  return Object.fromEntries(entries.filter((e): e is [string, string] => Boolean(e[1])));
}

export const validateLabel = (sugar: string, pack: string, eaten: string): Errors =>
  pick([
    ["sugar", range(sugar, 0, 500, "Gula per sajian", " g")],
    ["pack", range(pack, 1, 100, "Sajian per kemasan")],
    ["eaten", range(eaten, 0.5, 100, "Sajian yang dikonsumsi")],
  ]);

export const validateGlucose = (value: string): Errors =>
  pick([["value", range(value, 20, 600, "Nilai gula darah", " mg/dL")]]);

export const validateRisk = (f: { age: string; heightCm: string; weightKg: string; waistCm: string }): Errors =>
  pick([
    ["age", range(f.age, 18, 120, "Umur", " tahun")],
    ["heightCm", range(f.heightCm, 100, 250, "Tinggi badan", " cm")],
    ["weightKg", range(f.weightKg, 20, 300, "Berat badan", " kg")],
    ["waistCm", range(f.waistCm, 40, 200, "Lingkar pinggang", " cm")],
  ]);
