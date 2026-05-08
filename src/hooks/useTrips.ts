"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/types/trip";
import { subscribeToCollection, where, orderBy } from "@/lib/firestore";

export function useTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTrips([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToCollection<Trip>(
      "trips",
      (docs) => {
        setTrips(docs);
        setLoading(false);
      },
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    return unsubscribe;
  }, [userId]);

  return { trips, loading };
}
