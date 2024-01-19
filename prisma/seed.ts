import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import * as fs from "fs/promises";
import path from "path";
import * as readLine from "readline/promises";
import axios from "axios";
import { z } from "zod";
import { movieTitleToId } from "../src/utils/helpers";

type ImdbRatingType = Prisma.ImdbRatingCreateInput & { id: string };

const prisma = new PrismaClient();
async function main() {
  const createdImdbRatings = await insertImdbtoImdb();
  await createMoviesFromImdbIds(createdImdbRatings);
}

const insertImdbtoImdb = async (): Promise<ImdbRatingType[]> => {
  const relevantEntries: ImdbRatingType[] = [];
  const file = await fs.open(path.join("prisma", "data.tsv"));
  const rl = readLine.createInterface({
    input: file.createReadStream(),
    crlfDelay: Infinity,
  });

  let isFirstLine = true;
  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }
    const [imdbId, rating, numVotes] = line.split("\t");
    if (!!imdbId && !!rating && !!numVotes) {
      const entrie: ImdbRatingType = {
        id: imdbId,
        rating: Number(rating),
      };
      if (Number(numVotes) > 5000) {
        relevantEntries.push(entrie);
      }
    }
  }
  const users = await prisma.imdbRating.createMany({
    data: relevantEntries,
    skipDuplicates: true,
  });
  console.log(`found ${relevantEntries.length} lines`);
  console.log(`added ${users.count} entries into imdbRating`);
  return relevantEntries;
};

// TODO from tmdb_api
const createMoviesFromImdbIds = async (
  createdImdbRatings: ImdbRatingType[]
) => {
  const fetchPromises = createdImdbRatings.map((col) =>
    fetchMovieByImdbId(col.id)
  );

  const results = (await Promise.all(fetchPromises))
    .filter(
      (result): result is Exclude<typeof result, "error"> =>
        result !== "error" && !!result.movie_results[0]
    )
    .map((result): (typeof result)["movie_results"][0] => {
      if (!result.movie_results[0]) {
        throw new Error("I cannnot be thrown");
      }
      return result.movie_results[0];
    })
    .map((result) => fetchMovieByTmdbId(result.id));

  const fetchByTMDBPromises = (await Promise.all(results))
    .filter((val): val is Exclude<typeof val, "error"> => val !== "error")
    .map((result) => ({
      ...result,
      tmdb_id: result.id,
      id: movieTitleToId(
        result.title,
        new Date(result.release_date).getFullYear()
      ),
      release_date: new Date(result.release_date),
    }));

  const movies = await prisma.movie.createMany({ data: fetchByTMDBPromises });
  console.log(movies.count);
};

// TODO from tmdb_api
type ImdbResult = {
  movie_results: {
    id: number;
    title: string;
  }[];
};
// TODO from tmdb_api
const fetchMovieByImdbId = async (id: string) => {
  try {
    const response = await axios.get<ImdbResult>(
      `${process.env.TMDB_BASE_URL!}/find/${id}?api_key=${process.env
        .TMDB_CLIENT_ID!}&language=en-US&external_source=imdb_id`
    );
    return response.data;
  } catch (e) {
    return "error";
  }
};

const movieSchema = z.object({
  backdrop_path: z.string(),
  id: z.number(),
  imdb_id: z.string(),
  original_title: z.string(),
  overview: z.string(),
  release_date: z.string(),
  revenue: z.number(),
  runtime: z.number(),
  title: z.string(),
  poster_path: z.string(),
});
const fetchMovieByTmdbId = async (idParam: number) => {
  try {
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL!}/movie/${idParam}?api_key=${process.env
        .TMDB_CLIENT_ID!}&language=en-US`
    );

    const parsedMovie = movieSchema.parse(response.data);

    return {
      ...parsedMovie,
      revenue: Number((parsedMovie.revenue / 1_000_000).toFixed(2)),
    };
  } catch (e) {
    //console.log(`error when fetching by tmdbId ${idParam}`);
    return "error" as const;
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
