"use client";

import { use } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ItineraryGrid } from "@/components/trip/ItineraryGrid";
import { BudgetCard, buildBudgetFromActivities } from "@/components/trip/BudgetCard";
import { WeatherCard } from "@/components/trip/WeatherCard";
import { TravelTipsCard } from "@/components/trip/TravelTipsCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWeather } from "@/hooks/useWeather";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ItineraryDay } from "@/types/trip";

// Mock data — replace with getTrip(tripId) from trip.service.ts
const mockTrip = {
  title: "Trip to Tokyo",
  destination: "Tokyo, Japan",
  startDate: "2026-06-15",
  endDate: "2026-06-22",
};

const mockItinerary: ItineraryDay[] = [
  {
    day: 1,
    date: "2026-06-15",
    activities: [
      {
        id: "1-1",
        time: "09:00",
        title: "Explore Shibuya Crossing",
        description:
          "Experience the world's busiest pedestrian crossing and surrounding shops",
        location: "Shibuya, Tokyo",
        category: "activity",
        estimatedCost: 0,
      },
      {
        id: "1-2",
        time: "12:30",
        title: "Ramen at Ichiran",
        description:
          "Taste the famous tonkotsu ramen with customizable flavour options",
        location: "Shibuya, Tokyo",
        category: "food",
        estimatedCost: 15,
      },
      {
        id: "1-3",
        time: "15:00",
        title: "Meiji Jingu Shrine",
        description:
          "Visit the iconic Shinto shrine surrounded by lush forest in central Tokyo",
        location: "Harajuku, Tokyo",
        category: "activity",
        estimatedCost: 0,
      },
      {
        id: "1-4",
        time: "19:00",
        title: "Yakitori Alley in Yurakucho",
        description: "Evening street food tour under the train tracks",
        location: "Yurakucho, Tokyo",
        category: "food",
        estimatedCost: 20,
      },
    ],
  },
  {
    day: 2,
    date: "2026-06-16",
    activities: [
      {
        id: "2-1",
        time: "08:30",
        title: "Tsukiji Outer Market",
        description:
          "Fresh seafood breakfast and street food tasting at the historic market",
        location: "Tsukiji, Tokyo",
        category: "food",
        estimatedCost: 25,
      },
      {
        id: "2-2",
        time: "13:00",
        title: "TeamLab Borderless",
        description:
          "Immersive digital art museum with interactive light installations",
        location: "Odaiba, Tokyo",
        category: "activity",
        estimatedCost: 30,
      },
      {
        id: "2-3",
        time: "18:30",
        title: "Sunset at Tokyo Tower",
        description: "Watch the sunset over the city from the observation deck",
        location: "Minato, Tokyo",
        category: "activity",
        estimatedCost: 12,
      },
    ],
  },
];

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = use(params);
  const { weather, loading: weatherLoading, error: weatherError } =
    useWeather(mockTrip.destination);

  const allActivities = mockItinerary.flatMap((d) => d.activities);
  const budgetData = buildBudgetFromActivities(allActivities);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-20 right-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Back */}
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="-ml-2 mb-4 text-muted-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to trips
              </Button>
            </Link>

            {/* Header Card */}
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-lg">
              <h1 className="text-2xl font-bold">{mockTrip.title}</h1>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-violet-400" />
                  {mockTrip.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  {mockTrip.startDate} → {mockTrip.endDate}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Trip ID: {tripId}
              </p>
            </div>

            {/* Content */}
            {mockItinerary.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                {/* Main */}
                <ItineraryGrid days={mockItinerary} />

                {/* Sidebar */}
                <div className="space-y-5">
                  <WeatherCard
                    weather={weather}
                    loading={weatherLoading}
                    error={weatherError}
                  />
                  <BudgetCard
                    items={budgetData.items}
                    total={budgetData.total}
                  />
                  <TravelTipsCard tips={[
                    { emoji: "🚃", text: "Get a Suica/Pasmo IC card for trains" },
                    { emoji: "🏪", text: "Convenience stores (7-11, FamilyMart) are lifesavers" },
                    { emoji: "🎌", text: "Learn basic phrases: sumimasen, arigatou" },
                    { emoji: "👟", text: "Wear comfortable walking shoes" },
                    { emoji: "🏧", text: "Most ATMs in 7-Eleven accept foreign cards" },
                  ]} />
                </div>
              </div>
            ) : (
              <EmptyState
                title="No itinerary yet"
                description="Generate an AI itinerary for this trip."
              />
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
