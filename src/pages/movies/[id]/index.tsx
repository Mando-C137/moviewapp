import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next";
import React, { useState } from "react";
import {
  getMovieByTmdbId,
  getMoviesLimited,
} from "../../../server/utils/database/movie";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import { serializeMovie } from "../../../server/utils/database/serialize";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  HeartIcon as SolidHeartIcon,
  StarIcon,
  TvIcon,
} from "@heroicons/react/24/solid";

import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import axios from "axios";

type Props = {
  movie: ReturnType<typeof serializeMovie>;
};

type Params = ParsedUrlQuery & {
  id: string;
};

const MovieComponent: React.FC<Props> = ({
  movie,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: session } = useSession();

  const user = session?.user ?? null;

  const router = useRouter();

  const handleReviewClicked = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const currentPath = router.asPath;
    await router.push(`${currentPath}/reviews/create`);
  };

  const [movieLiked, setMovieLiked] = useState(true);

  const handleLikeClicked = async () => {
    if (!user) return;

    if (movieLiked) {
      // setIt
      setMovieLiked(false);
      const response = await axios.delete(
        `/api/movies/${movie.tmdb_id}/favourites`
      );

      if (response.status !== 200) {
        //if it was not successfull set it back to true
        setMovieLiked(true);
      }
    } else {
      // setIt
      setMovieLiked(true);
      const response = await axios.post(
        `/api/movies/${movie.tmdb_id}/favourites`
      );

      if (response.status !== 200) {
        //if it was not successfull set it back to true
        setMovieLiked(false);
      }
    }

    //make an api request here
  };

  return (
    <div className="grid w-full grid-cols-1 px-4">
      <div className="flex w-full items-baseline justify-center">
        <Image
          className="m-4 rounded-2xl"
          width={300}
          height={100}
          src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
          alt="image"
          placeholder="empty"
        />
      </div>

      <h1 className="text-center text-2xl font-bold text-primary-500">
        {movie.og_title}
      </h1>
      <span className="flex h-6 justify-end gap-2 text-base font-bold tracking-tight">
        {session?.user && (
          <button className="relative h-6 w-6" onClick={void handleLikeClicked}>
            {movieLiked && (
              <SolidHeartIcon
                className="absolute inset-0"
                fill="#db2777"
              ></SolidHeartIcon>
            )}
            {!movieLiked && (
              <OutlineHeartIcon className="absolute inset-0"></OutlineHeartIcon>
            )}
          </button>
        )}
        <StarIcon fill="#deb522"></StarIcon>
        {movie.rating.toFixed(1)} / 10
      </span>
      {/*  <p
          className=" mt-6 rounded-lg bg-mygray-200 p-4 text-justify font-semibold text-mygray-800"
          style={{ hyphens: "auto" }}
        >
          {movie.overview}
        </p> */}
      <div className="grid grid-cols-1 gap-2 p-4">
        <div className="justify- flex items-center gap-x-4">
          <CurrencyDollarIcon className="h-7" />
          <p>{movie.revenue} millions</p>
        </div>
        <div className="flex items-center gap-x-4">
          <CalendarIcon className="h-7" />
          <p> {new Date(movie.release_date).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-x-4">
          <TvIcon className="h-7" />
          <p>{movie.runtime} minutes</p>
        </div>
      </div>
      <div>
        <button
          className="btn-success btn"
          onClick={(e) => void handleReviewClicked(e)}
        >
          Review this moview
        </button>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params,
}) => {
  if (params) {
    const movie = await getMovieByTmdbId(Number(params.id));

    if (movie) {
      return {
        props: {
          movie: serializeMovie(movie),
        },
      };
    }
  }

  return {
    notFound: true,
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const movies = await getMoviesLimited();

  const paths = movies.map((movie) => ({ params: { id: `${movie.tmdb_id}` } }));

  return { paths, fallback: false };
};

export default MovieComponent;
