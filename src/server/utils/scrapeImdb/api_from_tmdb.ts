import axios from "axios";
import { z } from "zod";
import { env } from "../../../env.mjs";
import type { ScrapeResult } from "./scrapeImdbSites";
import { scrape } from "./scrapeImdbSites";

const fetch250Movies = async () => {
  const top250Imdb = await scrape({ type: "top250" });
  console.log(`found ${top250Imdb.length} imdbRatings/Ids by scraping`);
  return await fetchByScrapeIds(top250Imdb);
};

const fetch1000Movies = async () => {
  const top1000Imdb = await scrape({ type: "top1000" });
  console.log(`found ${top1000Imdb.length} imdbRatings/Ids by scraping`);
  return await fetchByScrapeIds(top1000Imdb);
};

const scrapeByImdbId = async (imdbId: string) => {
  const imdbInfo = await scrape({ type: "title", id: imdbId });
  return imdbInfo[0];
};

const fetchByScrapeIds = async (scrapeResults: ScrapeResult[]) => {
  const result: TmdbResultWithImdbRating[] = [];
  const fetchByImdb = [];
  for (const idAndRating of scrapeResults) {
    fetchByImdb.push(fetchMovieByImdbId(idAndRating.imdbId));
  }

  const allTmdbIds = await Promise.all(fetchByImdb);
  const allFinalTmdbFetches: Promise<TmdbResult | "error">[] = [];

  for (let i = 0; i < allTmdbIds.length; i++) {
    const imdbResult = allTmdbIds[i];
    if (imdbResult === "error") {
      continue;
    }
    if (!imdbResult?.movie_results[0]) {
      continue;
    }
    allFinalTmdbFetches.push(
      fetchMovieByTmdbId(imdbResult.movie_results[0].id)
    );
  }

  const results = await Promise.all(allFinalTmdbFetches);
  for (const tmdbResult of results) {
    if (tmdbResult === "error") {
      continue;
    }

    result.push({
      ...tmdbResult,
      imdb_rating:
        scrapeResults.find((res) => res.imdbId === tmdbResult.imdb_id)
          ?.imdbRating ?? -1,
    });
  }
  return result;
};

const fetchMovieByImdbId = async (id: string) => {
  try {
    const response = await axios.get(
      `${env.TMDB_BASE_URL}/find/${id}?api_key=${env.TMDB_CLIENT_ID}&language=en-US&external_source=imdb_id`
    );
    return response.data as ImdbResult;
  } catch (e) {
    console.log(`error when fetching by imdb id with id = ${id}`);
    return "error";
  }
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

const fetchMovieByTmdbId = async (idParam: number) => {
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

type ImdbResult = {
  movie_results: {
    id: number;
    title: string;
  }[];
};

type TmdbResult = {
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
export {
  fetch250Movies,
  fetch1000Movies,
  scrapeByImdbId,
  fetchMovieByTmdbId,
  fetchMovieByImdbId,
};
export type TmdbResultWithImdbRating = TmdbResult & { imdb_rating: number };
