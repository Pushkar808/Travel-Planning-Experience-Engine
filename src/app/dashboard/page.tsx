"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TripCard } from "@/components/trip/TripCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { motion } from "framer-motion";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Trip } from "@/types/trip";

// Mock trips for demo — replace with useTrips hook + Firebase
const mockTrips: Trip[] = [
  {
    id: "1",
    userId: "demo",
    title: "Trip to Tokyo",
    destination: "Tokyo, Japan",
    startDate: "2026-06-15",
    endDate: "2026-06-22",
    preferences: {
      budget: "moderate",
      travelStyle: ["culture", "food"],
      groupSize: 2,
      accessibility: false,
    },
    itinerary: [],
    status: "planned",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "2",
    userId: "demo",
    title: "Trip to Barcelona",
    destination: "Barcelona, Spain",
    startDate: "2026-07-01",
    endDate: "2026-07-07",
    preferences: {
      budget: "luxury",
      travelStyle: ["relaxation", "nightlife", "food"],
      groupSize: 4,
      accessibility: false,
    },
    itinerary: [],
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function DashboardPage() {
  const trips = mockTrips; // TODO: Replace with useTrips(user?.uid)
  const isEmpty = trips.length === 0;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        {/* Background Gradient */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
              </p>
            </div>
            <Link href="/trip/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Button>
            </Link>
          </motion.div>

          {/* Content */}
          {isEmpty ? (
            <EmptyState
              icon={MapPin}
              title="No trips yet"
              description="Start planning your first AI-powered trip — it only takes a minute."
            >
              <Link href="/trip/new">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  Plan Your First Trip
                </Button>
              </Link>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
