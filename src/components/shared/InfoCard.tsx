"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  accentColor?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export function InfoCard({
  icon: Icon,
  title,
  accentColor = "blue",
  loading = false,
  children,
}: InfoCardProps) {
  const accentMap: Record<string, { iconBg: string; iconText: string }> = {
    blue: { iconBg: "bg-blue-500/15", iconText: "text-blue-400" },
    emerald: { iconBg: "bg-emerald-500/15", iconText: "text-emerald-400" },
    red: { iconBg: "bg-red-500/15", iconText: "text-red-400" },
    amber: { iconBg: "bg-amber-500/15", iconText: "text-amber-400" },
    rose: { iconBg: "bg-rose-500/15", iconText: "text-rose-400" },
  };

  const accent = accentMap[accentColor] ?? accentMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${accent.iconText}`} />
        </div>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      {/* Content or Skeleton */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-3/4 rounded-md bg-white/[0.06]" />
          <div className="h-4 w-1/2 rounded-md bg-white/[0.06]" />
          <div className="h-4 w-2/3 rounded-md bg-white/[0.06]" />
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
