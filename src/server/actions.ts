"use server";
import { z } from "zod";
import {
  addOrRemoveMovieFromFavorites,
  filterMoviesWithUnknownImdbId,
  insertManyMovies,
} from "./utils/database/movie";
import { fetchMultipleTopRatedSites } from "./utils/tmdb_api";
import { redirect } from "next/navigation";
import {
  createReview,
  getReviewById,
  updateReview,
} from "./utils/database/review";
import { revalidatePath } from "next/cache";

export const importMovies = async (
  state: { message: string; success: boolean } | { message: null },
  payload: FormData,
): Promise<typeof state> => {
  state;
  payload;
  try {
    let allMovies = await fetchMultipleTopRatedSites(20);
    allMovies = await filterMoviesWithUnknownImdbId(allMovies);
    await insertManyMovies(allMovies);

    return {
      message: `${allMovies.length} were added to the database`,
      success: true,
    };
  } catch (e) {
    return {
      message: "An error occured when fetching top rated movies from tmbdb",
      success: false,
    };
  }
};

export const likeMovie = async (
  userId: string,
  add: boolean,
  tmdbId: number,
) => {
  return await addOrRemoveMovieFromFavorites({
    userId,
    add,
    tmdbId,
  });
};

const reviewSchema = z.object({
  movieId: z.number(),
  title: z.string().min(1),
  content: z.string().min(1),
  rating: z.coerce.number().min(1).max(10).multipleOf(1),
});

export const createReviewAction = async (
  {}: { message: string },
  formdata: FormData,
) => {
  const title = formdata.get("title");
  const rating = formdata.get("rating");
  const content = formdata.get("content");
  const movieId = Number(formdata.get("movieId"));
  const userId = String(formdata.get("userId"));

  const body = reviewSchema.safeParse({ title, rating, content, movieId });

  if (!body.success) {
    return {
      message: "missing information to create review" + body.error.message,
    };
  }
  const reviewCreated = await createReview({
    rating: body.data.rating,
    title: body.data.title,
    content: body.data.content,
    movieId: body.data.movieId,
    reviewerId: userId,
  });
  redirect(`/movies/${reviewCreated.movie.id}/reviews/${reviewCreated.id}`);
};

export const updateReviewAction = async (
  {}: { message: string },
  formdata: FormData,
) => {
  const title = formdata.get("title");
  const rating = formdata.get("rating");
  const content = formdata.get("content");
  const reviewId = String(formdata.get("reviewId"));

  const review = await getReviewById(reviewId);
  if (!review) {
    return { message: `No review found with id ${reviewId}` };
  }
  const body = reviewSchema.safeParse({
    title,
    rating,
    content,
    movieId: review.movieId,
  });
  if (!body.success) {
    return {
      message: "missing information to create review" + body.error.message,
    };
  }

  const updatedReview = await updateReview({
    ...body.data,
    id: reviewId,
  });

  revalidatePath(
    `/movies/${updatedReview.movie.id}/reviews/${updatedReview.id}`,
  );
  return redirect(
    `/movies/${updatedReview.movie.id}/reviews/${updatedReview.id}`,
  );
};
