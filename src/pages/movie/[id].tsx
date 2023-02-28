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
      <h1>{message.og_title}</h1>
      <div>
        <Image
          width={300}
          height={100}
          src={`https://image.tmdb.org/t/p/w500/${message.backdrop_path}`}
          alt="image"
          placeholder="empty"
        />

        <p>{message.rating} / 10</p>
        <p>{message.overview}</p>
        <p> {message.revenue} millions</p>
        <p>{new Date(message.release_date).toDateString()}</p>
        <p>{message.runtime} minutes</p>
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
