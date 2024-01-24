// get movies with limit req// get a user by id or name

import type { NextApiRequest, NextApiResponse } from "next";
import { getTopRatedMovies } from "../../../server/utils/database/movie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const movies = await getTopRatedMovies();

    res.status(200).json({ size: movies.length, movies: movies });
  } else {
    res.status(405).json({ error: "Unsupported method." });
  }
}
