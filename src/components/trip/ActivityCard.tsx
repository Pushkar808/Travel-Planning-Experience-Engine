"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, DollarSign } from "lucide-react";
import type { Activity } from "@/types/trip";

// ─── Category Config ─────────────────────────────────────────
const categoryConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  transport: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
  },
  accommodation: {
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
  },
  food: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  activity: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
  },
  free: {
    color: "text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
  },
};

const categoryEmoji: Record<string, string> = {
  transport: "🚌",
  accommodation: "🏨",
  food: "🍽️",
  activity: "🎯",
  free: "☕",
};

// ─── Component ───────────────────────────────────────────────
interface ActivityCardProps {
  activity: Activity;
  index?: number;
  compact?: boolean;
}

export function ActivityCard({
  activity,
  index = 0,
  compact = false,
}: ActivityCardProps) {
  const cat = categoryConfig[activity.category] ?? categoryConfig.activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className="group relative flex gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5 backdrop-blur-sm transition-all hover:border-blue-500/20 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-blue-500/5"
    >
      {/* Category Icon */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${cat.bg} text-base`}
      >
        {categoryEmoji[activity.category] ?? "📍"}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Time + Badge */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {activity.time}
          </span>
          <span
            className={`rounded-full border px-2 py-px text-[10px] font-medium capitalize ${cat.bg} ${cat.color} ${cat.border}`}
          >
            {activity.category}
          </span>
        </div>

        {/* Title */}
        <h4 className="mt-1 text-sm font-semibold leading-snug">
          {activity.title}
        </h4>

        {/* Description — hidden in compact mode */}
        {!compact && (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {activity.description}
          </p>
        )}

        {/* Location + Cost */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground/70">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {activity.location}
          </span>
          {activity.estimatedCost != null && activity.estimatedCost > 0 && (
            <span className="flex items-center gap-0.5 font-medium text-emerald-400/80">
              <DollarSign className="h-3 w-3" />
              {activity.estimatedCost}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
