import { prisma } from "../../db";

export const getAllReviewers = async () => {
  return await prisma.user.findMany();
};

export const userExists = async (id: string) => {
  return (await prisma.user.count({ where: { id } })) > 0;
};

export const getUserById = async (id: string) => {
  return await prisma.user.findFirst({
    where: { id },
  });
};

export const getUsersFavourites = async ({ id }: { id: string }) => {
  const favourites = await prisma.user.findFirst({
    where: { id },
    select: { favorites: { select: { tmdb_id: true } } },
  });

  return favourites?.favorites.map((obj) => obj.tmdb_id) ?? null;
};

export const getUserByName = async (name: string) => {
  return await prisma.user.findFirst({
    where: { name },
  });
};

export const getMoviesIsUsersFavourite = async ({
  tmdb_id,
  userId,
}: {
  tmdb_id: number;
  userId: string;
}) => {
  const movieIsInFavouriteList = await prisma.user.findFirst({
    where: { id: userId, favorites: { some: { tmdb_id } } },
  });

  return movieIsInFavouriteList !== null;
};

export const findAllUsers = async () => {
  return await prisma.user.findMany();
};

// TODO maybe own file for collections
export const createCollectionForUser = async ({
  title,
  userId,
  movieIds,
  description,
}: {
  title: string;
  userId: string;
  movieIds: number[];
  description: string;
}) => {
  const createdCollection = await prisma.collection.create({
    data: {
      title,
      ownerId: userId,
      description,
    },
  });

  const updatedCollection = prisma.collection.update({
    where: {
      id: createdCollection.id,
    },
    data: {
      movies: {
        create: movieIds.map((movieId, i) => ({ movieId, rank: i + 1 })),
      },
    },
  });

  return updatedCollection;
};

export const getCollectionById = async (id: string) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        owner: true,
        movies: { include: { movie: true }, orderBy: { rank: "asc" } },
      },
    });
    return collection === null ? ("error" as const) : collection;
  } catch (e) {
    return "error" as const;
  }
};

const setCollectionMovies = async ({
  id,
  movieIds,
}: {
  id: string;
  movieIds: number[];
}) => {
  try {
    await prisma.collectionMovie.deleteMany({
      where: { collectionId: id },
    });

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        movies: {
          create: movieIds.map((movieId, i) => ({
            movieId: movieId,
            rank: i + 1,
          })),
        },
      },
    });
    return collection;
  } catch (e) {
    return "error";
  }
};

export const editCollection = async (
  collectionId: string,
  {
    title,
    movieIds,
    description,
  }: {
    title: string;
    movieIds: number[];
    description: string;
  }
) => {
  const createdCollection = await prisma.collection.update({
    where: { id: collectionId },
    data: {
      title,
      description,
    },
  });
  return await setCollectionMovies({ id: createdCollection.id, movieIds });
};

export const deleteCollection = async (collectionId: string) => {
  const createdCollection = await prisma.collection.delete({
    where: { id: collectionId },
  });
  return createdCollection;
};
