import { getGeminiClient } from "@/lib/gemini";
import { aiConfig, buildUserPrompt } from "@/config/ai";
import type { AiPlanRequest, AiPlanResponse } from "@/types/ai";

// ─── Custom Error ────────────────────────────────────────────
export class GeminiServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "GENERATION_FAILED" | "PARSE_FAILED" | "VALIDATION_FAILED" | "RATE_LIMITED",
    public readonly status: number = 500
  ) {
    super(message);
    this.name = "GeminiServiceError";
  }
}

// ─── Main Service ────────────────────────────────────────────

/**
 * Generates a travel itinerary using Gemini.
 * Server-only — never import this in client components.
 */
export async function generateItineraryWithGemini(
  request: AiPlanRequest
): Promise<AiPlanResponse> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: aiConfig.model,
    generationConfig: {
      maxOutputTokens: aiConfig.maxTokens,
      temperature: aiConfig.temperature,
      responseMimeType: "application/json",
    },
    systemInstruction: aiConfig.systemPrompt,
  });

  const userPrompt = buildUserPrompt(request);

  // ─── Call Gemini ───────────────────────────────────────
  let rawText: string;
  try {
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    rawText = response.text();

    if (!rawText || rawText.trim().length === 0) {
      throw new GeminiServiceError(
        "Gemini returned an empty response",
        "GENERATION_FAILED"
      );
    }
  } catch (error) {
    if (error instanceof GeminiServiceError) throw error;

    const message = error instanceof Error ? error.message : "Unknown error";

    // Detect rate limiting
    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      throw new GeminiServiceError(
        "AI rate limit reached. Please try again in a moment.",
        "RATE_LIMITED",
        429
      );
    }

    throw new GeminiServiceError(
      `Failed to generate itinerary: ${message}`,
      "GENERATION_FAILED"
    );
  }

  // ─── Parse JSON ────────────────────────────────────────
  let parsed: AiPlanResponse;
  try {
    // Strip markdown code fences if Gemini wraps them despite instructions
    const cleaned = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    parsed = JSON.parse(cleaned);
  } catch {
    throw new GeminiServiceError(
      "AI returned malformed JSON. Please try again.",
      "PARSE_FAILED"
    );
  }

  // ─── Validate Structure ────────────────────────────────
  if (!parsed.itinerary || !Array.isArray(parsed.itinerary)) {
    throw new GeminiServiceError(
      "AI response missing itinerary array",
      "VALIDATION_FAILED"
    );
  }

  if (!parsed.summary || typeof parsed.summary !== "string") {
    parsed.summary = `Your trip to ${request.destination}`;
  }

  if (typeof parsed.estimatedTotalCost !== "number") {
    parsed.estimatedTotalCost = parsed.itinerary.reduce(
      (sum, day) =>
        sum +
        (day.activities || []).reduce(
          (s, a) => s + (a.estimatedCost || 0),
          0
        ),
      0
    );
  }

  // Ensure every activity has an id
  for (const day of parsed.itinerary) {
    if (!Array.isArray(day.activities)) day.activities = [];
    day.activities.forEach((activity, i) => {
      if (!activity.id) {
        activity.id = `d${day.day}-a${i + 1}`;
      }
    });
  }

  return parsed;
}
