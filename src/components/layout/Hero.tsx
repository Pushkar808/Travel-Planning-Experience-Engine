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
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet-500/20 blur-[120px]"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1.5 }}
          className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"
        />
        <motion.div
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 3 }}
          className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[100px]"
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
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Travel Planning
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block">Your Next Trip,</span>
          <span className="mt-1 block bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Planned by AI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl"
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
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/trip/new">
            <Button
              size="lg"
              className="h-12 min-w-[200px] bg-gradient-to-r from-violet-600 to-cyan-600 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-cyan-500 hover:shadow-violet-500/40 hover:scale-[1.03]"
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

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="relative z-10 mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-3 md:gap-6"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-lg transition-colors hover:border-violet-500/30 hover:bg-white/[0.08]"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 transition-colors group-hover:from-violet-500/30 group-hover:to-cyan-500/30">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
