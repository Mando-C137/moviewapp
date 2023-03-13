// get, post, delete a movie by Id

import type { NextApiRequest, NextApiResponse } from "next";
import {
  getMovieByTmdbId,
  insertManyMovies,
} from "../../../server/utils/database/movie";
import {
  fetchMovieByImdbId,
  fetchMovieByTmdbId,
} from "../../../server/utils/scrapeImdb/api_from_tmdb";
import { scrape } from "../../../server/utils/scrapeImdb/scrapeImdbSites";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    await handleGET(id as string, res);
  } else if (req.method === "POST") {
    const result = await fetchMovieByImdbId(id as string);

    const scrapeRating = await scrape({ type: "title", id: id as string });

    if (!scrapeRating[0]) {
      res.status(500).json({ error: "error when scraping rating" });
    }

    const rating = scrapeRating[0]?.imdbRating;

    if (result !== "error" && result.movie_results[0]) {
      const data = await fetchMovieByTmdbId(result.movie_results[0]?.id);
      if (data !== "error") {
        await insertManyMovies([{ ...data, imdb_rating: rating as number }]);
        res
          .status(200)
          .json({ OK: `Created movie with imdbId ${id as string}` });
      }
    }
  } else {
    res.status(405).json({ error: "Unsupported method" });
  }
}

const handleGET = async (id: string, res: NextApiResponse) => {
  const myId = parseInt(id);

  const movie = await getMovieByTmdbId(myId);

  if (movie) {
    res.status(200).json(movie.og_title);
  } else {
    res.status(404).json({ error: `movie with id ${id} was not found.` });
  }
};
