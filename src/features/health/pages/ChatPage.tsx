"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  IconMessageChatbot,
  IconSend,
  IconSparkles,
  IconTrash,
  IconBulb,
  IconBrain,
} from "@tabler/icons-react";
import { showConfirmDialog, showErrorDialog } from "@/helpers/toolsHelper";
import type { ChatStatus } from "@/types";
import { useAppSelector } from "@/hooks/redux";
import { getChatStatus, sendChat } from "../api/healthApi";
import PageHero, { cardClass } from "../components/PageHero";
import SobatGulaAvatar from "../components/SobatGulaAvatar";
import UserAvatar from "../components/UserAvatar";

interface Msg {
  from: "user" | "bot";
  text: string;
}

const WELCOME: Msg = {
  from: "bot",
  text: "Halo, aku Sobat Gula! Aku bisa cek kandungan gula makanan, merangkum gulamu hari ini, dan menjawab pertanyaan seputar diabetes. Pilih pertanyaan di bawah atau ketik sendiri.",
};

export default function ChatPage() {
  const authUser = useAppSelector((state) => state.authUser);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<ChatStatus | null>(null);
  const [chips, setChips] = useState<string[]>([]);
  const endRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    getChatStatus()
      .then((s) => {
        setStatus(s);
        setChips(s.suggestions);
      })
      .catch((error: Error) => showErrorDialog(error.message));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end", behavior: "smooth" });
  }, [messages, busy]);

  async function ask(raw: string) {
    const message = raw.trim();
    if (!message || busy) return;
    setMessages((m) => [...m, { from: "user", text: message }]);
    setText("");
    setBusy(true);
    try {
      const res = await sendChat(message);
      setMessages((m) => [...m, { from: "bot", text: res.reply }]);
      if (res.suggestions?.length) setChips(res.suggestions);
    } catch (error) {
      showErrorDialog((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function clear() {
    if (messages.length <= 1) return;
    if (
      await showConfirmDialog(
        "Hapus percakapan?",
        "Semua pesan di layar ini akan dibersihkan."
      )
    ) {
      setMessages([WELCOME]);
    }
  }

  const ai = status?.mode === "ai";

  return (
    <div className="space-y-6">
      <PageHero
        badge="Chatbot edukasi"
        title="Sobat Gula"
        icon={<IconMessageChatbot size={15} />}
        description="Pendamping edukasi gaya hidup sehat. Sobat Gula tidak mendiagnosis dan tidak memberi dosis obat."
      />

      {/* Banner Maskot & Status Chatbot */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-5 sm:p-6 text-white shadow-lg">
        {/* Lingkaran Dekoratif Latar Belakang */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
          {/* Avatar Maskot Besar Bergerak */}
          <SobatGulaAvatar size="lg" isTyping={busy} showBadge={true} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-black tracking-tight sm:text-xl">
                Halo{authUser ? `, ${authUser.name}` : ""}! Aku Sobat Gula
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/80 px-2.5 py-0.5 text-xs font-bold text-emerald-200 border border-emerald-600/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online & Siap Bantu
              </span>
            </div>
            <p className="mt-1 text-xs text-emerald-100/90 sm:text-sm leading-relaxed">
              Tanyakan seputar batas gula harian, takaran manis makanan favoritmu, atau tips sehat pencegahan diabetes.
            </p>
          </div>
        </div>
      </div>

      <section className={cardClass}>
        {/* Baris Status & Tombol Bersihkan */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          {status && (
            <p
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-xs ${
                ai
                  ? "bg-violet-50 text-violet-800 border border-violet-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {ai ? <IconBrain size={15} className="text-violet-600" /> : <IconSparkles size={15} className="text-emerald-600" />}
              {ai
                ? `Mode AI aktif (${status.provider})`
                : "Mode dasar: jawaban dari basis data GulaSadar"}
            </p>
          )}

          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition"
          >
            <IconTrash size={14} />
            <span>Hapus percakapan</span>
          </button>
        </div>

        {status && !ai && (
          <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs leading-5 text-amber-950">
            <IconBulb size={18} className="shrink-0 text-amber-700 mt-0.5" />
            <p>
              Ingin jawaban AI yang bebas bertanya? Pasang API key di backend.{" "}
              <Link href="/bantuan#ai" className="font-extrabold underline hover:text-amber-800">
                Lihat caranya
              </Link>.
            </p>
          </div>
        )}

        {/* Daftar Gelembung Obrolan */}
        <ul
          tabIndex={0} className="max-h-[30rem] min-h-56 space-y-4 overflow-y-auto pr-1"
          role="log"
          aria-label="Percakapan"
          aria-live="polite"
        >
          {messages.map((m, i) => {
            const isUser = m.from === "user";
            return (
              <li
                key={i}
                className={`flex items-end gap-2.5 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar Pengirim */}
                {isUser ? (
                  <UserAvatar size="sm" name={authUser?.name} />
                ) : (
                  <SobatGulaAvatar size="sm" showBadge={false} />
                )}

                {/* Gelembung Pesan */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-6 shadow-xs ${
                    isUser
                      ? "rounded-br-xs bg-emerald-700 text-white shadow-emerald-700/10"
                      : "rounded-bl-xs border border-slate-100 bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
              </li>
            );
          })}

          {/* Indikator Mengetik dengan Animasi Bergerak */}
          {busy && (
            <li className="flex items-end gap-2.5 animate-in fade-in">
              <SobatGulaAvatar size="sm" isTyping={true} />
              <div className="rounded-3xl rounded-bl-xs border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-xs sm:text-sm text-emerald-950 shadow-xs flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce-dot-1" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce-dot-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce-dot-3" />
                </span>
                <span className="font-semibold text-slate-500">Sobat Gula sedang mengetik...</span>
              </div>
            </li>
          )}

          <li ref={endRef} aria-hidden="true" />
        </ul>

        {/* Saran Pertanyaan Cepat (Chips) */}
        {chips.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Pertanyaan Cepat
            </p>
            <div className="flex flex-wrap gap-2" aria-label="Pertanyaan cepat">
              {chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={busy}
                  onClick={() => ask(c)}
                  className="rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100 hover:border-emerald-300 disabled:opacity-50 active:scale-95 shadow-2xs"
                >
                  💬 {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Formulir Input Pesan */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(text);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            aria-label="Pesan"
            maxLength={500}
            placeholder="Tulis pertanyaanmu, lalu tekan Enter..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 sm:px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 disabled:opacity-60 transition active:scale-95"
          >
            <IconSend size={16} />
            <span>Kirim</span>
          </button>
        </form>

        <p className="mt-3 text-xs text-slate-500">
          Jawaban bersifat edukatif. Dalam keadaan darurat, hubungi 119 atau ke IGD terdekat.
        </p>
      </section>
    </div>
  );
}
