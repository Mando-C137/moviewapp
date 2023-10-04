// Create review for moview
// Get all reviews from
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { createReview } from "../../../../../server/utils/database/review";
import { userExists } from "../../../../../server/utils/database/user";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create review
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  res.status(200);
}

const bodySchemaForPostReview = z.object({
  movieId: z.number(),
  title: z.string(),
  content: z.string(),
  rating: z.number().min(1).max(10).multipleOf(1),
});

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = bodySchemaForPostReview.safeParse(req.body);
  const userId = req.query.id as string;
  const userexists = await userExists(userId);

  if (body.success && userexists) {
    const reviewCreated = await createReview({
      rating: body.data.rating,
      title: body.data.title,
      content: body.data.content,
      movieId: body.data.movieId,
      reviewerId: userId,
    });

    res.status(201).json({
      url: `/movies/${reviewCreated.movie.id}/reviews/${reviewCreated.id}`,
    });
  } else {
    res.status(400).json({ error: "missing information to create review" });
  }
};
