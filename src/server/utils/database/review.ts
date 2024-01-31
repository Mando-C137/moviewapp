import { prisma } from "../../db";

export const getReviewsWithMovieByMovieId = async (movieSlugId: string) => {
  const reviewsWithMovie = await prisma.movie.findUnique({
    where: { id: movieSlugId },
    include: {
      reviews: {
        include: { reviewer: true },
      },
    },
  });

  return reviewsWithMovie;
};

export const getReviewById = async (id: string) => {
  return await prisma.review.findUnique({
    where: { id: id },
    include: { movie: true, reviewer: true },
  });
};

export const getReviewByMovieIdAndUserId = async ({
  movieId,
  userId,
}: {
  movieId: string;
  userId: string;
}) => {
  const review = await prisma.review.findFirst({
    where: { reviewerId: userId, movie: { id: movieId } },
  });

  return review;
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
    include: { movie: { select: { id: true } } },
  });
  return newReview;
};
export const updateReview = async ({
  rating,
  title,
  content,
  id,
}: {
  rating: number;
  title: string;
  content: string;
  id: string;
}) => {
  const updatedReview = await prisma.review.update({
    data: {
      rating: rating,
      title: title,
      content: content,
    },
    where: {
      id: id,
    },
    include: { movie: true },
  });
  return updatedReview;
};
