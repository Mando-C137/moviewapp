import type { NextApiRequest, NextApiResponse } from "next";
import {
  filterMoviesWithUnknownImdbId,
  insertManyMovies,
} from "../../../../server/utils/database/movie";
import * as TMDB_API from "../../../../server/utils/tmdb_api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      let allMovies = await TMDB_API.fetchMultipleTopRatedSites(20);
      allMovies = await filterMoviesWithUnknownImdbId(allMovies);

      await insertManyMovies(allMovies);
      return res
        .status(200)
        .json({ length: allMovies.length, movies: allMovies });
    } catch (e) {
      return res.status(500).json({
        error: "An error occured when fetching top rated movies from tmbdb",
      });
    }
  } else {
    return res.status(405).json({ error: "Unsupported method." });
  }
}
