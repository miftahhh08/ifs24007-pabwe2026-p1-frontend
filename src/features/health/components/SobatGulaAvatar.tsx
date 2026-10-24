"use client";

interface SobatGulaAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  isTyping?: boolean;
  className?: string;
  showBadge?: boolean;
}

export default function SobatGulaAvatar({
  size = "md",
  isTyping = false,
  className = "",
  showBadge = false,
}: SobatGulaAvatarProps) {
  const sizeMap = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const pixelMap = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80,
  };

  const dimension = pixelMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}
      aria-label="Avatar Sobat Gula"
    >
      {/* Halo Glow Bergerak di Belakang Avatar */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 opacity-40 blur-md ${
          isTyping ? "animate-pulse" : "animate-pulse-glow"
        }`}
      />

      {/* Kontainer Karakter Bergerak */}
      <div
        className={`relative z-10 w-full h-full rounded-2xl bg-gradient-to-b from-white via-emerald-50/80 to-emerald-100/70 p-1 shadow-md border border-emerald-200/80 flex items-center justify-center ${
          isTyping ? "animate-bounce-dot-1" : "animate-float-slow"
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          width={dimension - 8}
          height={dimension - 8}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            {/* Gradien Tubuh Maskot */}
            <linearGradient id="bodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#f0fdf4" />
              <stop offset="1" stopColor="#dcfce7" />
            </linearGradient>

            {/* Gradien Antena Daun */}
            <linearGradient id="leafGrad" x1="50" y1="5" x2="65" y2="25" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10b981" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>

            {/* Bayangan halus */}
            <filter id="shadowSoft" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#047857" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Antena Daun Sehat Bergerak */}
          <g className="animate-antenna-wave origin-bottom">
            <path
              d="M50 25 C50 16, 58 10, 68 8 C68 18, 59 23, 50 25 Z"
              fill="url(#leafGrad)"
              filter="url(#shadowSoft)"
            />
            <path
              d="M50 25 C48 18, 41 14, 34 16 C35 23, 43 25, 50 25 Z"
              fill="#34d399"
              opacity="0.9"
            />
            <circle cx="50" cy="25" r="3" fill="#059669" />
          </g>

          {/* Telinga / Headphone Robot Sehat Bulat Kiri & Kanan */}
          <rect x="8" y="42" width="10" height="24" rx="5" fill="#047857" />
          <circle cx="13" cy="54" r="2.5" fill="#34d399" className="animate-pulse" />

          <rect x="82" y="42" width="10" height="24" rx="5" fill="#047857" />
          <circle cx="87" cy="54" r="2.5" fill="#34d399" className="animate-pulse" />

          {/* Tubuh Kubus Gula Bulat Lembut (Rounded Friendly Cube) */}
          <rect
            x="14"
            y="26"
            width="72"
            height="62"
            rx="24"
            fill="url(#bodyGrad)"
            stroke="#a7f3d0"
            strokeWidth="2.5"
            filter="url(#shadowSoft)"
          />

          {/* Kilau Permukaan Kaca (Glass reflection) */}
          <path
            d="M24 34 C30 30, 42 29, 54 30 C51 35, 40 37, 24 37 Z"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* Mata Ceria dengan Kedipan Otomatis (Blinking Animation) */}
          <g className="animate-avatar-blink">
            {/* Mata Kiri */}
            <circle cx="36" cy="52" r="6" fill="#0f172a" />
            <circle cx="34" cy="50" r="2" fill="#ffffff" />
            <circle cx="38" cy="54" r="0.8" fill="#ffffff" />

            {/* Mata Kanan */}
            <circle cx="64" cy="52" r="6" fill="#0f172a" />
            <circle cx="62" cy="50" r="2" fill="#ffffff" />
            <circle cx="66" cy="54" r="0.8" fill="#ffffff" />
          </g>

          {/* Pipi Merona Manis (Blush cheeks) */}
          <ellipse cx="28" cy="61" rx="4.5" ry="3" fill="#fda4af" opacity="0.75" />
          <ellipse cx="72" cy="61" rx="4.5" ry="3" fill="#fda4af" opacity="0.75" />

          {/* Senyuman Hangat Ramah */}
          {isTyping ? (
            // Mulut O saat sedang berpikir/mengetik
            <ellipse cx="50" cy="64" rx="4" ry="5" fill="#047857" />
          ) : (
            // Senyuman lebar ceria
            <path
              d="M42 62 Q50 71 58 62"
              stroke="#047857"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Sparkle kilau kecil di sudut */}
          <path
            d="M74 34 L75.5 31 L78.5 29.5 L75.5 28 L74 25 L72.5 28 L69.5 29.5 L72.5 31 Z"
            fill="#10b981"
            opacity="0.8"
          />
        </svg>
      </div>

      {/* Badge Status Aktif Hijau di Pojok Kanan Bawah */}
      {showBadge && (
        <span
          className="absolute -bottom-0.5 -right-0.5 z-20 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white shadow-xs"
          title="Sobat Gula Aktif"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </span>
      )}
    </div>
  );
}
