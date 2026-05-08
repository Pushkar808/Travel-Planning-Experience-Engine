"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeatherInfo } from "@/components/trip/WeatherCard";

export function useWeather(city: string | undefined) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/weather?city=${encodeURIComponent(cityName)}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to fetch weather");
      }
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Weather unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (city && city.trim().length > 1) {
      fetchWeather(city);
    }
  }, [city, fetchWeather]);

  return { weather, loading, error, refetch: fetchWeather };
}
