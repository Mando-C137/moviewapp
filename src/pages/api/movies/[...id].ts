// get, post, delete a movie by Id

import type { NextApiRequest, NextApiResponse } from "next";
import { getMovieById } from "../../../server/database/movieFunctions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    await handleGET(id as string, res);
  } else {
    res.status(405).json({ error: "Unsupported method" });
  }
}

const handleGET = async (id: string, res: NextApiResponse) => {
  const movie = await getMovieById(id);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).json({ error: `movie with id ${id} was not found.` });
  }
};
