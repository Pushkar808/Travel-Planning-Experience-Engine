"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 transition-transform group-hover:scale-110">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {siteConfig.navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/trip/new">
            <Button className="bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10 bg-background/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {siteConfig.navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-base">
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Link
                href="/trip/new"
                className="block"
                onClick={() => setMobileOpen(false)}
              >
                <Button className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-500">
                  <Plus className="mr-2 h-4 w-4" />
                  New Trip
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
