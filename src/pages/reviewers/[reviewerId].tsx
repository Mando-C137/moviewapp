import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { prisma } from "../../server/db";
import {
  serializeMovie,
  serializeReview,
} from "../../server/utils/database/serialize";

const ReviewerPage = ({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div className="grid max-w-full grid-cols-1 gap-8">
      <div className="flex items-center rounded-xl bg-slate-200 shadow-lg">
        <h2 className="px-2 text-xl font-bold text-primary-600">
          Hello {data.user.name}
        </h2>
        <Image
          className="m-2 ml-auto shadow-xl"
          src={data.user.image as string}
          alt={`Image of ${data.user.name as string}`}
          width={40}
          height={40}
        ></Image>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-400">Reviews</h3>
        <div className="flex flex-row gap-2 overflow-x-scroll ">
          {data.user.reviews.map((review) => (
            <div
              key={review.id}
              className="relative h-36 w-24 flex-shrink-0 flex-grow-0 flex-nowrap bg-mygray-50 p-2"
            >
              <Link href={`/movies/${review.movieId}/reviews/${review.id}`}>
                <Image
                  className="absolute inset-0 rounded-lg object-cover"
                  src={`https://image.tmdb.org/t/p/w200${review.movie.poster_path}`}
                  alt={`Image of ${review.movie.title}`}
                  fill
                ></Image>
              </Link>
            </div>
          ))}
        </div>
        <br />
        With list of favourite movies
        <br />
        With list of ticked movies
        <br />
        with list of watchlist
        <br />
        with list of friends
      </div>
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ reviewerId: string }>
) => {
  const reviewer = await prisma.user.findFirst({
    where: { id: context.params?.reviewerId },
    include: {
      reviews: {
        include: { movie: true },
      },
    },
  });

  if (reviewer) {
    const serialized = {
      ...reviewer,
      reviews: reviewer.reviews.map((review) => {
        return {
          ...serializeReview(review),
          movie: serializeMovie(review.movie),
        };
      }),
    };
    return {
      props: {
        data: { user: serialized },
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

const toStr = (obj: string | string[]) => {
  return typeof obj === "string" ? obj : obj[0] ?? "error";
};

export default ReviewerPage;
