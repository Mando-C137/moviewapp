import { prisma } from "../../db";

export const getReviewsWithMovieByMovieId = async (movieId: number) => {
  const reviewsWithMovie = await prisma.movie.findUnique({
    where: { tmdb_id: movieId },
    include: {
      reviews: {
        include: { reviewer: true },
      },
    },
  });

  return reviewsWithMovie;
};

export const createReview = async ({
  rating,
  title,
  content,
  movieId,
  reviewerId,
}: {
  rating: number;
  title: string;
  content: string;
  movieId: number;
  reviewerId: string;
}) => {
  const newReview = await prisma.review.create({
    data: {
      rating: rating,
      title: title,
      content: content,
      movieId: movieId,
      reviewerId: reviewerId,
    },
  });
  return newReview;
};
