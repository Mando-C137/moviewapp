import axios from "axios";
import { env } from "../../env.mjs";
import type { SearchResult } from "../../utils/types";
import { z } from "zod";

export type TmdbResult = {
  backdrop_path: string;
  id: number;
  imdb_id: string;
  original_title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
  revenue: number;
  runtime: number;
  tagline: string;
  title: string;
};
export const movieSchema = z.object({
  backdrop_path: z.string(),
  id: z.number(),
  imdb_id: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  tagline: z.string(),
  title: z.string(),
  poster_path: z.string(),
});
export const searchMovie = async (searchTerm: string) => {
  const params = new URLSearchParams({
    api_key: env.TMDB_CLIENT_ID,
    query: searchTerm,
  }).toString();

  const url = `${env.TMDB_BASE_URL}/search/movie?${params}`;
  try {
    const res = await axios.get<{
      page: number;
      results: SearchResult[];
    }>(url);
    const results = [
      ...res.data.results.sort((a, b) => b.popularity - a.popularity),
    ];
    return results;
  } catch (e) {
    throw new Error("Failed to use Search API of TMdb");
  }
};
export const fetchMovieByTmdbId = async (idParam: number) => {
  try {
    const response = await axios.get(
      `${env.TMDB_BASE_URL}/movie/${idParam}?api_key=${env.TMDB_CLIENT_ID}&language=en-US`
    );

    const parsedMovie = movieSchema.parse(response.data);

    return {
      ...parsedMovie,
      revenue: Number((parsedMovie.revenue / 1_000_000).toFixed(2)),
    } as TmdbResult;
  } catch (e) {
    console.log(`error when fetching by tmdbId ${idParam}`);
    return "error" as const;
  }
};
export const backdroppathImagepath = (
  backdrop_path: string,
  quality: "w300" | "w780" | "w1280" | "w1280" | "original" = "w780"
) => {
  return `https://image.tmdb.org/t/p/${quality}/${backdrop_path}`;
};
export const posterpathImagepath = (
  poster_path: string,
  quality: "w342" | "w500" | "w780" | "original" = "w780"
) => {
  return `https://image.tmdb.org/t/p/${quality}/${poster_path}`;
};
