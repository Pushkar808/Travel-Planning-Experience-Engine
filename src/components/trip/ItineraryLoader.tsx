"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  MapPin,
  Sparkles,
  Calendar,
  CloudSun,
  CheckCircle2,
} from "lucide-react";

// ─── Loading Steps ───────────────────────────────────────────
const steps = [
  {
    icon: MapPin,
    label: "Analyzing destination",
    detail: "Researching local attractions and culture",
    color: "text-blue-500",
    bg: "bg-blue-500/15",
  },
  {
    icon: Calendar,
    label: "Planning daily schedule",
    detail: "Optimizing activities by time and proximity",
    color: "text-red-500",
    bg: "bg-red-500/15",
  },
  {
    icon: CloudSun,
    label: "Checking conditions",
    detail: "Factoring in weather and seasonal events",
    color: "text-yellow-500",
    bg: "bg-yellow-500/15",
  },
  {
    icon: Sparkles,
    label: "Crafting your itinerary",
    detail: "Personalizing based on your preferences",
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
  },
];

const travelFacts = [
  "Japan has over 6,800 islands 🏝️",
  "The shortest commercial flight is 57 seconds ✈️",
  "France is the most visited country in the world 🇫🇷",
  "There are over 7,000 languages spoken worldwide 🗣️",
  "Iceland has no mosquitoes 🦟❌",
  "Singapore is both a city and a country 🇸🇬",
  "Venice is built on 118 small islands 🏘️",
  "The Great Wall of China is over 13,000 miles long 🧱",
];

// ─── Component ───────────────────────────────────────────────
export function ItineraryLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * travelFacts.length)
  );

  // Progress through steps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Rotate travel facts
  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % travelFacts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-12">
      {/* Animated Plane */}
      <div className="relative mb-10 h-24 w-24">
        {/* Glow Ring */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 blur-xl"
        />
        {/* Spinning Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderImage:
              "linear-gradient(135deg, #4285F4 0%, #EA4335 33%, #FBBC05 66%, #34A853 100%) 1",
          }}
        />
        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Plane className="h-10 w-10 text-blue-400" />
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-2 text-xl font-bold tracking-tight sm:text-2xl"
      >
        Creating Your Itinerary
      </motion.h2>
      <p className="mb-8 text-sm text-muted-foreground">
        AI is crafting your perfect trip…
      </p>

      {/* Steps */}
      <div className="mb-10 w-full space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentStep;
          const isDone = i < currentStep;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
                isActive
                  ? "border-blue-500/30 bg-white/[0.04] shadow-lg shadow-blue-500/5"
                  : isDone
                    ? "border-white/[0.06] bg-white/[0.02]"
                    : "border-white/[0.04] bg-transparent"
              }`}
            >
              {/* Icon */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${
                  isDone ? "bg-emerald-500/15" : isActive ? step.bg : "bg-white/[0.04]"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Icon
                    className={`h-4 w-4 transition-colors duration-500 ${
                      isActive ? step.color : "text-muted-foreground/40"
                    }`}
                  />
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium transition-colors duration-500 ${
                    isDone
                      ? "text-muted-foreground"
                      : isActive
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                  }`}
                >
                  {step.label}
                  {isDone && (
                    <span className="ml-1.5 text-xs text-emerald-400">✓</span>
                  )}
                </p>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-0.5 text-xs text-muted-foreground"
                  >
                    {step.detail}
                  </motion.p>
                )}
              </div>

              {/* Progress Dots (active step) */}
              {isActive && (
                <div className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: d * 0.2,
                      }}
                      className={`h-1.5 w-1.5 rounded-full ${step.color.replace('text-', 'bg-')}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500"
        />
      </div>

      {/* Fun Fact */}
      <div className="h-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-center text-xs text-muted-foreground/60"
          >
            Did you know? {travelFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
