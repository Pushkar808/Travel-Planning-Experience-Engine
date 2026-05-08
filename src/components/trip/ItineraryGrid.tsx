"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import { DayCard } from "./DayCard";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { Button } from "@/components/ui/button";
import type { ItineraryDay } from "@/types/trip";

interface ItineraryGridProps {
  days: ItineraryDay[];
}

export function ItineraryGrid({ days }: ItineraryGridProps) {
  const [view, setView] = useState<"grid" | "timeline">("grid");

  return (
    <div>
      {/* View Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-sm text-muted-foreground">
          {days.length} day{days.length !== 1 ? "s" : ""} ·{" "}
          {days.reduce(
            (s, d) => s + d.activities.length,
            0
          )}{" "}
          activities
        </p>

        <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("grid")}
            className={`h-7 px-2.5 text-xs ${
              view === "grid"
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
            Cards
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView("timeline")}
            className={`h-7 px-2.5 text-xs ${
              view === "timeline"
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <List className="mr-1.5 h-3.5 w-3.5" />
            Timeline
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {days.map((day, i) => (
            <DayCard key={day.day} day={day} index={i} />
          ))}
        </div>
      ) : (
        <ItineraryTimeline days={days} />
      )}
    </div>
  );
}
