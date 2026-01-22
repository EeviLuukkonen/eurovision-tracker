import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { PrismaPg } from '@prisma/adapter-pg';

console.log(process.env.DATABASE_URL);

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const startYear = 2015;
  const endYear = 2025;

  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y.toString());
  };

  const baseDir = path.join(__dirname, "../../", "data");

  await prisma.entry.deleteMany();

  for (const year of years) {
    const contestantsDir = path.join(baseDir, year, "contestants");
    const contestantFolders = fs.readdirSync(contestantsDir);

    for (const folderName of contestantFolders) {
      const contestantPath = path.join(contestantsDir, folderName, "contestant.json");
      if (!fs.existsSync(contestantPath)) continue;

      const data = JSON.parse(fs.readFileSync(contestantPath, "utf-8"));

      await prisma.entry.create({
        data: {
          year: Number(year),
          country: data.country,
          artist: data.artist,
          song: data.song,
          youtubeUrl: data.videoUrls[0] ?? null,
        },
      });

      console.log(`Inserted entry: ${data.country} (${year})`);
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
