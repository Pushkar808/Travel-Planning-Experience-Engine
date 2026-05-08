"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Trip } from "@/types/trip";
import Link from "next/link";

interface TripCardProps {
  trip: Trip;
  index?: number;
}

const statusColors: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  planned: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  completed: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
};

export function TripCard({ trip, index = 0 }: TripCardProps) {
  const dayCount =
    Math.ceil(
      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-lg transition-colors hover:border-violet-500/20 hover:bg-white/[0.07]"
    >
      {/* Status Badge */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[trip.status]}`}
        >
          {trip.status}
        </span>
        <span className="text-xs text-muted-foreground">{dayCount} days</span>
      </div>

      {/* Title & Destination */}
      <h3 className="text-lg font-semibold leading-snug">{trip.title}</h3>
      <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-violet-400" />
        {trip.destination}
      </div>

      {/* Dates & Budget */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {trip.startDate} → {trip.endDate}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5" />
          {trip.preferences.budget}
        </span>
      </div>

      {/* Travel Styles */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {trip.preferences.travelStyle.map((s) => (
          <span
            key={s}
            className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs capitalize text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>

      {/* Action */}
      <Link href={`/trip/${trip.id}`}>
        <Button
          variant="ghost"
          className="mt-4 w-full justify-between text-sm text-muted-foreground hover:text-foreground"
        >
          View Itinerary
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  );
}
