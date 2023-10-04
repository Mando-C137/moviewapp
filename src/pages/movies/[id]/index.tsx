import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React, { useEffect, useState } from "react";
import {
  createMovie,
  getMovieByTitleId,
} from "../../../server/utils/database/movie";
import Image from "next/image";
import type { ParsedUrlQuery } from "querystring";
import { useSession } from "next-auth/react";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  HeartIcon as SolidHeartIcon,
  StarIcon,
  TvIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import type { Serialized } from "../../../server/utils/database/serialize";
import serialize from "../../../server/utils/database/serialize";
import type { Movie } from "@prisma/client";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import { movieTitleToId } from "../../../utils/helpers";
import Button from "../../../components/button/Button";
import Routepage from "../../../components/Route/Routepage";

type Params = ParsedUrlQuery & {
  id: string;
};
type Props = {
  movie: Serialized<Movie>;
};

const MovieComponent = ({
  movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();

  const user = session?.user ?? null;

  const [movieLiked, setMovieLiked] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchFavourites = async () => {
      if (!user) {
        setMovieLiked(null);
        return;
      }

      try {
        const favourites = (
          await axios.get<{ favourites: number[] }>(
            `/api/reviewers/${user.id}/favourites`
          )
        ).data;

        setMovieLiked(
          favourites.favourites.some((tmdb_id) => tmdb_id === movie.tmdb_id)
        );
      } catch (e) {
        setMovieLiked(null);
      }
    };

    void fetchFavourites();
  }, [user, movie]);

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
  };

  return (
    <Routepage
      name={movie.title}
      action={{ type: "movie", name: movie.title, href: `/movies/${movie.id}` }}
    >
      <div className=" grid max-w-full grid-cols-1 space-y-2  px-4 py-2 md:mx-auto md:max-w-5xl md:space-y-2 lg:max-w-7xl">
        <div className="relative mx-auto flex aspect-video w-full items-center justify-around md:w-[50vw]  ">
          <Image
            fill
            className=" relative rounded-2xl object-contain after:absolute after:inset-0 after:h-[40%] after:bg-gradient-to-b after:from-transparent after:to-mygray-100 after:content-[''] "
            src={TMDB_API.backdroppathImagepath(
              movie.backdrop_path,
              "original"
            )}
            alt="image"
          />
        </div>
        <h1 className="text-center text-4xl font-bold text-primary-500 ">
          {movie.title}
        </h1>
        <span className="flex h-6 justify-end gap-2 text-base font-bold tracking-tight">
          {session?.user && (
            <button
              className="relative h-6 w-6"
              onClick={() => void handleLikeClicked()}
            >
              {movieLiked != null && movieLiked && (
                <SolidHeartIcon
                  className="absolute inset-0"
                  fill="#db2777"
                ></SolidHeartIcon>
              )}
              {movieLiked != null && !movieLiked && (
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
        <div className="flex justify-end">
          <Button
            as="link"
            role="button"
            action={`/movies/${movie.id}/reviews/create`}
          >
            Review this movie
          </Button>
        </div>
      </div>
    </Routepage>
  );
};

//export const getStaticProps: GetStaticProps<Props, Params> = async ({
export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}) => {
  if (params) {
    const movie = await getMovieByTitleId(params.id);

    if (movie) {
      return {
        props: {
          movie: serialize(movie),
        },
      };
    }

    const tmdbResult = await TMDB_API.searchMovie(params.id);
    const possibleMovie = tmdbResult.find(
      (result) => movieTitleToId(result.title) === params.id.toLowerCase()
    );
    if (possibleMovie) {
      const movie = await TMDB_API.fetchMovieByTmdbId(possibleMovie.id);
      if (movie !== "error") {
        const savedMovie = await createMovie({ ...movie, imdb_rating: 0 });
        if (savedMovie !== "error" && savedMovie) {
          return {
            props: {
              movie: serialize(savedMovie),
            },
          };
        }
      }
    }
  }

  return {
    notFound: true,
  };
};

/* export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const movies = await getMoviesLimited(1000);

  const paths = movies.map((movie) => ({ params: { id: movie.id } }));

  return { paths, fallback: true };
}; */

export default MovieComponent;
