/*
  Warnings:

  - You are about to drop the `_CollectionToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CollectionToMovie" DROP CONSTRAINT "_CollectionToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionToMovie" DROP CONSTRAINT "_CollectionToMovie_B_fkey";

-- DropTable
DROP TABLE "_CollectionToMovie";

-- CreateTable
CREATE TABLE "CollectionMovie" (
    "collectionId" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "ImdbRating" (
    "imdbId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ImdbRating_pkey" PRIMARY KEY ("imdbId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CollectionMovie_collectionId_movieId_key" ON "CollectionMovie"("collectionId", "movieId");

-- AddForeignKey
ALTER TABLE "CollectionMovie" ADD CONSTRAINT "CollectionMovie_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionMovie" ADD CONSTRAINT "CollectionMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("tmdb_id") ON DELETE CASCADE ON UPDATE CASCADE;
