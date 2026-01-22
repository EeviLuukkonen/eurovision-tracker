/*
  Warnings:

  - A unique constraint covering the columns `[year,country]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Entry_year_country_key" ON "Entry"("year", "country");
