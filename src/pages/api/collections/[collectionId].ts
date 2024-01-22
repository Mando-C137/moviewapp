import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/auth";
import {
  deleteCollection,
  editCollection,
  getCollectionById,
} from "../../../server/utils/database/user";
import { addMoviesIfDonotExist, postCollectionSchema } from ".";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req: req, res: res });
  const { collectionId } = req.query;

  if (typeof collectionId !== "string") {
    return res.status(400).json({ error: "missing collectionId" });
  }

  if (!session?.user) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const collection = await handleGet(collectionId);
    if (collection === "error") {
      return res
        .status(404)
        .json({ error: "No Collection Found with corresponding id" });
    } else {
      return res.status(200).json({ collection: collection });
    }
  } else if (req.method === "PUT") {
    const body = postCollectionSchema.safeParse(req.body);
    if (!body.success) {
      return res
        .status(400)
        .json({ error: "Missing information to put collection" });
    }

    try {
      await addMoviesIfDonotExist(body.data.movieIds);
      const collection = await editCollection(collectionId, body.data);
      if (collection === "error")
        throw new Error("error when putting the collection");
      return res.status(200).json({ collection });
    } catch (e) {
      return res
        .status(500)
        .json({ error: "error when putting the colleciotn" });
    }
  } else if (req.method === "DELETE") {
    try {
      const collection = await deleteCollection(collectionId);
      return res.status(200).json({ collection });
    } catch (e) {
      return res
        .status(500)
        .json({ error: "error when putting the colleciotn" });
    }
  }
};

const handleGet = async (collectionId: string) => {
  const collection = await getCollectionById(collectionId);
  return collection;
};
export default handler;
