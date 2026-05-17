import { SEARCH_QUERY, DETAIL_QUERY } from "./queries";
import type { SearchResponse, DetailResponse } from "./types";

const ANILIST_API = "https://graphql.anilist.co";

export async function searchAnime(
  search: string,
  page: number = 1,
  perPage: number = 20,
): Promise<SearchResponse> {
  const response = await fetch(ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: { search, page, perPage },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AniList search failed: ${response.status} ${error}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? "AniList API error");
  }

  return json.data as SearchResponse;
}

export async function getAnimeDetail(
  id: number,
): Promise<DetailResponse> {
  const response = await fetch(ANILIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: DETAIL_QUERY,
      variables: { id },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AniList detail failed: ${response.status} ${error}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? "AniList API error");
  }

  return json.data as DetailResponse;
}
