// get movies with limit req// get a user by id or name

import type { NextApiRequest, NextApiResponse } from "next";
import { getAllReviewers } from "../../../server/utils/database/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allReviewers = await getAllReviewers();

  res.status(200).json({ size: allReviewers.length, reviewer: allReviewers });
}
