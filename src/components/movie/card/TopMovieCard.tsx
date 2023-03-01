import React, { useState } from "react";
import { type serializeMovie } from "../../../server/utils/database/movie";
import Image from "next/image";
import Link from "next/link";

type Props = {
  movie: ReturnType<typeof serializeMovie>;
  rank: number;
};

const TopMovieCard: React.FC<Props> = ({ movie, rank }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="grid grid-cols-5 rounded-lg bg-mygray-200 p-2 shadow-lg">
      <div className="text-md col-span-3 p-2">
        <h3 className="font-semibold text-mygray-700">
          {rank}.
          <Link href={`/movie/${movie.tmdb_id}`}>
            {" "}
            {movie.title} ({new Date(movie.release_date).getFullYear()})
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <Image
            src={"/imdb.svg"}
            alt="imdb logo"
            height={10}
            width={10}
            className="h-12 w-12"
          ></Image>
          <p>{movie.rating.toFixed(1)} / 10</p>
        </div>
        <label className="label justify-start gap-x-2" htmlFor="watched">
          <span className="label-text">Watched?</span>
          <input
            id="watched"
            type="checkbox"
            checked={checked}
            onChange={() => setChecked((c) => !c)}
            className="checkbox-warning checkbox"
          />
        </label>
      </div>
      <div className="col-span-2">
        <div className="relative ml-auto h-40 w-24 rounded-lg  shadow-sm">
          <Image
            className="rounded-lg object-cover"
            fill
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt="poster image of movie"
          ></Image>
        </div>
      </div>
    </div>
  );
};

export default TopMovieCard;
