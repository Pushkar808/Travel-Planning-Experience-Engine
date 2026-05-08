import { NextResponse } from "next/server";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json(
      { message: "Missing 'city' query parameter" },
      { status: 400 }
    );
  }

  if (!OPENWEATHER_API_KEY) {
    // Fallback to Open-Meteo (free, no key) via geocoding
    return fetchOpenMeteoFallback(city);
  }

  try {
    const res = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`,
      { next: { revalidate: 1800 } } // Cache 30 min
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { message: `City "${city}" not found` },
          { status: 404 }
        );
      }
      throw new Error(`OpenWeather returned ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      description: data.weather[0]?.description ?? "Unknown",
      icon: weatherIconToEmoji(data.weather[0]?.icon),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      city: data.name,
    });
  } catch (error) {
    console.error("[api/weather] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

// ─── Fallback: Open-Meteo (free, no key) ─────────────────────
async function fetchOpenMeteoFallback(city: string) {
  try {
    // Step 1: Geocode city name
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    const geoData = await geoRes.json();
    const location = geoData.results?.[0];

    if (!location) {
      return NextResponse.json(
        { message: `City "${city}" not found` },
        { status: 404 }
      );
    }

    // Step 2: Get weather
    const wxRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`,
      { next: { revalidate: 1800 } }
    );
    const wxData = await wxRes.json();
    const current = wxData.current;

    return NextResponse.json({
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      description: weatherCodeToDescription(current.weather_code),
      icon: weatherCodeToEmoji(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      city: location.name,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}

// ─── Icon Helpers ────────────────────────────────────────────
function weatherIconToEmoji(icon: string): string {
  const map: Record<string, string> = {
    "01d": "☀️", "01n": "🌙",
    "02d": "⛅", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️",
  };
  return map[icon] ?? "🌤️";
}

function weatherCodeToDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Rime fog", 51: "Light drizzle", 53: "Moderate drizzle",
    55: "Dense drizzle", 61: "Slight rain", 63: "Moderate rain",
    65: "Heavy rain", 71: "Slight snow", 73: "Moderate snow",
    75: "Heavy snow", 80: "Slight showers", 81: "Moderate showers",
    82: "Violent showers", 95: "Thunderstorm",
  };
  return map[code] ?? "Unknown";
}

function weatherCodeToEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌧️";
  return "⛈️";
}
