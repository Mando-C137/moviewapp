import type { NextApiRequest, NextApiResponse } from "next";
import { getUsersFavourites } from "../../../../server/utils/database/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return;
  }

  const favourites = await getUsersFavourites({ id });

  return res.status(200).json({ favourites });
}
