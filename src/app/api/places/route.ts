import { NextResponse } from "next/server";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  rating: number;
  totalRatings: number;
  types: string[];
  photoUrl: string | null;
  location: { lat: number; lng: number };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const type = searchParams.get("type") || "tourist_attraction";

  if (!query) {
    return NextResponse.json(
      { message: "Missing 'query' parameter" },
      { status: 400 }
    );
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      { message: "GOOGLE_PLACES_API_KEY is not configured" },
      { status: 503 }
    );
  }

  try {
    // Text Search API (simpler than Nearby, works with city names)
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        `${type} in ${query}`
      )}&key=${GOOGLE_PLACES_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache 1 hour
    );

    if (!res.ok) {
      throw new Error(`Google Places returned ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Places API error: ${data.status}`);
    }

    const places: PlaceResult[] = (data.results || [])
      .slice(0, 8) // Limit results to minimize API usage
      .map((place: Record<string, unknown>) => ({
        id: place.place_id as string,
        name: place.name as string,
        address: place.formatted_address as string,
        rating: (place.rating as number) ?? 0,
        totalRatings: (place.user_ratings_total as number) ?? 0,
        types: ((place.types as string[]) ?? []).slice(0, 3),
        photoUrl: getPhotoUrl(place.photos as Array<{ photo_reference: string }> | undefined),
        location: {
          lat: (place.geometry as { location: { lat: number } }).location.lat,
          lng: (place.geometry as { location: { lng: number } }).location.lng,
        },
      }));

    return NextResponse.json({ places });
  } catch (error) {
    console.error("[api/places] Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch places" },
      { status: 500 }
    );
  }
}

function getPhotoUrl(photos: Array<{ photo_reference: string }> | undefined): string | null {
  if (!photos || photos.length === 0) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`;
}
