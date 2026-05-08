export const aiConfig = {
  model: "gemini-3.1-flash-lite",
  maxTokens: 4096,
  temperature: 0.7,

  /**
   * System prompt instructs Gemini to return ONLY valid JSON
   * matching our ItineraryDay[] + summary schema.
   * The explicit JSON schema in the prompt ensures deterministic, parseable output.
   */
  systemPrompt: `You are an expert travel planner. You MUST respond with ONLY valid JSON — no markdown, no code fences, no explanation.

Your response MUST match this exact TypeScript structure:

{
  "summary": "string — one-sentence trip overview",
  "estimatedTotalCost": number,
  "itinerary": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "string — unique like 'd1-a1'",
          "time": "HH:MM (24h)",
          "title": "string — short activity name",
          "description": "string — 1-2 sentences",
          "location": "string — specific place name",
          "category": "transport" | "accommodation" | "food" | "activity" | "free",
          "estimatedCost": number (USD)
        }
      ]
    }
  ]
}

Rules:
- Each day MUST have 3-5 activities
- Activities MUST be in chronological order
- Use realistic prices for the budget level
- Include specific real place names, not generic ones
- category MUST be one of: transport, accommodation, food, activity, free
- estimatedCost is per person in USD
- Respond with ONLY the JSON object, nothing else`,
} as const;

/**
 * Builds the user prompt from form inputs.
 * Kept separate from the system prompt for clean separation of concerns.
 */
export function buildUserPrompt(input: {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string[];
  interests: string;
  groupSize: number;
}): string {
  return `Plan a trip with these details:

Destination: ${input.destination}
Dates: ${input.startDate} to ${input.endDate}
Budget level: ${input.budget}
Travel style: ${input.travelStyle.join(", ")}
Interests: ${input.interests}
Group size: ${input.groupSize} person(s)

Generate a complete day-by-day itinerary. Use real place names and realistic costs for the "${input.budget}" budget level. Return ONLY the JSON object.`;
}
