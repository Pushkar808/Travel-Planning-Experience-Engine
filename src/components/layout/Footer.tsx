import { Plane } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Plane className="h-4 w-4" />
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
        </div>
        <p className="text-xs text-muted-foreground/60">
          Built with AI · Powered by wanderlust
        </p>
      </div>
    </footer>
  );
}
