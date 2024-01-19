/*
  Warnings:

  - The primary key for the `ImdbRating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `imdbId` on the `ImdbRating` table. All the data in the column will be lost.
  - Added the required column `id` to the `ImdbRating` table without a default value. This is not possible if the table is not empty.
  - Made the column `imdb_id` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ImdbRating" DROP CONSTRAINT "ImdbRating_pkey",
DROP COLUMN "imdbId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ImdbRating_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Movie" ALTER COLUMN "imdb_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_imdb_id_fkey" FOREIGN KEY ("imdb_id") REFERENCES "ImdbRating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
