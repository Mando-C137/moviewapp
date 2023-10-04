import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import {
  getReviewById,
  updateReview,
} from "../../../../../server/utils/database/review";
import serialize from "../../../../../server/utils/database/serialize";
import { userExists } from "../../../../../server/utils/database/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create review
  if (req.method === "PUT") {
    return handlePUT(req, res);
  }

  res.status(405);
}

const bodySchemaForPut = z.object({
  content: z.string(),
  title: z.string(),
  rating: z.number().min(0).max(10),
});

const handlePUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = bodySchemaForPut.safeParse(req.body);

  const userDoesExit = await userExists(req.query.id as string);

  if (!body.success) {
    return res.status(400).send({ error: "Missing information in body" });
  }

  if (!userDoesExit) {
    return res
      .status(404)
      .send({ notFound: `No user with id ${req.query.id as string}` });
  }

  const review = await getReviewById(req.query.reviewId as string);

  if (!review) {
    return res
      .status(404)
      .send({ notFound: `No review with id ${req.query.reviewId as string}` });
  }

  const updatedReview = await updateReview({
    ...body.data,
    id: req.query.reviewId as string,
  });

  return res.status(200).json({ review: serialize(updatedReview) });
};
