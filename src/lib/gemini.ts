import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Server-only Gemini client singleton.
 * Uses GEMINI_API_KEY (no NEXT_PUBLIC_ prefix) — never exposed to the browser.
 */

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to .env.local"
    );
  }
  return key;
}

// Lazy singleton — created on first use, reused across requests
let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    client = new GoogleGenerativeAI(getApiKey());
  }
  return client;
}
