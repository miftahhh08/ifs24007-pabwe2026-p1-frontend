"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconSearch,
  IconDroplet,
  IconLeaf,
  IconTag,
  IconHeartbeat,
  IconMessageChatbot,
  IconHelpCircle,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { asyncLogout } from "@/features/auth/states/action";
import { disableGuestMode } from "@/helpers/guestMode";

const MENUS = [
  { href: "/", label: "Beranda", Icon: IconHome },
  { href: "/makanan", label: "Cari Makanan", Icon: IconSearch },
  { href: "/label", label: "Label", Icon: IconTag },
  { href: "/risiko", label: "Risiko", Icon: IconHeartbeat },
  { href: "/gula-darah", label: "Gula Darah", Icon: IconDroplet },
  { href: "/sobat-gula", label: "Sobat Gula", Icon: IconMessageChatbot },
  { href: "/bantuan", label: "Bantuan", Icon: IconHelpCircle },
];

export default function NavbarComponent() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.authUser);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-emerald-100/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-emerald-600">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <IconDroplet size={25} stroke={2.2} />
            </span>
            <span className="min-w-0">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">GulaSadar</span>
              <span className="hidden text-xs text-slate-500 sm:block">Kenali gula di piringmu</span>
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <nav aria-label="Menu utama" className="flex max-w-full items-center gap-1 overflow-x-auto rounded-2xl bg-slate-100/80 p-1 sm:gap-2">
              {MENUS.map(({ href, label, Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition sm:px-4 ${
                      active
                        ? "bg-white text-emerald-800 shadow-sm ring-1 ring-slate-200/70"
                        : "text-slate-600 hover:bg-white/70 hover:text-emerald-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 pl-1">
              {authUser ? (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-emerald-900">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-extrabold text-white">
                    {authUser.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[100px] truncate text-xs font-bold sm:inline">
                    {authUser.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      disableGuestMode();
                      dispatch(asyncLogout());
                    }}
                    aria-label="Keluar akun"
                    title="Keluar akun"
                    className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100 hover:text-red-700 transition"
                  >
                    <IconLogout size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <IconUser size={16} />
                  <span>Masuk</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs text-emerald-900 sm:px-6 sm:text-sm lg:px-8">
            <IconLeaf size={16} className="shrink-0 text-emerald-700" aria-hidden="true" />
            <p>Langkah kecil hari ini, kebiasaan lebih sadar untuk esok hari.</p>
          </div>
        </div>
      </header>
    </>
  );
}
