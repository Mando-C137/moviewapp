import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import React from "react";
import { prisma } from "../../../../../server/db";
import serialize from "../../../../../server/utils/database/serialize";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import * as TMDB_API from "../../../../../server/utils/tmdb_api";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { getServerAuthSession } from "../../../../../server/auth";
import { Ranking } from "../../../../../components/movierank/MovieRank";
import Pagewrapper from "../../../../../components/Pagewrapper/Pagewrapper";
import Routepage from "../../../../../components/Route/Routepage";
import { useRouter } from "next/router";

const Review = ({
  review,
  userIsOwner,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const rating = review.rating;
  //const starArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const router = useRouter();

  return (
    <Routepage
      name={review.movie.title}
      action={{
        type: "review",
        name: review.title,
        href: router.asPath,
        movie: { name: review.movie.title, href: `/movies/${review.movie.id}` },
        reviewer: {
          name: review.reviewer.name ?? "no user",
          href: `/reviewers/${review.reviewer.id}`,
        },
      }}
    >
      <Pagewrapper>
        <div className=" p-4 md:w-[66%] ">
          <Movieinfo review={review} userIsOwner={userIsOwner} />

          <div className="mt-6 ">
            <div className="flex flex-col space-y-3 rounded">
              <div className="flex items-baseline space-x-4 pl-4">
                <h1 className="mx-auto text-center   text-2xl font-bold text-mygray-800 lg:text-3xl">
                  {review.title}
                </h1>
                <div className="ml-auto mr-0">
                  <Ranking rank={rating}></Ranking>
                </div>
              </div>
              <p className=" min-h-16 w-full break-words  rounded bg-mygray-100 p-2 text-justify text-mygray-600 ">
                {review.content}
              </p>
            </div>
          </div>
        </div>
      </Pagewrapper>
    </Routepage>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { reviewId } = context.query;
  const session = await getServerAuthSession({ ...context });
  const user = session?.user;

  const review = await prisma.review.findUnique({
    where: { id: reviewId as string },
    include: { movie: true, reviewer: true },
  });

  return review
    ? {
        props: {
          userIsOwner: (user && user.id === review.reviewerId) ?? false,
          review: serialize(review),
        },
      }
    : { notFound: true };
};

const Movieinfo = ({
  userIsOwner,
  review,
}: {
  userIsOwner: boolean;
  review: InferGetServerSidePropsType<typeof getServerSideProps>["review"];
}) => {
  return (
    <div className="flex  flex-row">
      <div className="flex flex-grow flex-col items-start p-2 align-baseline">
        <div className=" flex flex-row items-center justify-center gap-2">
          <UserCircleIcon className="h-6 w-6 text-mygray-600"></UserCircleIcon>

          <Link href={`/reviewers/${review.reviewer.id}`}>
            <h3 className="text-mygray-600">{review.reviewer.name}</h3>
          </Link>
          {userIsOwner && (
            <Link href={`/movies/${review.movie.id}/reviews/${review.id}/edit`}>
              <PencilSquareIcon className="h-6 w-6 text-primary-400 hover:text-primary-600" />
            </Link>
          )}
        </div>
        <p className=" mt-2 text-xl font-bold tracking-tight text-mygray-800 lg:text-3xl ">
          {review.movie.title}
        </p>
        <p className="font-bold text-mygray-700">
          {new Date(review.movie.release_date).getFullYear()}
        </p>

        {/* Rating */}
        {/*           <div className="grid grid-cols-5">
            {starArray.map((star, i) => (
              <StarIcon
                key={i}
                className={`h-6 w-6 ${
                  star <= rating ? "text-yellow-500" : "text-mygray-500"
                }`}
              ></StarIcon>
            ))}
          </div> */}
      </div>
      <div className="relative h-40 w-24 flex-shrink-0 flex-grow-0 lg:h-52 lg:w-32">
        <Image
          src={TMDB_API.posterpathImagepath(review.movie.poster_path)}
          alt={`Image of the movie ${review.movie.title}`}
          className="border-md absolute inset-0 rounded border border-mygray-500 object-cover"
          fill
        />
      </div>
    </div>
  );
};

export default Review;
