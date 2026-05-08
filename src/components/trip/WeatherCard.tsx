"use client";

import { CloudSun, Droplets, Wind, Thermometer } from "lucide-react";
import { InfoCard } from "@/components/shared/InfoCard";

export interface WeatherInfo {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

interface WeatherCardProps {
  weather: WeatherInfo | null;
  loading?: boolean;
  error?: string | null;
}

export function WeatherCard({ weather, loading = false, error }: WeatherCardProps) {
  return (
    <InfoCard icon={CloudSun} title="Weather" accentColor="blue" loading={loading}>
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : weather ? (
        <div className="space-y-3">
          {/* Main temp */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{weather.icon}</span>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{Math.round(weather.temperature)}°</span>
                <span className="text-xs text-muted-foreground">C</span>
              </div>
              <p className="text-xs capitalize text-muted-foreground">
                {weather.description}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
              <Thermometer className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs font-medium">{Math.round(weather.feelsLike)}°</span>
              <span className="text-[10px] text-muted-foreground">Feels</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
              <Droplets className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-medium">{weather.humidity}%</span>
              <span className="text-[10px] text-muted-foreground">Humidity</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-white/[0.04] py-2">
              <Wind className="h-3.5 w-3.5 text-blue-300" />
              <span className="text-xs font-medium">{weather.windSpeed}</span>
              <span className="text-[10px] text-muted-foreground">km/h</span>
            </div>
          </div>

          {weather.city && (
            <p className="text-[11px] text-muted-foreground/60">
              Current weather in {weather.city}
            </p>
          )}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No weather data available</p>
      )}
    </InfoCard>
  );
}
