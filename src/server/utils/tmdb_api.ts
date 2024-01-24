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

export type ImdbResult = {
  movie_results: {
    id: number;
    title: string;
  }[];
};
export const fetchMovieByImdbId = async (id: string) => {
  try {
    const response = await axios.get<ImdbResult>(
      `${env.TMDB_BASE_URL}/find/${id}?api_key=${env.TMDB_CLIENT_ID}&language=en-US&external_source=imdb_id`
    );
    return { ...response.data };
  } catch (e) {
    console.log(`error when fetching movie from TMDB API by imdb id = ${id}`);
    return "error";
  }
};
export const backdroppathImagepath = (
  backdrop_path: string,
  quality: "w300" | "w780" | "w1280" | "original" = "w780"
) => {
  return `https://image.tmdb.org/t/p/${quality}/${backdrop_path}` as const;
};
export const posterpathImagepath = (
  poster_path: string,
  quality: "w342" | "w500" | "w780" | "original" = "w780"
) => {
  return `https://image.tmdb.org/t/p/${quality}/${poster_path}` as const;
};

const fetchImdbIdSchema = z.object({ imdb_id: z.string() });

const fetchImdbId = async (tmdbId: number) => {
  const params = new URLSearchParams({
    api_key: env.TMDB_CLIENT_ID,
  }).toString();
  const url = `${env.TMDB_BASE_URL}/${tmdbId}/external_ids?${params}`;

  return fetchImdbIdSchema.parse(await axios.get(url));
};

const topRatedSiteSchema = z.object({
  page: z.number(),
  results: z
    .object({
      id: z.number(),
      title: z.string(),
      original_title: z.string(),
      overview: z.string(),
      popularity: z.number(),
      poster_path: z.string(),
      backdrop_path: z.string(),
      release_date: z.string(),
    })
    .array(),
  total_pages: z.number(),
});

const fetchTopRatedSite = async (page: number) => {
  const params = new URLSearchParams({
    api_key: env.TMDB_CLIENT_ID,
    page: `${page}`,
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    sort_by: "vote_average.desc",
    without_genres: "99,10755",
    "vote_count.gte": "500",
  }).toString();
  const url = `${env.TMDB_BASE_URL}/discover/movie?${params}`;
  return topRatedSiteSchema.parse((await axios.get(url)).data);
};

export const fetchMultipleTopRatedSites = async (limit: number) => {
  let currentPage = 1;
  const results: TmdbResult[] = [];

  while (currentPage <= limit) {
    const currentResponse = await fetchTopRatedSite(currentPage);
    const add = (
      await Promise.all(
        currentResponse.results.map((res) => fetchMovieByTmdbId(res.id))
      )
    ).filter((res): res is Exclude<typeof res, "error"> => res !== "error");
    results.push(...add);
    currentPage++;
    console.log("currentPage", currentPage);
  }
  return results;
};
export const fetchNowPlayingMovies = async () => {
  const params = new URLSearchParams({
    api_key: env.TMDB_CLIENT_ID,
    page: "1",
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    sort_by: "popularity.desc",
    without_genres: "99,10755",
    with_release_type: "2|3",
    "release_date.gte": "{min_date}",
    "release_date.lte": "{max_date}",
  }).toString();

  const url = `${env.TMDB_BASE_URL}/discover/movie?${params}`;
  return topRatedSiteSchema.parse((await axios.get(url)).data);
};

export const fetchPopularMovies = async () => {
  const params = new URLSearchParams({
    api_key: env.TMDB_CLIENT_ID,
    page: "1",
    include_adult: "false",
    include_video: "false",
    language: "en-US",
    sort_by: "popularity.desc",
    without_genres: "99,10755",
    with_release_type: "2|3",
    "vote_count.gte": "500",
  }).toString();

  const url = `${env.TMDB_BASE_URL}/discover/movie?${params}`;

  const data = topRatedSiteSchema.parse((await axios.get(url)).data);
  console.log(JSON.stringify(data.results));
  const movies = await Promise.all(
    data.results.map((movie) => fetchMovieByTmdbId(movie.id))
  );
  return movies.filter(
    (movie): movie is Exclude<typeof movie, "error"> => movie !== "error"
  );
};
