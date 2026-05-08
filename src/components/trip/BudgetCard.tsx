"use client";

import { Wallet } from "lucide-react";
import { InfoCard } from "@/components/shared/InfoCard";

export interface BudgetItem {
  label: string;
  amount: number;
  color: string;
}

interface BudgetCardProps {
  items: BudgetItem[];
  total: number;
  currency?: string;
  loading?: boolean;
}

export function BudgetCard({
  items,
  total,
  currency = "USD",
  loading = false,
}: BudgetCardProps) {
  const maxAmount = Math.max(...items.map((i) => i.amount), 1);

  return (
    <InfoCard icon={Wallet} title="Budget Breakdown" accentColor="emerald" loading={loading}>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">
                ${item.amount.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(item.amount / maxAmount) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-xs font-medium text-muted-foreground">
            Estimated Total
          </span>
          <span className="text-base font-bold text-emerald-400">
            ${total.toLocaleString()}{" "}
            <span className="text-[10px] font-normal text-muted-foreground">
              {currency}
            </span>
          </span>
        </div>
      </div>
    </InfoCard>
  );
}

/** Helper to build budget items from itinerary activities */
export function buildBudgetFromActivities(
  activities: { category: string; estimatedCost?: number }[]
): { items: BudgetItem[]; total: number } {
  const categoryMap: Record<string, { label: string; color: string }> = {
    food: { label: "Food & Dining", color: "#f97316" },
    activity: { label: "Activities", color: "#22c55e" },
    transport: { label: "Transport", color: "#3b82f6" },
    accommodation: { label: "Accommodation", color: "#a855f7" },
    free: { label: "Free Time", color: "#64748b" },
  };

  const totals: Record<string, number> = {};
  for (const act of activities) {
    const cat = act.category || "activity";
    totals[cat] = (totals[cat] || 0) + (act.estimatedCost ?? 0);
  }

  const items: BudgetItem[] = Object.entries(totals)
    .filter(([, amount]) => amount > 0)
    .map(([cat, amount]) => ({
      label: categoryMap[cat]?.label ?? cat,
      amount,
      color: categoryMap[cat]?.color ?? "#8b5cf6",
    }))
    .sort((a, b) => b.amount - a.amount);

  const total = items.reduce((s, i) => s + i.amount, 0);
  return { items, total };
}
