"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, DollarSign } from "lucide-react";
import type { ItineraryDay } from "@/types/trip";

const categoryColors: Record<string, string> = {
  transport: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  accommodation: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  food: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  activity: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  free: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

export function ItineraryTimeline({ days }: ItineraryTimelineProps) {
  return (
    <div className="space-y-8">
      {days.map((day, dayIndex) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: dayIndex * 0.15 }}
        >
          {/* Day Header */}
          <div className="mb-4 flex items-baseline gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-400/20 text-sm font-bold text-blue-400">
              {day.day}
            </span>
            <div>
              <h3 className="text-base font-semibold">Day {day.day}</h3>
              <p className="text-xs text-muted-foreground">{day.date}</p>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="ml-5 border-l border-white/10 pl-6 space-y-4">
            {day.activities.map((activity, actIndex) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIndex * 0.15 + actIndex * 0.08 }}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-colors hover:border-blue-500/20 hover:bg-white/[0.06]"
              >
                {/* Timeline Dot */}
                <div className="absolute -left-[33px] top-4 h-3 w-3 rounded-full border-2 border-blue-500/50 bg-background" />

                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] capitalize ${categoryColors[activity.category]}`}
                      >
                        {activity.category}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-medium">{activity.title}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {activity.location}
                      </span>
                      {activity.estimatedCost != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />$
                          {activity.estimatedCost}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
