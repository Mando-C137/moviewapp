import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "../../../server/auth";
import { createCollectionForUser } from "../../../server/utils/database/user";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { insertManyMovies } from "../../../server/utils/database/movie";
import type { TmdbResult } from "../../../server/utils/tmdb_api";

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    return handlePost(req, res, session.user.id);
  }
};

// create New Collection
const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => {
  const body = postCollectionSchema.safeParse(req.body);

  if (!body.success) {
    return res
      .status(400)
      .json({ error: "missing information to create collection" });
  } else {
    try {
      await addMoviesIfDonotExist(body.data.movieIds);
      const collection = await createCollectionForUser({
        userId,
        ...body.data,
      });
      return res.status(200).json({ collection });
    } catch (e) {
      console.log(e);
      return res
        .status(500)
        .json({ error: "An error occured when creating the collection" });
    }
  }
};

export const addMoviesIfDonotExist = async (tmdb_ids: number[]) => {
  const movies = (
    await Promise.all(tmdb_ids.map((id) => TMDB_API.fetchMovieByTmdbId(id)))
  ).filter((movie): movie is TmdbResult => movie !== "error");

  await insertManyMovies(movies);
};

export const postCollectionSchema = z.object({
  title: z.string(),
  description: z.string(),
  movieIds: z.number().array(),
});

export type CollectionPost = z.infer<typeof postCollectionSchema>;
export default handler;
