import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../server/auth";
import { addOrRemoveMovieFromFavorites } from "../../../../server/utils/database/movie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    return handlePost(req, res);
  } else if (req.method === "DELETE") {
    return handleDelete(req, res);
  }
}

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(403).send({ error: "Unauthorized Access" });
    return;
  }

  const user = session.user;
  const { id } = req.query;

  const dbUser = await addOrRemoveMovieFromFavorites({
    add: true,
    tmdbId: Number(id),
    userId: user.id,
  });

  if (dbUser === "error") {
    return res.status(500).send({ error: "Internal Server Error" });
  }

  return res.status(200).send({
    success: `You added the movie ${id as string} from/to favourites  `,
  });
};
const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(403).send({ error: "Unauthorized Access" });
    return;
  }

  const user = session.user;
  const { id } = req.query;

  const dbUser = await addOrRemoveMovieFromFavorites({
    add: false,
    tmdbId: Number(id),
    userId: user.id,
  });

  if (dbUser === "error") {
    return res.status(500).send({ error: "Internal Server Error" });
  }

  return res.status(200).send({
    success: `You removed the movie ${id as string} from/to favourites  `,
  });
};
