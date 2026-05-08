import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10">
        <Plane className="h-8 w-8 text-violet-400" />
      </div>
      <div>
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">
          This destination doesn&apos;t exist — yet.
        </p>
      </div>
      <Link href="/">
        <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
