import type { Movie, Review } from "@prisma/client";
import { z } from "zod";

const reviewSchema = z.object({
  id: z.string(),
  reviewerId: z.string(),
  movieId: z.number(),
  content: z.string(),
  title: z.string(),
  rating: z.number(),
});

export const serializeReview = <U extends Review>(review: U) => {
  return reviewSchema.parse(review);
};

const movieSchema = z.object({
  tmdb_id: z.number(),
  title: z.string(),
  og_title: z.string(),
  imdb_id: z.string().nullable(),
  overview: z.string(),
  release_date: z.date(),
  revenue: z.number(),
  backdrop_path: z.string(),
  poster_path: z.string(),
  runtime: z.number(),
  rating: z.number(),
});

export const serializeMovie = <U extends Movie>(movie: U) => {
  const res = movieSchema.parse(movie);
  return { ...res, release_date: res.release_date.toISOString() };
};
