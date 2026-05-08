export type BudgetLevel = "budget" | "moderate" | "luxury";
export type TravelStyle = "adventure" | "culture" | "relaxation" | "food" | "nightlife" | "nature";
export type TripStatus = "draft" | "planned" | "active" | "completed";

export interface TripPreferences {
  budget: BudgetLevel;
  travelStyle: TravelStyle[];
  groupSize: number;
  accessibility: boolean;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  category: "transport" | "accommodation" | "food" | "activity" | "free";
  estimatedCost?: number;
}

export interface ItineraryDay {
  day: number;
  date: string;
  activities: Activity[];
}

export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: TripPreferences;
  itinerary: ItineraryDay[];
  status: TripStatus;
  createdAt: number;
  updatedAt: number;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budget: BudgetLevel;
  travelStyle: TravelStyle[];
  interests: string;
  groupSize: number;
}
