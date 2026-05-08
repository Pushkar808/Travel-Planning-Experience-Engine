import type { Trip, TripFormData } from "@/types/trip";
import {
  addDocument,
  updateDocument,
  deleteDocument,
  getDocument,
  queryDocuments,
  where,
  orderBy,
} from "@/lib/firestore";

const COLLECTION = "trips";

export async function createTrip(
  userId: string,
  formData: TripFormData
): Promise<string> {
  const trip: Omit<Trip, "id"> = {
    userId,
    title: `Trip to ${formData.destination}`,
    destination: formData.destination,
    startDate: formData.startDate,
    endDate: formData.endDate,
    preferences: {
      budget: formData.budget,
      travelStyle: formData.travelStyle,
      groupSize: formData.groupSize,
      accessibility: false,
    },
    itinerary: [],
    status: "draft",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return addDocument(COLLECTION, trip);
}

export async function getTrip(tripId: string): Promise<Trip | null> {
  return getDocument<Trip>(COLLECTION, tripId);
}

export async function getUserTrips(userId: string): Promise<Trip[]> {
  return queryDocuments<Trip>(
    COLLECTION,
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );
}

export async function updateTrip(
  tripId: string,
  data: Partial<Trip>
): Promise<void> {
  return updateDocument(COLLECTION, tripId, {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteTrip(tripId: string): Promise<void> {
  return deleteDocument(COLLECTION, tripId);
}
