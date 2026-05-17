import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  unique,
  boolean,
  json,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceId: text("device_id").notNull(),
  name: text("name").notNull(),
  description: text("description").default("").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collectionAnime = pgTable(
  "collection_anime",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    collectionId: uuid("collection_id")
      .references(() => collections.id, { onDelete: "cascade" })
      .notNull(),
    animeId: integer("anime_id").notNull(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.collectionId, t.animeId),
  }),
);

// Anime tags - user-defined and AI-suggested tags
export const animeTags = pgTable(
  "anime_tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    animeId: integer("anime_id").notNull(),
    tagName: text("tag_name").notNull(),
    deviceId: text("device_id").notNull(),
    isAiSuggested: boolean("is_ai_suggested").default(false).notNull(),
    approved: boolean("approved").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.tagName, t.deviceId),
  }),
);

// Anime moods - predefined and custom mood tags
export const animeMoods = pgTable(
  "anime_moods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    animeId: integer("anime_id").notNull(),
    mood: text("mood").notNull(),
    deviceId: text("device_id").notNull(),
    isCustom: boolean("is_custom").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.mood, t.deviceId),
  }),
);

// Anime notes - personal notes per anime
export const animeNotes = pgTable(
  "anime_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    animeId: integer("anime_id").notNull(),
    deviceId: text("device_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.deviceId),
  }),
);

// AI suggestions cache
export const animeAiSuggestions = pgTable(
  "anime_ai_suggestions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    animeId: integer("anime_id").notNull(),
    deviceId: text("device_id").notNull(),
    suggestedTags: json("suggested_tags").$type<string[]>().notNull(),
    suggestedMoods: json("suggested_moods").$type<string[]>().notNull(),
    scorePrediction: integer("score_prediction"),
    analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.deviceId),
  }),
);

// AI usage tracking for daily limits
export const aiUsageLogs = pgTable(
  "ai_usage_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    deviceId: text("device_id").notNull(),
    usedAt: timestamp("used_at").defaultNow().notNull(),
  },
  (t) => ({
    idx: unique().on(t.deviceId, t.usedAt),
  }),
);

// Anime favorites - user's saved anime
export const animeFavorites = pgTable(
  "anime_favorites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    animeId: integer("anime_id").notNull(),
    deviceId: text("device_id").notNull(),
    title: text("title").notNull(),
    coverImage: text("cover_image"),
    averageScore: integer("average_score"),
    format: text("format"),
    episodes: integer("episodes"),
    genres: json("genres").$type<string[]>(),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.animeId, t.deviceId),
  }),
);
