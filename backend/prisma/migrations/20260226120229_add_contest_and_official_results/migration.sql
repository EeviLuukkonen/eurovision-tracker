-- CreateTable
CREATE TABLE "Contest" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "arena" TEXT NOT NULL,
    "slogan" TEXT NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contest_year_key" ON "Contest"("year");

-- CreateIndex
CREATE INDEX "Contest_year_idx" ON "Contest"("year");
