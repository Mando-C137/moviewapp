import React from "react";
import { getReviewsWithMovieByMovieId } from "../../../../server/utils/database/review";
import Routepage from "../../../../components/Route/Routepage";
import { notFound } from "next/navigation";

export default async function ReviewsForMoviePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const movie = await getServerdata(id);
  return (
    <Routepage
      name={movie.title}
      action={{ type: "movie", name: movie.title, href: `/movies/${movie.id}` }}
    >
      <div className="m-2 grid grid-cols-1 gap-4">
        <h1 className="text-center text-2xl font-bold tracking-tighter text-mygray-700">
          Reviews on {movie.title}
        </h1>

        <ul className="flex flex-col gap-4">
          {movie.reviews.map((review) => (
            <li key={review.id}>
              <div className="relative flex flex-col rounded-lg bg-mygray-700 p-2 font-semibold text-primary-300">
                <h3>
                  {review.title} by {review.reviewer.name}
                </h3>
                <p className="h-20 overflow-x-auto">{review.content}</p>
                <div className="absolute bottom-0 right-0 mb-1 mr-2 ">
                  {review.rating} / 10
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Routepage>
  );
}

const getServerdata = async (movieSlug: string) => {
  const reviews = await getReviewsWithMovieByMovieId(movieSlug);

  if (!reviews) {
    notFound();
  }

  return reviews;
};
