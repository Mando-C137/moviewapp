import Link from "next/link";
import Image from "next/image";
import React from "react";
import { getTopRatedMovies } from "../../../server/utils/database/movie";
import * as TMDB_API from "../../../server/utils/tmdb_api";
import Routepage from "../../../components/Route/Routepage";

export default async function TopRatedPage() {
  const movies = await getServerdata();

  return (
    <Routepage name={"Movies"} action={{ type: "reset" }}>
      <div className="w-full">
        <h1 className="p-2 text-lg font-bold text-primary-600">
          Top Movies (sorted by Imdb)
        </h1>

        {/* div movie list wrapper */}
        <div className="grid grid-cols-1 gap-y-4">
          {movies.map((movie, i) => (
            <div
              className="grid grid-cols-5 rounded-lg bg-mygray-100 p-2 shadow-sm"
              key={movie.id}
            >
              <div className="text-md col-span-3 p-2">
                <h3 className="font-semibold text-mygray-700 focus-within:underline hover:underline focus:underline">
                  {i + 1}.&nbsp;
                  <Link href={`/movies/${movie.id}`}>
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
                  <p>{movie.imdb.rating.toFixed(1)} / 10</p>
                </div>
              </div>
              <div className="col-span-2">
                <div className="relative ml-auto h-40 w-24 rounded-lg  shadow-sm">
                  <Image
                    className="rounded-lg object-cover"
                    fill
                    src={TMDB_API.posterpathImagepath(movie.poster_path)}
                    alt="poster image of movie"
                  ></Image>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Routepage>
  );
}

const getServerdata = async () => {
  return await getTopRatedMovies(100);
};
