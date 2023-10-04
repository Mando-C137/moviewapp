import type { NextApiRequest, NextApiResponse } from "next";
import * as TMDB_API from "../../../server/utils/tmdb_api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const query = req.query.query;
    if (typeof query !== "string") {
      return res.status(400).json({ error: "no search provided" });
    }

    const searchResults = await TMDB_API.searchMovie(query);
    return res.status(200).json({ results: searchResults });
  } else {
    return res.status(405).json({ error: "Unsupported method." });
  }
}
