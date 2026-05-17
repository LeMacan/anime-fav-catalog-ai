// Predefined moods constant
export const PREDEFINED_MOODS = [
  "Happy",
  "Sad",
  "Exciting",
  "Relaxing",
  "Thought-provoking",
  "Dark",
  "Heartwarming",
  "Funny",
  "Romantic",
  "Suspenseful",
  "Inspiring",
  "Nostalgic",
  "Action-packed",
  "Calming",
  "Depressing",
  "Mind-bending",
  "Wholesome",
  "Epic",
  "Melancholic",
  "Creepy",
  "Uplifting",
  "Cozy",
  "Intense",
  "Bittersweet",
  "Magical",
] as const;

export type PredefinedMood = (typeof PREDEFINED_MOODS)[number];

// Anime Tag interface
export interface AnimeTag {
  id: string;
  animeId: number;
  tagName: string;
  deviceId: string;
  isAiSuggested: boolean;
  approved: boolean;
  createdAt: Date;
}

// Anime Mood interface
export interface AnimeMood {
  id: string;
  animeId: number;
  mood: string;
  deviceId: string;
  isCustom: boolean;
  createdAt: Date;
}

// Anime Note interface
export interface AnimeNote {
  id: string;
  animeId: number;
  deviceId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI Suggestion interface
export interface AiSuggestion {
  id: string;
  animeId: number;
  deviceId: string;
  suggestedTags: string[];
  suggestedMoods: string[];
  scorePrediction: number | null;
  analyzedAt: Date;
}

// User Preferences interface
export interface UserPreferences {
  favoriteGenres: string[];
  excludedGenres: string[];
  showExcluded: boolean;
}

// API Request/Response shapes
export interface CreateTagRequest {
  tagName: string;
  deviceId: string;
}

export interface CreateMoodRequest {
  mood: string;
  deviceId: string;
  isCustom?: boolean;
}

export interface UpsertNoteRequest {
  content: string;
  deviceId: string;
}

export interface AiEnrichRequest {
  animeId: number;
  deviceId: string;
  title: string;
  description: string;
}

export type BulkOperationType = "addTags" | "addMoods";

export interface BulkOperationRequest {
  operation: BulkOperationType;
  animeIds: number[];
  deviceId: string;
  payload: string[];
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Stats response
export interface StatsResponse {
  totalAnime: number;
  genreBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
  ratingDistribution: Record<string, number>;
  seasonDistribution: Record<string, number>;
}

// AI Enrich stream response
export interface AiEnrichStreamChunk {
  type: "start" | "content" | "done" | "error";
  data?: {
    suggestedTags?: string[];
    suggestedMoods?: string[];
    scorePrediction?: number;
    content?: string;
  };
  error?: string;
}