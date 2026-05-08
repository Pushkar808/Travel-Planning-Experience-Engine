"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Wallet,
  Users,
  Sparkles,
  Loader2,
  Heart,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TravelStyle } from "@/types/trip";

// ─── Zod Schema ──────────────────────────────────────────────
const tripFormSchema = z.object({
  destination: z.string().min(2, "Enter a destination"),
  startDate: z.string().min(1, "Pick a start date"),
  endDate: z.string().min(1, "Pick an end date"),
  budget: z.enum(["budget", "moderate", "luxury"], {
    message: "Select a budget",
  }),
  travelStyle: z
    .array(z.string())
    .min(1, "Pick at least one travel style"),
  interests: z.string().min(3, "Tell us what you enjoy"),
  groupSize: z.number().min(1).max(20),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

// ─── Travel Style Options ────────────────────────────────────
const travelStyleOptions: { value: TravelStyle; label: string; icon: string }[] = [
  { value: "adventure", label: "Adventure", icon: "🏔️" },
  { value: "culture", label: "Culture", icon: "🏛️" },
  { value: "relaxation", label: "Relaxation", icon: "🏖️" },
  { value: "food", label: "Food", icon: "🍜" },
  { value: "nightlife", label: "Nightlife", icon: "🌃" },
  { value: "nature", label: "Nature", icon: "🌿" },
];

// ─── Budget Options ──────────────────────────────────────────
const budgetOptions = [
  { value: "budget" as const, label: "Budget", icon: "💰", desc: "< $50/day" },
  { value: "moderate" as const, label: "Moderate", icon: "💎", desc: "$50–150/day" },
  { value: "luxury" as const, label: "Luxury", icon: "👑", desc: "$150+/day" },
];

// ─── Component ───────────────────────────────────────────────
interface TripPlannerFormProps {
  onSubmit: (data: TripFormValues) => Promise<void>;
}

export function TripPlannerForm({ onSubmit }: TripPlannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(tripFormSchema) as any,
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      budget: undefined,
      travelStyle: [],
      interests: "",
      groupSize: 1,
    },
  });

  const selectedStyles = watch("travelStyle");
  const selectedBudget = watch("budget");

  const toggleStyle = (style: string) => {
    const current = selectedStyles || [];
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    setValue("travelStyle", updated, { shouldValidate: true });
  };

  const handleFormSubmit = async (data: TripFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto w-full max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-blue-500/5 backdrop-blur-2xl sm:p-8 md:p-10"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Plan Your Trip
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details and let AI craft your perfect itinerary
        </p>
      </div>

      {/* Destination */}
      <fieldset className="space-y-2">
        <label htmlFor="destination-input" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-blue-400" aria-hidden="true" />
          Destination
        </label>
        <input
          id="destination-input"
          {...register("destination")}
          placeholder="e.g. Tokyo, Japan"
          className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none ring-blue-500/40 transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2"
        />
        {errors.destination && (
          <p className="text-xs text-red-400">{errors.destination.message}</p>
        )}
      </fieldset>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="space-y-2">
          <label htmlFor="start-date-input" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-blue-300" aria-hidden="true" />
            Start Date
          </label>
          <input
            id="start-date-input"
            type="date"
            {...register("startDate")}
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none ring-blue-500/40 transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2"
          />
          {errors.startDate && (
            <p className="text-xs text-red-400">{errors.startDate.message}</p>
          )}
        </fieldset>

        <fieldset className="space-y-2">
          <label htmlFor="end-date-input" className="flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-blue-300" aria-hidden="true" />
            End Date
          </label>
          <input
            id="end-date-input"
            type="date"
            {...register("endDate")}
            className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none ring-blue-500/40 transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2"
          />
          {errors.endDate && (
            <p className="text-xs text-red-400">{errors.endDate.message}</p>
          )}
        </fieldset>
      </div>

      {/* Budget */}
      <fieldset className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="h-4 w-4 text-emerald-400" />
          Budget
        </label>
        <div className="grid grid-cols-3 gap-3">
          {budgetOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selectedBudget === opt.value}
              onClick={() => setValue("budget", opt.value, { shouldValidate: true })}
              className={`group flex flex-col items-center gap-1 rounded-xl border px-3 py-4 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                selectedBudget === opt.value
                  ? "border-blue-500/50 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-500/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <span className="font-medium">{opt.label}</span>
              <span className="text-[11px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
        {errors.budget && (
          <p className="text-xs text-red-400">{errors.budget.message}</p>
        )}
      </fieldset>

      {/* Travel Style */}
      <fieldset className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <Compass className="h-4 w-4 text-pink-400" />
          Travel Style
          <span className="text-xs text-muted-foreground">(pick multiple)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {travelStyleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              aria-pressed={selectedStyles?.includes(opt.value)}
              onClick={() => toggleStyle(opt.value)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                selectedStyles?.includes(opt.value)
                  ? "border-blue-500/50 bg-blue-500/15 text-blue-300"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              }`}
            >
              <span>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
        {errors.travelStyle && (
          <p className="text-xs text-red-400">{errors.travelStyle.message}</p>
        )}
      </fieldset>

      {/* Interests */}
      <fieldset className="space-y-2">
        <label htmlFor="interests-input" className="flex items-center gap-2 text-sm font-medium">
          <Heart className="h-4 w-4 text-rose-400" aria-hidden="true" />
          Interests & Preferences
        </label>
        <textarea
          id="interests-input"
          {...register("interests")}
          rows={3}
          placeholder="e.g. Street food tours, hidden temples, sunset spots, local markets..."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none ring-blue-500/40 transition-all placeholder:text-muted-foreground/50 focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2"
        />
        {errors.interests && (
          <p className="text-xs text-red-400">{errors.interests.message}</p>
        )}
      </fieldset>

      {/* Group Size */}
      <fieldset className="space-y-2">
        <label htmlFor="group-size-input" className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Group Size
        </label>
        <input
          id="group-size-input"
          type="number"
          min={1}
          max={20}
          {...register("groupSize", { valueAsNumber: true })}
          className="w-full max-w-[120px] rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none ring-blue-500/40 transition-all focus:border-blue-500/50 focus:bg-white/[0.08] focus:ring-2"
        />
        {errors.groupSize && (
          <p className="text-xs text-red-400">{errors.groupSize.message}</p>
        )}
      </fieldset>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full bg-blue-600 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Itinerary...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate AI Itinerary
          </>
        )}
      </Button>
    </motion.form>
  );
}
