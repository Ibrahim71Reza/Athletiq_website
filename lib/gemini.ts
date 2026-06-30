import { GoogleGenerativeAI } from "@google/generative-ai"

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite"
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""

export function hasGeminiApiKey() {
  return GEMINI_API_KEY.trim().length > 0
}

export function createGeminiClient() {
  return new GoogleGenerativeAI(GEMINI_API_KEY)
}

export function missingGeminiApiKeyBody() {
  return {
    error: "Gemini API key is not configured.",
    details: "Set GEMINI_API_KEY in .env.local, then restart the Next.js server.",
    model: GEMINI_MODEL,
  }
}

export function formatGeminiError(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : String(error)
  const text = message.toLowerCase()

  if (
    text.includes("429") ||
    text.includes("rate_limit_exceeded") ||
    text.includes("resource_exhausted") ||
    text.includes("quota exceeded")
  ) {
    return {
      status: 429,
      body: {
        error: "Gemini API quota or rate limit exceeded.",
        details:
          "Your Google project has no available GenerateContent quota for this request right now. Check AI Studio/GCP billing and rate limits, wait briefly, or switch GEMINI_MODEL to a model with available quota.",
        model: GEMINI_MODEL,
      },
    }
  }

  if (
    text.includes("404") ||
    text.includes("not found") ||
    text.includes("is not found") ||
    (text.includes("model") && text.includes("unsupported"))
  ) {
    return {
      status: 500,
      body: {
        error: "Configured Gemini model is not available.",
        details:
          "Check that GEMINI_MODEL matches a model code available to your API key and SDK.",
        model: GEMINI_MODEL,
      },
    }
  }

  return {
    status: 500,
    body: {
      error: fallbackMessage,
      details: message || "Unknown Gemini API error.",
      model: GEMINI_MODEL,
    },
  }
}
