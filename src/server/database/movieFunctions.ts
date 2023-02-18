import { prisma } from "../db";

const getMovieById = async (id: string) => {
  return await prisma.movie.findFirst({ where: { id: id } });
};

const getMoviesLimited = async (limit = 250) => {
  return await prisma.movie.findMany({ take: limit > 250 ? 250 : limit });
};

export { getMovieById, getMoviesLimited };
