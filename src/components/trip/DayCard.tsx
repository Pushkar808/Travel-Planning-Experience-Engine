"use client";

import { motion } from "framer-motion";
import { Sun, Sunset, Moon, Calendar } from "lucide-react";
import { ActivityCard } from "./ActivityCard";
import type { Activity, ItineraryDay } from "@/types/trip";

// ─── Time-of-day classification ──────────────────────────────
type TimeSlot = "morning" | "afternoon" | "evening";

const timeSlotConfig: Record<
  TimeSlot,
  { label: string; icon: typeof Sun; gradient: string; dotColor: string }
> = {
  morning: {
    label: "Morning",
    icon: Sun,
    gradient: "from-amber-500/20 to-orange-500/20",
    dotColor: "bg-amber-400",
  },
  afternoon: {
    label: "Afternoon",
    icon: Sunset,
    gradient: "from-violet-500/20 to-pink-500/20",
    dotColor: "bg-violet-400",
  },
  evening: {
    label: "Evening",
    icon: Moon,
    gradient: "from-indigo-500/20 to-blue-500/20",
    dotColor: "bg-indigo-400",
  },
};

function getTimeSlot(time: string): TimeSlot {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function groupByTimeSlot(
  activities: Activity[]
): Record<TimeSlot, Activity[]> {
  const groups: Record<TimeSlot, Activity[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };
  for (const act of activities) {
    groups[getTimeSlot(act.time)].push(act);
  }
  return groups;
}

// ─── Format helpers ──────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getDayCost(activities: Activity[]): number {
  return activities.reduce((s, a) => s + (a.estimatedCost ?? 0), 0);
}

// ─── Component ───────────────────────────────────────────────
interface DayCardProps {
  day: ItineraryDay;
  index?: number;
  compact?: boolean;
}

export function DayCard({ day, index = 0, compact = false }: DayCardProps) {
  const groups = groupByTimeSlot(day.activities);
  const dayCost = getDayCost(day.activities);
  const slotOrder: TimeSlot[] = ["morning", "afternoon", "evening"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
    >
      {/* ── Day Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-sm font-bold text-violet-400">
            {day.day}
          </span>
          <div>
            <h3 className="text-sm font-semibold">Day {day.day}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(day.date)}
            </p>
          </div>
        </div>
        {dayCost > 0 && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            ${dayCost}
          </span>
        )}
      </div>

      {/* ── Time Sections ──────────────────────────────── */}
      <div className="divide-y divide-white/[0.04]">
        {slotOrder.map((slot) => {
          const activities = groups[slot];
          if (activities.length === 0) return null;

          const config = timeSlotConfig[slot];
          const Icon = config.icon;

          return (
            <div key={slot} className="px-5 py-4">
              {/* Section Label */}
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br ${config.gradient}`}
                >
                  <Icon className="h-3.5 w-3.5 text-foreground/80" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {config.label}
                </span>
                <div className="h-px flex-1 bg-white/[0.06]" />
              </div>

              {/* Activities */}
              <div className="space-y-2.5">
                {activities.map((activity, i) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    index={i}
                    compact={compact}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
