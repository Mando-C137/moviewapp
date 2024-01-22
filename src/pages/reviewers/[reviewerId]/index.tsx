import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { prisma } from "../../../server/db";
import serialize from "../../../server/utils/database/serialize";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { getServerAuthSession } from "../../../server/auth";
import Routepage from "../../../components/Route/Routepage";

const ReviewerPage = ({
  reviewer,
  userIsOwner,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Routepage
    name={reviewer.name ?? "Reviewer"}
    action={{
      type: "reviewer",
      name: reviewer.name ?? "no user",
      href: `/reviewers/${reviewer.id}`,
    }}
  >
    <div className="grid max-w-full grid-cols-1 gap-8">
      {/* user info  */}
      <div className="flex rounded-xl bg-mygray-100 p-2">
        <div className="flex flex-col gap-1 px-2">
          <h2 className="text-xl font-semibold text-mygray-500">
            {reviewer.name}
          </h2>
          <div>
            <p> Reviews: {reviewer._count.reviews}</p>
            <p> Liked: {reviewer._count.favorites}</p>
            <p> Collections: {reviewer._count.collections}</p>
          </div>
        </div>
        {reviewer.image && reviewer.name && (
          <div className="relative ml-auto mr-2 h-12 w-12">
            <Image
              fill
              className="absolute m-2 rounded-full shadow-lg"
              src={reviewer.image}
              alt={`Image of ${reviewer.name}`}
            ></Image>
          </div>
        )}
      </div>

      <div>
        <details>
          <summary className="cursor-pointer text-lg font-semibold text-primary-400 hover:text-primary-600 hover:underline">
            Reviews
          </summary>
          <MovieCarousel
            reviews={reviewer.reviews}
            movies={reviewer.reviews.map((review) => review.movie)}
          />
        </details>
        <br />
        <h3 className="text-lg font-semibold text-primary-400">Favourites</h3>
        <MovieCarousel movies={reviewer.favorites} />
        <br />
        <div className="flex flex-row gap-2">
          <h3 className="text-lg font-semibold text-primary-400">
            Collections
          </h3>
          <Link href={`/collections/create`}>
            {userIsOwner && (
              <DocumentPlusIcon className="h-6 w-6 text-primary-400" />
            )}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {reviewer.collections.map((collection) => (
            <div
              key={collection.id}
              className="flex flex-col items-start rounded-md bg-mygray-100 p-2"
            >
              <Link href={`/collections/${collection.id}`}>
                <h3 className=" p-1 pt-0 text-lg font-semibold text-primary-600 hover:underline">
                  {collection.title}
                </h3>
              </Link>
              <MovieCarousel
                movies={collection.movies.map((movie) => movie.movie)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </Routepage>
);

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ reviewerId: string }>
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  const user = session?.user;

  const reviewer = await prisma.user.findFirst({
    where: { id: context.params?.reviewerId },
    include: {
      reviews: {
        include: { movie: true },
      },
      favorites: true,
      collections: { include: { movies: { include: { movie: true } } } },
      _count: { select: { favorites: true, reviews: true, collections: true } },
    },
  });

  if (reviewer) {
    return {
      props: {
        reviewer: serialize(reviewer),
        userIsOwner: user ? user.id === reviewer.id : false,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

type InferredReviews = InferGetServerSidePropsType<
  typeof getServerSideProps
>["reviewer"]["reviews"][number];

type InferredFavorites = InferGetServerSidePropsType<
  typeof getServerSideProps
>["reviewer"]["favorites"][number];

const MovieCarousel = ({
  movies,
  reviews,
}: {
  movies: InferredFavorites[];
  reviews?: InferredReviews[];
}) => {
  return (
    <div className="flex max-w-full flex-row gap-2 overflow-x-auto">
      {movies.map((movie, i) => (
        <div
          key={reviews && reviews[i] ? reviews[i]?.id : movie.tmdb_id}
          className=" relative  h-36 w-24 flex-shrink-0 flex-grow-0 flex-nowrap bg-mygray-50 p-2 hover:cursor-pointer"
        >
          <Link
            className="group"
            href={
              reviews && reviews[i]
                ? `/movies/${movie.id}/reviews/${reviews[i]?.id ?? ""}`
                : `/movies/${movie.id}`
            }
          >
            <Image
              className="absolute inset-0  rounded-lg border-2 object-cover group-focus:border-primary-500"
              src={TMDB_API.posterpathImagepath(movie.poster_path, "w342")}
              alt={`Image of ${movie.title}`}
              fill
            ></Image>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ReviewerPage;
