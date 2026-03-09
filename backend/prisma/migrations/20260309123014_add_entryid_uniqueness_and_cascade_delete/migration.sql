/*
  Warnings:

  - A unique constraint covering the columns `[rankingId,entryId,position]` on the table `RankingEntry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RankingEntry" DROP CONSTRAINT "RankingEntry_rankingId_fkey";

-- DropIndex
DROP INDEX "RankingEntry_rankingId_position_key";

-- CreateIndex
CREATE UNIQUE INDEX "RankingEntry_rankingId_entryId_position_key" ON "RankingEntry"("rankingId", "entryId", "position");

-- AddForeignKey
ALTER TABLE "RankingEntry" ADD CONSTRAINT "RankingEntry_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "Ranking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
