import axios from "axios";
import { env } from "../../../env.mjs";
import type { ScrapeResult } from "./scrapeImdbSites";
import { scrape } from "./scrapeImdbSites";
import type { TmdbResult } from "../tmdb_api";
import * as TMDB_API from "../tmdb_api";

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
      TMDB_API.fetchMovieByTmdbId(imdbResult.movie_results[0].id)
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

type ImdbResult = {
  movie_results: {
    id: number;
    title: string;
  }[];
};

export { fetch250Movies, fetch1000Movies, scrapeByImdbId, fetchMovieByImdbId };
export type TmdbResultWithImdbRating = TmdbResult & { imdb_rating: number };
