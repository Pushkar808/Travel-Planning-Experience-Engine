"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TripPlannerForm } from "@/components/trip/TripPlannerForm";
import { ItineraryGrid } from "@/components/trip/ItineraryGrid";
import { ItineraryLoader } from "@/components/trip/ItineraryLoader";
import { BudgetCard, buildBudgetFromActivities } from "@/components/trip/BudgetCard";
import { WeatherCard } from "@/components/trip/WeatherCard";
import { TravelTipsCard } from "@/components/trip/TravelTipsCard";
import { generateItinerary } from "@/services/ai.service";
import { useWeather } from "@/hooks/useWeather";
import type { AiPlanResponse } from "@/types/ai";
import type { TravelStyle } from "@/types/trip";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewTripPage() {
  const [result, setResult] = useState<AiPlanResponse | null>(null);
  const [destination, setDestination] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { weather, loading: weatherLoading, error: weatherError } = useWeather(
    result ? destination : undefined
  );

  const handleSubmit = async (data: {
    destination: string;
    startDate: string;
    endDate: string;
    budget: string;
    travelStyle: string[];
    interests: string;
    groupSize: number;
  }) => {
    setDestination(data.destination);
    setIsGenerating(true);
    try {
      const response = await generateItinerary({
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        travelStyle: data.travelStyle as TravelStyle[],
        interests: data.interests,
        groupSize: data.groupSize,
      });
      setResult(response);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      // TODO: Wire to createTrip(user.uid, formData) when auth is ready
      // For now, simulate save
      await new Promise((r) => setTimeout(r, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Build budget data from itinerary
  const budgetData = result
    ? buildBudgetFromActivities(
        result.itinerary.flatMap((d) => d.activities)
      )
    : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-400/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex min-h-[60vh] items-center justify-center"
              >
                <ItineraryLoader />
              </motion.div>
            ) : !result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <TripPlannerForm onSubmit={handleSubmit} />
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {/* Result Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setResult(null);
                        setSaved(false);
                      }}
                      className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft className="mr-1 h-4 w-4" />
                      Plan another trip
                    </Button>
                    <h2 className="text-2xl font-bold">{result.summary}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Estimated total: ${result.estimatedTotalCost}
                    </p>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={saving || saved}
                    className={`min-w-[140px] transition-all ${
                      saved
                        ? "bg-emerald-600 hover:bg-emerald-600"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                    } text-white shadow-lg`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Trip
                      </>
                    )}
                  </Button>
                </div>

                {/* Two-column layout: Itinerary + Sidebar */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                  {/* Main: Itinerary Grid */}
                  <ItineraryGrid days={result.itinerary} />

                  {/* Sidebar: Info Cards */}
                  <div className="space-y-5">
                    <WeatherCard
                      weather={weather}
                      loading={weatherLoading}
                      error={weatherError}
                    />
                    {budgetData && (
                      <BudgetCard
                        items={budgetData.items}
                        total={budgetData.total}
                      />
                    )}
                    <TravelTipsCard tips={[
                      { emoji: "💳", text: "Carry local currency for street vendors" },
                      { emoji: "📱", text: "Download offline maps before departure" },
                      { emoji: "🔌", text: "Pack a universal power adapter" },
                      { emoji: "💧", text: "Stay hydrated — carry a water bottle" },
                      { emoji: "📋", text: "Keep digital copies of your passport" },
                    ]} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
