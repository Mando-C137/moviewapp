import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import React from "react";
import { getReviewsWithMovieByMovieId } from "../../../../server/utils/database/review";
import serialize from "../../../../server/utils/database/serialize";
import Routepage from "../../../../components/Route/Routepage";

const index = ({
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
                <p className="h-20 overflow-x-scroll">{review.content}</p>
                <div className="absolute right-0 bottom-0 mb-1 mr-2 ">
                  {review.rating}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Routepage>
  );
};

export default index;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>
) => {
  const id = context.params?.id;
  if (!id || !+id) {
    return {
      notFound: true,
    };
  }

  const reviews = await getReviewsWithMovieByMovieId(+id);

  if (!reviews) {
    return {
      notFound: true,
    };
  }

  const movie = serialize(reviews);

  return {
    props: {
      movie,
    },
  };
};
