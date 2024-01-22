import { prisma } from "../../db";
import { type TmdbResultWithImdbRating } from "../scrapeImdb/api_from_tmdb";
import { movieTitleToId } from "../../../utils/helpers";

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
const getMoviesLimited = async (limit = 250) => {
  return await prisma.movie.findMany({
    take: limit > 250 ? 250 : limit,
    orderBy: {
      imdb: { rating: "desc" },
    },
    include: { imdb: true },
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
        })
      )
    );
    console.log(`saved ${storedMovies.length} movies to the db`);
  } catch (e) {
    console.error("error when saving movies to the db");
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

export {
  getMovieByTitleId,
  getMovieByImdbId,
  getMovieByTmdbId,
  getMoviesLimited,
  insertManyMovies,
  createMovie,
  addOrRemoveMovieFromFavorites,
};
