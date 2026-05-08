"use client";

import { motion } from "framer-motion";
import { Map } from "lucide-react";

interface MapCardProps {
  destination: string;
}

export function MapCard({ destination }: MapCardProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl flex flex-col"
    >
      <div className="flex items-center gap-2.5 p-5 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15">
          <Map className="h-4 w-4 text-blue-400" />
        </div>
        <h3 className="text-sm font-semibold">Destination Map</h3>
      </div>

      <div className="relative h-48 w-full bg-white/[0.02]">
        {apiKey ? (
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
              destination
            )}`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground">
            <Map className="mb-2 h-6 w-6 opacity-20" />
            <p>Google Maps Embed API Key required.</p>
            <p className="mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
