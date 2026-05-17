import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ANIME_ANALYSIS_SYSTEM_PROMPT, buildUserPrompt } from "./prompts";

interface AnalysisResult {
  suggestedTags: string[];
  suggestedMoods: string[];
  scorePrediction: number | null;
}

export async function analyzeAnime(
  title: string,
  description: string | null,
): Promise<AnalysisResult> {
  const userPrompt = buildUserPrompt(title, description ?? "");

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: ANIME_ANALYSIS_SYSTEM_PROMPT,
    prompt: userPrompt,
    maxOutputTokens: 500,
  });

  // Parse JSON from response
  try {
    const parsed = JSON.parse(text);
    return {
      suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : [],
      suggestedMoods: Array.isArray(parsed.suggestedMoods) ? parsed.suggestedMoods : [],
      scorePrediction: typeof parsed.scorePrediction === "number" ? parsed.scorePrediction : null,
    };
  } catch {
    // If parsing fails, return empty results
    return {
      suggestedTags: [],
      suggestedMoods: [],
      scorePrediction: null,
    };
  }
}