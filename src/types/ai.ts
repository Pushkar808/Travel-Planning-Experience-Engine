import type { ItineraryDay } from "./trip";

export interface AiPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string[];
  interests: string;
  groupSize: number;
}

export interface AiPlanResponse {
  itinerary: ItineraryDay[];
  summary: string;
  estimatedTotalCost: number;
}

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
