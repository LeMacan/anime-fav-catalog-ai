CREATE TABLE "ai_usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" text NOT NULL,
	"used_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ai_usage_logs_device_id_used_at_unique" UNIQUE("device_id","used_at")
);
--> statement-breakpoint
CREATE TABLE "anime_ai_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anime_id" integer NOT NULL,
	"device_id" text NOT NULL,
	"suggested_tags" json NOT NULL,
	"suggested_moods" json NOT NULL,
	"score_prediction" integer,
	"analyzed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anime_ai_suggestions_anime_id_device_id_unique" UNIQUE("anime_id","device_id")
);
--> statement-breakpoint
CREATE TABLE "anime_moods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anime_id" integer NOT NULL,
	"mood" text NOT NULL,
	"device_id" text NOT NULL,
	"is_custom" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anime_moods_anime_id_mood_device_id_unique" UNIQUE("anime_id","mood","device_id")
);
--> statement-breakpoint
CREATE TABLE "anime_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anime_id" integer NOT NULL,
	"device_id" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anime_notes_anime_id_device_id_unique" UNIQUE("anime_id","device_id")
);
--> statement-breakpoint
CREATE TABLE "anime_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"anime_id" integer NOT NULL,
	"tag_name" text NOT NULL,
	"device_id" text NOT NULL,
	"is_ai_suggested" boolean DEFAULT false NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "anime_tags_anime_id_tag_name_device_id_unique" UNIQUE("anime_id","tag_name","device_id")
);
--> statement-breakpoint
CREATE TABLE "collection_anime" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_id" uuid NOT NULL,
	"anime_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collection_anime_collection_id_anime_id_unique" UNIQUE("collection_id","anime_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_anime" ADD CONSTRAINT "collection_anime_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;