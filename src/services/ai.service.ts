import type { AiPlanRequest, AiPlanResponse } from "@/types/ai";

/**
 * Calls the /api/ai/plan route handler to generate an itinerary.
 * Keeps the API key server-side.
 */
export async function generateItinerary(
  request: AiPlanRequest
): Promise<AiPlanResponse> {
  const res = await fetch("/api/ai/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(error.message || "Failed to generate itinerary");
  }

  return res.json();
}
