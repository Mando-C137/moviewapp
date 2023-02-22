// get movies with limit req// get a user by id or name

import type { NextApiRequest, NextApiResponse } from "next";
import { fetch1000Movies } from "../../../../server/utils/scrapeImdb/api_from_tmdb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const allMovies = await fetch1000Movies();

    res.status(200).json({ length: allMovies.length, movies: allMovies });
  } else {
    res.status(405).json({ error: "Unsupported method." });
  }
}
