export interface PageInfo {
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface AnimeTitle {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface AnimeCoverImage {
  large?: string;
  extraLarge?: string;
}

export interface AnimeDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface AnimeSearchResult {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  averageScore?: number;
  meanScore?: number;
  genres?: string[];
  episodes?: number;
  format?: string;
  status?: string;
  season?: string;
  seasonYear?: number;
  startDate?: AnimeDate;
}

export interface AnimeDetail extends AnimeSearchResult {
  bannerImage?: string;
  description?: string;
  tags?: { name: string; rank: number }[];
  studios?: { nodes: { name: string }[] };
  duration?: number;
  popularity?: number;
  favourites?: number;
  source?: string;
  trailer?: { id: string; site: string };
  characters?: {
    nodes: {
      id: number;
      name: { full: string };
      image: { large?: string };
    }[];
  };
  relations?: {
    nodes: {
      id: number;
      title: { romaji?: string };
      format?: string;
    }[];
  };
  externalLinks?: {
    url: string;
    site: string;
  }[];
}

export interface SearchResponse {
  Page: {
    pageInfo: PageInfo;
    media: AnimeSearchResult[];
  };
}

export interface DetailResponse {
  Media: AnimeDetail;
}

// Re-export predefined moods from metadata types
export { PREDEFINED_MOODS } from "../types/metadata";
