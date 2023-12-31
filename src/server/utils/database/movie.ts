import { prisma } from "../../db";
import type { Prisma } from "@prisma/client";
import { type TmdbResultWithImdbRating } from "../scrapeImdb/api_from_tmdb";
import { movieTitleToId } from "../../../utils/helpers";

const getMovieByTitleId = async (id: string) => {
  return await prisma.movie.findUnique({ where: { id: id } });
};

const getMovieByImdbId = async (id: string) => {
  return await prisma.movie.findUnique({ where: { imdb_id: id } });
};
const getMovieByTmdbId = async (id: number) => {
  return await prisma.movie.findUnique({ where: { tmdb_id: id } });
};
const getMoviesLimited = async (limit = 250) => {
  return await prisma.movie.findMany({
    take: limit > 250 ? 250 : limit,
    orderBy: {
      rating: "desc",
    },
  });
};

const addOrRemoveMovieFromFavorites = async ({
  movieId,
  userId,
  add,
}: {
  movieId: number;
  userId: string;
  add: boolean;
}) => {
  try {
    const user = add
      ? await prisma.user.update({
          where: { id: userId },
          data: {
            favorites: { connect: [{ tmdb_id: movieId }] },
          },
        })
      : await prisma.user.update({
          where: { id: userId },
          data: { favorites: { disconnect: [{ tmdb_id: movieId }] } },
        });
    return user;
  } catch (e) {
    return "error";
  }
};

const insertManyMovies = async (tmbdResult: TmdbResultWithImdbRating[]) => {
  type MovieDb = Prisma.MovieCreateInput;

  const mapToDb = (res: TmdbResultWithImdbRating): MovieDb => {
    return {
      backdrop_path: res.backdrop_path,
      poster_path: res.poster_path ?? "",
      og_title: res.original_title,
      overview: res.overview,
      rating: res.imdb_rating,
      release_date: new Date(res.release_date),
      tmdb_id: res.id,
      revenue: res.revenue,
      runtime: res.runtime,
      title: res.title,
      imdb_id: res.imdb_id,
      id: movieTitleToId(res.title),
    };
  };

  const toDbList = tmbdResult.map(mapToDb);

  const storedMovies = await prisma.movie.createMany({
    data: toDbList,
    skipDuplicates: true,
  });
  console.log(`saved ${storedMovies.count} movies to the db`);
};

const createMovie = async (movie: TmdbResultWithImdbRating) => {
  try {
    await insertManyMovies([movie]);
  } catch (e) {
    return "error";
  }
  return await getMovieByTmdbId(movie.id);
};

export {
  getMovieByTitleId,
  getMovieByImdbId,
  getMovieByTmdbId,
  getMoviesLimited,
  insertManyMovies,
  createMovie,
  addOrRemoveMovieFromFavorites,
};
