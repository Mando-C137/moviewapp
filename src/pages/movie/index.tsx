import type { InferGetStaticPropsType } from "next";
import { type GetStaticProps } from "next";
import React from "react";
import TopMovieCard from "../../components/movie/card/TopMovieCard";
import {
  getMoviesLimited,
  serializeMovie,
} from "../../server/utils/database/movie";

type Props = {
  movies: ReturnType<typeof serializeMovie>[];
};

const MoviesRoute: React.FC<Props> = ({
  movies,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="w-full">
      <h1>Top Movies</h1>

      {/* div movie list wrapper */}
      <div className="grid grid-cols-1 gap-y-4">
        {movies.map((movie, i) => (
          <TopMovieCard movie={movie} rank={i + 1} key={movie.tmdb_id} />
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({}) => {
  const movies = await getMoviesLimited(30);

  const serializedMovies = movies.map((movie) => serializeMovie(movie));
  return {
    props: {
      movies: serializedMovies,
    },
  };
};

export default MoviesRoute;
