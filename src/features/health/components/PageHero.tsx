import type { ReactNode } from "react";

interface Props {
  badge: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export default function PageHero({ badge, title, description, icon }: Props) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-teal-800 via-emerald-700 to-emerald-600 px-6 py-7 text-white shadow-xl shadow-emerald-900/10 sm:px-9 sm:py-9">
      <div className="pointer-events-none absolute -right-10 -top-12 -z-10 h-56 w-56 rounded-full border-[30px] border-white/10" />
      <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold">{icon} {badge}</span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">{description}</p>
    </section>
  );
}

export const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10";
export const cardClass = "rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6";
export const btnClass =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (a: { id: string; className: string; "aria-invalid": boolean; "aria-describedby": string }) => ReactNode;
}

/** Field form konsisten: label, petunjuk (mengenali daripada mengingat), dan pesan error inline. */
export function Field({ id, label, hint, error, children }: FieldProps) {
  const described = `${id}-desc`;
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-slate-800">{label}</label>
      <div className="mt-2">
        {children({
          id,
          className: `${inputClass} ${error ? "!border-red-400 !bg-red-50/40" : ""}`,
          "aria-invalid": Boolean(error),
          "aria-describedby": described,
        })}
      </div>
      <p id={described} role={error ? "alert" : undefined} className={`mt-1.5 text-xs ${error ? "font-semibold text-red-600" : "text-slate-500"}`}>
        {error ?? hint}
      </p>
    </div>
  );
}
