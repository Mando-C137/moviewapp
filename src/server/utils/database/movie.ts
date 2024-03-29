import { prisma } from "../../db";
import { type TmdbResultWithImdbRating } from "../scrapeImdb/api_from_tmdb";
import { movieTitleToId } from "../../../utils/helpers";
import type { TmdbResult } from "../tmdb_api";
import { getMoviesIsUsersFavourite } from "./user";

const getMovieByTitleId = async (id: string) => {
  return await prisma.movie.findUnique({
    where: { id: id },
    include: { imdb: true },
  });
};

const getMovieByImdbId = async (id: string) => {
  return await prisma.movie.findUnique({
    where: { imdb_id: id },
    include: { imdb: true },
  });
};
const getMovieByTmdbId = async (id: number) => {
  return await prisma.movie.findUnique({
    where: { tmdb_id: id },
    include: { imdb: true },
  });
};
const getTopRatedMovies = async (limit = 250) => {
  return await prisma.movie.findMany({
    take: limit > 250 ? 250 : limit,
    orderBy: {
      imdb: { rating: "desc" },
    },
    include: { imdb: true },
  });
};

const addOrRemoveMovieFromFavorites = async ({
  tmdbId,
  userId,
  add,
}: {
  tmdbId: number;
  userId: string;
  add: boolean;
}) => {
  try {
    add
      ? await prisma.user.update({
          where: { id: userId },
          data: {
            favorites: { connect: [{ tmdb_id: tmdbId }] },
          },
        })
      : await prisma.user.update({
          where: { id: userId },
          data: { favorites: { disconnect: [{ tmdb_id: tmdbId }] } },
        });
    return await getMoviesIsUsersFavourite({ tmdb_id: tmdbId, userId });
  } catch (e) {
    return "error";
  }
};

const insertManyMovies = async (tmbdResult: TmdbResultWithImdbRating[]) => {
  const mapToDb = (res: TmdbResultWithImdbRating) => {
    return {
      backdrop_path: res.backdrop_path,
      poster_path: res.poster_path ?? "",
      original_title: res.original_title,
      overview: res.overview,
      release_date: new Date(res.release_date),
      tmdb_id: res.id,
      revenue: res.revenue,
      runtime: res.runtime,
      title: res.title,
      id: movieTitleToId(res.title, new Date(res.release_date).getFullYear()),
      imdb_id: res.imdb_id,
    };
  };

  const toDbList = tmbdResult.map(mapToDb);

  try {
    const storedMovies = await prisma.$transaction(
      toDbList.map((entity) =>
        prisma.movie.upsert({
          where: { id: entity.id },
          create: entity,
          update: entity,
          include: { imdb: true },
        }),
      ),
    );
    console.log(`saved ${storedMovies.length} movies to the db`);
    return storedMovies;
  } catch (e) {
    console.error("error when saving movies to the db");
    console.error(e);
    return "error";
  }
};

const createMovie = async (movie: TmdbResultWithImdbRating) => {
  try {
    await insertManyMovies([movie]);
  } catch (e) {
    return "error";
  }
  return await getMovieByTmdbId(movie.id);
};
export const filterMoviesWithUnknownImdbId = async (movies: TmdbResult[]) => {
  const moviesWhoExist = (
    await prisma.imdbRating.findMany({
      where: { id: { in: movies.map((movie) => movie.imdb_id) } },
    })
  ).map((movie) => movie.id);

  return movies.filter((movie) => moviesWhoExist.includes(movie.imdb_id));
};

export {
  getMovieByTitleId,
  getMovieByImdbId,
  getMovieByTmdbId,
  getTopRatedMovies,
  insertManyMovies,
  createMovie,
  addOrRemoveMovieFromFavorites,
};
