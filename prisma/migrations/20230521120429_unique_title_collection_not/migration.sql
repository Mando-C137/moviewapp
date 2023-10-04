/*
  Warnings:

  - A unique constraint covering the columns `[title,ownerId]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Collection_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Collection_title_ownerId_key" ON "Collection"("title", "ownerId");
