// get movies with limit req// get a user by id or name

import type { NextApiRequest, NextApiResponse } from "next";
import { getMoviesLimited } from "../../../server/database/movieFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const movies = await getMoviesLimited();

    res.status(200).json({ size: movies.length, movies: movies });
  } else {
    res.status(405).json({ error: "Unsupported method." });
  }
}
