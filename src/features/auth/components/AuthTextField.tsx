import type { ComponentType, InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
}

const INPUT_CLASS =
  "w-full rounded-full border border-emerald-600/30 bg-[#164634] py-3.5 pl-14 pr-5 text-sm text-white placeholder-emerald-200/70 outline-none transition focus:border-emerald-400 focus:bg-[#1a513c] focus:ring-4 focus:ring-emerald-500/20";

/** Kolom isian berlabel dengan ikon, dipakai oleh semua field pada formulir masuk/daftar. */
export default function AuthTextField({ id, label, icon: Icon, ...inputProps }: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-emerald-100 mb-1 pl-3">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#124230]">
            <Icon size={16} />
          </span>
        </span>
        <input id={id} required className={INPUT_CLASS} {...inputProps} />
      </div>
    </div>
  );
}
