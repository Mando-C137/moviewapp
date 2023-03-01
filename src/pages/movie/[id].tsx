import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import {
  getMovieByTmdbId,
  getMoviesLimited,
  serializeMovie,
} from "../../server/utils/database/movie";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  TvIcon,
} from "@heroicons/react/24/outline";

type Props = {
  message: "error" | ReturnType<typeof serializeMovie>;
};

type Params = ParsedUrlQuery & {
  id: string;
};

const MovieComponent: React.FC<Props> = ({
  message,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (message === "error") return <div>error</div>;
  return (
    <>
      <div className="grid w-full grid-cols-1 px-4">
        <div className="flex w-full items-baseline justify-center">
          <Image
            className="m-4 rounded-2xl"
            width={300}
            height={100}
            src={`https://image.tmdb.org/t/p/w500/${message.backdrop_path}`}
            alt="image"
            placeholder="empty"
          />
        </div>

        <h1 className="text-center text-2xl font-bold text-primary-500">
          {message.og_title}
        </h1>
        <span className="inline-flex h-6 justify-end gap-2 text-base font-bold tracking-tight">
          <StarIcon fill="#deb522"></StarIcon>
          {message.rating} / 10
        </span>
        <p
          className=" mt-6 rounded-lg bg-mygray-200 p-4 text-justify font-semibold text-mygray-800"
          style={{ hyphens: "auto" }}
        >
          {message.overview}
        </p>
        <div className="grid grid-cols-1 gap-2 p-4">
          <div className="flex items-center gap-x-4">
            <CurrencyDollarIcon className="h-7" />
            <p>{message.revenue} millions</p>
          </div>
          <div className="flex items-center gap-x-4">
            <CalendarIcon className="h-7" />
            <p> {new Date(message.release_date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-x-4">
            <TvIcon className="h-7" />
            <p>{message.runtime} minutes</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (params) {
    const movie = await getMovieByTmdbId(Number(params.id));
    return {
      props: {
        message: movie ? serializeMovie(movie) : "error",
      },
    };
  }

  return {
    props: { message: "error" },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const movies = await getMoviesLimited();

  const paths = movies.map((movie) => ({ params: { id: `${movie.tmdb_id}` } }));

  return { paths, fallback: false };
};

export default MovieComponent;
