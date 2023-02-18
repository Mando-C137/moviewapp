// get movies with limit req// get a user by id or name

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const allReviewers = await prisma.user.findMany();

  res.status(200).json({ size: allReviewers.length, reviewer: allReviewers });
}
