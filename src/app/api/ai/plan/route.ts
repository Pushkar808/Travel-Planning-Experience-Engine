import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateItineraryWithGemini,
  GeminiServiceError,
} from "@/services/gemini.service";

// ─── Request Validation Schema ───────────────────────────────
const planRequestSchema = z.object({
  destination: z.string().min(2, "Destination is required"),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  budget: z.enum(["budget", "moderate", "luxury"]),
  travelStyle: z.array(z.string()).min(1, "Select at least one travel style"),
  interests: z.string().min(1, "Interests are required"),
  groupSize: z.number().int().min(1).max(20),
});

// ─── GET — health check / docs ───────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: "ok",
    method: "POST",
    description: "Generate an AI travel itinerary",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    body: {
      destination: "string (required)",
      startDate: "YYYY-MM-DD (required)",
      endDate: "YYYY-MM-DD (required)",
      budget: "budget | moderate | luxury",
      travelStyle: "string[] (at least 1)",
      interests: "string (required)",
      groupSize: "number 1-20",
    },
    example: {
      destination: "Tokyo, Japan",
      startDate: "2026-06-15",
      endDate: "2026-06-18",
      budget: "moderate",
      travelStyle: ["culture", "food"],
      interests: "Temples, street food, hidden gems",
      groupSize: 2,
    },
  });
}

// ─── POST — generate itinerary ───────────────────────────────
export async function POST(request: Request) {
  try {
    // 1. Parse body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // 2. Validate with Zod
    const validation = planRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((i) => ({
        field: i.path.join("."),
        message: i.message,
      }));
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 422 }
      );
    }

    const validated = validation.data;

    // 3. Validate date logic
    if (new Date(validated.endDate) < new Date(validated.startDate)) {
      return NextResponse.json(
        { message: "End date must be after start date" },
        { status: 422 }
      );
    }

    const dayCount = calculateDays(validated.startDate, validated.endDate);
    if (dayCount > 14) {
      return NextResponse.json(
        { message: "Trip duration cannot exceed 14 days" },
        { status: 422 }
      );
    }

    // 4. Generate itinerary — Gemini or mock fallback
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(generateMockItinerary(validated, dayCount));
    }

    const result = await generateItineraryWithGemini(validated);
    return NextResponse.json(result);
  } catch (error) {
    // Typed error from Gemini service
    if (error instanceof GeminiServiceError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.status }
      );
    }

    // Unknown error — don't leak internals
    console.error("[api/ai/plan] Unhandled error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

// ─── Mock Fallback (when no GEMINI_API_KEY) ──────────────────
function generateMockItinerary(
  input: z.infer<typeof planRequestSchema>,
  dayCount: number
) {
  const costMultiplier =
    input.budget === "luxury" ? 3 : input.budget === "moderate" ? 1.5 : 1;

  const itinerary = Array.from({ length: dayCount }, (_, i) => ({
    day: i + 1,
    date: addDays(input.startDate, i),
    activities: [
      {
        id: `d${i + 1}-a1`,
        time: "09:00",
        title: `Morning exploration in ${input.destination}`,
        description: `Start your day discovering the highlights of ${input.destination}`,
        location: input.destination,
        category: "activity" as const,
        estimatedCost: Math.round(25 * costMultiplier),
      },
      {
        id: `d${i + 1}-a2`,
        time: "12:30",
        title: "Local cuisine experience",
        description: `Enjoy authentic local food, tailored to your ${input.travelStyle.join(", ")} preferences`,
        location: input.destination,
        category: "food" as const,
        estimatedCost: Math.round(20 * costMultiplier),
      },
      {
        id: `d${i + 1}-a3`,
        time: "15:00",
        title: `Afternoon ${input.travelStyle[0] || "activity"}`,
        description: `An afternoon shaped by your interests: ${input.interests}`,
        location: input.destination,
        category: "activity" as const,
        estimatedCost: Math.round(30 * costMultiplier),
      },
      {
        id: `d${i + 1}-a4`,
        time: "19:00",
        title: "Evening dining & nightlife",
        description: `Wind down with dinner and evening activities in ${input.destination}`,
        location: input.destination,
        category: "food" as const,
        estimatedCost: Math.round(35 * costMultiplier),
      },
    ],
  }));

  const estimatedTotalCost = itinerary.reduce(
    (sum, day) =>
      sum + day.activities.reduce((s, a) => s + (a.estimatedCost || 0), 0),
    0
  );

  return {
    itinerary,
    summary: `Your ${dayCount}-day ${input.budget} trip to ${input.destination} — ${input.travelStyle.join(", ")}`,
    estimatedTotalCost,
    _mock: true,
  };
}

// ─── Helpers ─────────────────────────────────────────────────
function calculateDays(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
