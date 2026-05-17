export const ANIME_ANALYSIS_SYSTEM_PROMPT = `You are an anime analysis expert. Given the anime title and description, analyze and provide:

1. **Suggested Tags** (3-8 relevant tags): Consider themes, genres, visual style, target audience
2. **Suggested Moods** (2-5 moods): Consider emotional tone, viewer experience
3. **Score Prediction** (60-100): Your prediction of what a typical user would rate this anime

Respond in JSON format:
{
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "suggestedMoods": ["mood1", "mood2"],
  "scorePrediction": 85
}

Be concise and accurate. Tags should be single words or short phrases.`;

export function buildUserPrompt(title: string, description: string): string {
  const truncatedDesc = description?.length > 1500 
    ? description.slice(0, 1500) + "..." 
    : description || "No description available";
  
  return `Anime Title: ${title}

Description: ${truncatedDesc}`;
}