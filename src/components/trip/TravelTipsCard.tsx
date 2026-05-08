"use client";

import { Lightbulb } from "lucide-react";
import { InfoCard } from "@/components/shared/InfoCard";

export interface TravelTip {
  emoji: string;
  text: string;
}

interface TravelTipsCardProps {
  tips: TravelTip[];
  loading?: boolean;
}

const defaultTips: TravelTip[] = [
  { emoji: "💳", text: "Carry local currency for street vendors and small shops" },
  { emoji: "📱", text: "Download offline maps before departure" },
  { emoji: "🔌", text: "Pack a universal power adapter" },
  { emoji: "💧", text: "Stay hydrated — carry a reusable water bottle" },
  { emoji: "📋", text: "Keep digital copies of your passport and ID" },
];

export function TravelTipsCard({
  tips = defaultTips,
  loading = false,
}: TravelTipsCardProps) {
  return (
    <InfoCard icon={Lightbulb} title="Travel Tips" accentColor="amber" loading={loading}>
      <ul className="space-y-2.5">
        {tips.map((tip, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 rounded-lg bg-white/[0.03] px-3 py-2 text-xs leading-relaxed text-muted-foreground transition-colors hover:bg-white/[0.06]"
          >
            <span className="mt-0.5 text-sm">{tip.emoji}</span>
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </InfoCard>
  );
}
