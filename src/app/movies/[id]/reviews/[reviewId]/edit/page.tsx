import React from "react";
import { notFound, redirect } from "next/navigation";
import { getReviewByMovieIdAndUserId } from "../../../../../../server/utils/database/review";
import { getServerSession } from "../../../../../../server/auth";
import { getMovieByTitleId } from "../../../../../../server/utils/database/movie";
import Routepage from "../../../../../../components/Route/Routepage";
import UpdateReviewForm from "./UpdateReviewForm";

export default async function EditReviewPage({
  params: { id },
}: {
  params: { id: string; reviewId: string };
}) {
  const { review, movie, user } = await getServerData(id);
  return (
    <Routepage
      name={movie.title}
      action={{
        type: "review",
        href: `/movies/${movie.id}/reviews/${review.id}`,
        name: review.title,
        reviewer: {
          href: `/reviewers/${user.id}`,
          name: user.name ?? "no user",
        },
        movie: { name: movie.title, href: `/movies/${movie.id}` },
      }}
    >
      <UpdateReviewForm movie={movie} review={review} user={user} />
    </Routepage>
  );
}

const getServerData = async (movieId: string) => {
  const movie = await getMovieByTitleId(movieId);

  const session = await getServerSession();

  if (!session || !session.user) {
    return redirect("/");
  }

  if (!movie) {
    notFound();
  }
  const existingReview = await getReviewByMovieIdAndUserId({
    movieId: movieId,
    userId: session.user.id,
  });

  if (!existingReview) {
    return redirect(`/movies/${movieId}/reviews/create`);
  }

  if (session.user.id !== existingReview.reviewerId) {
    return redirect("/");
  }

  return {
    user: session.user,
    movie,
    review: existingReview,
  };
};

export type UpdateReviewFormProps = Awaited<ReturnType<typeof getServerData>>;
