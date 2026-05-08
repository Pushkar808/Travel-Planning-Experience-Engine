"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-12"
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </motion.div>
  );
}
