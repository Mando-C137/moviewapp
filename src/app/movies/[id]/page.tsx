import React from "react";
import {
  createMovie,
  getMovieByTitleId,
} from "../../../server/utils/database/movie";
import Image from "next/image";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  TvIcon,
} from "@heroicons/react/24/solid";
import Routepage from "../../../components/Route/Routepage";
import { notFound } from "next/navigation";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { movieTitleToId } from "../../../utils/helpers";
import { getMoviesIsUsersFavourite } from "../../../server/utils/database/user";
import { getServerSession } from "../../../server/auth";
import LikeButton from "./LikeButton";
import Link from "../../../components/link/Link";

export default async function MovieComponent({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  const user = session?.user ?? null;
  const movie = await getMovie(id);
  const isMovieLiked = !user
    ? null
    : await getMoviesIsUsersFavourite({
        tmdb_id: movie.tmdb_id,
        userId: user?.id,
      });

  return (
    <Routepage
      name={movie.title}
      action={{ type: "movie", name: movie.title, href: `/movies/${movie.id}` }}
    >
      <div className="grid max-w-full grid-cols-1 space-y-2  px-4 py-2 md:mx-auto md:max-w-5xl md:space-y-2 lg:max-w-7xl">
        <div className="relative mx-auto flex aspect-video w-full items-center justify-around md:w-[50vw]  ">
          <Image
            fill
            className=" relative rounded-2xl object-contain after:absolute after:inset-0 after:h-[40%] after:bg-gradient-to-b after:from-transparent after:to-mygray-100 after:content-[''] "
            src={TMDB_API.backdroppathImagepath(
              movie.backdrop_path,
              "original",
            )}
            alt="image"
          />
        </div>
        <h1 className="text-center text-4xl font-bold text-primary-500 ">
          {movie.title}
        </h1>
        <span className="flex h-6 justify-end gap-2 text-base font-bold tracking-tight">
          {user?.id != null && isMovieLiked !== null && (
            <LikeButton
              isMovieLiked={isMovieLiked}
              tmdbId={movie.tmdb_id}
              userId={user?.id}
            />
          )}
          <StarIcon fill="#deb522"></StarIcon>
          {movie.imdb.rating.toFixed(1)} / 10
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
        <div className="flex justify-end">
          <Link href={`/movies/${movie.id}/reviews/create`}>
            Review this movie
          </Link>
        </div>
      </div>
    </Routepage>
  );
}

const getMovie = async (id: string) => {
  const movie = await getMovieByTitleId(id);

  if (movie) {
    return movie;
  }
  const tmdbResult = await TMDB_API.searchMovie(
    id.slice(0, id.lastIndexOf("-")),
  );
  const possibleMovie = tmdbResult.find(
    (result) =>
      movieTitleToId(
        result.title,
        new Date(result.release_date).getFullYear(),
      ) === id.toLowerCase(),
  );
  if (possibleMovie) {
    const movie = await TMDB_API.fetchMovieByTmdbId(possibleMovie.id);
    if (movie !== "error") {
      const savedMovie = await createMovie({ ...movie });
      if (savedMovie !== "error" && savedMovie) {
        return savedMovie;
      }
    }
  }

  notFound();
};

/* export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const movies = await getMoviesLimited(1000);

  const paths = movies.map((movie) => ({ params: { id: movie.id } }));

  return { paths, fallback: true };
}; */
