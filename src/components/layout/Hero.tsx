"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingVariants = {
  animate: {
    y: [0, -12, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Smart itineraries tailored to your style",
  },
  {
    icon: MapPin,
    title: "Real-Time Updates",
    desc: "Weather, events & local insights on the fly",
  },
  {
    icon: Zap,
    title: "Instant Planning",
    desc: "From idea to itinerary in under 60 seconds",
  },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pt-16">
      {/* Gradient Orbs Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          variants={floatingVariants}
          animate="animate"
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-blue-500/15 blur-[120px]"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
          className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-red-500/15 blur-[120px]"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
          className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-500/15 blur-[100px]"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 3 }}
          className="absolute bottom-1/4 left-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        
        {/* Left Column: Typography & CTAs */}
        <div className="text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Travel Planning
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="block">Your Next Trip,</span>
            <span className="mt-2 block bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent pb-2">
              Planned by AI
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground sm:text-xl"
          >
            Tell us your destination, dates, and vibe — our AI crafts a
            personalized day-by-day itinerary with real-time weather, local gems,
            and smart budget planning.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link href="/trip/new">
              <Button
                size="lg"
                className="h-12 min-w-[200px] bg-blue-600 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 hover:scale-[1.03]"
              >
                Start Planning — Free
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="h-12 min-w-[200px] border-white/15 bg-white/5 text-base backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-[1.03]"
              >
                View My Trips
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative flex flex-col gap-4 sm:ml-auto w-full max-w-md lg:max-w-none"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ x: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-colors hover:border-white/20 hover:bg-white/[0.08] ${
                i === 1 ? "lg:ml-12" : i === 2 ? "lg:ml-24" : ""
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-foreground transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
