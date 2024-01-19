import type { NextApiRequest, NextApiResponse } from "next";
import { insertManyMovies } from "../../../../server/utils/database/movie";
import type { TmdbResultWithImdbRating } from "../../../../server/utils/scrapeImdb/api_from_tmdb";
import { fetch250Movies } from "../../../../server/utils/scrapeImdb/api_from_tmdb";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const allMovies: TmdbResultWithImdbRating[] = await fetch250Movies();
      await insertManyMovies(allMovies);
      return res
        .status(200)
        .json({ length: allMovies.length, movies: allMovies });
    } catch (e) {
      return res.status(500).json({ error: "Error when scraping imdb" });
    }
  } else {
    return res.status(405).json({ error: "Unsupported method." });
  }
}
