"use client";

import { IconUser } from "@tabler/icons-react";

interface UserAvatarProps {
  size?: "sm" | "md";
  className?: string;
  name?: string;
}

export default function UserAvatar({ size = "md", className = "", name }: UserAvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
  };

  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : null;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-600 text-white font-extrabold shadow-sm border border-emerald-700/30 ${sizeMap[size]} ${className}`}
      aria-label={name ? `Avatar ${name}` : "Avatar Pengguna"}
    >
      {initial ? <span>{initial}</span> : <IconUser size={size === "sm" ? 16 : 20} />}
    </div>
  );
}
