import React from "react";
import { getServerSession } from "../../../../../server/auth";
import { notFound, redirect } from "next/navigation";
import { getReviewByMovieIdAndUserId } from "../../../../../server/utils/database/review";
import { getMovieByTitleId } from "../../../../../server/utils/database/movie";
import Routepage from "../../../../../components/Route/Routepage";
import CreateReviewForm from "./CreateReviewForm";

export default async function CreateReviewPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { movie, user } = await getServerData(id);

  return (
    <Routepage
      name={movie.title}
      action={{
        type: "reviewer",
        href: `reviewers/${user.id}`,
        name: user.name ?? "no user",
      }}
    >
      <CreateReviewForm movie={movie} user={user} />
    </Routepage>
  );
}

const getServerData = async (movieId: string) => {
  const movie = await getMovieByTitleId(movieId);
  const session = await getServerSession();

  if (!session || !session.user) {
    return redirect(`/`);
  }

  const existingReview = await getReviewByMovieIdAndUserId({
    movieId: movieId,
    userId: session.user.id,
  });

  if (existingReview) {
    return redirect(`/movies/${movieId}/reviews/${existingReview.id}/edit`);
  }

  if (!movie) {
    notFound();
  }
  return {
    movie,
    user: session.user,
  };
};

export type ReviewFormProps = Awaited<ReturnType<typeof getServerData>>;
