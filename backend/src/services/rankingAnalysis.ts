import OpenAI from "openai";

const client = new OpenAI();

type UserRankingEntry = {
  position: number;
  country: string;
  artist: string;
  song: string;
};

type OfficialResultEntry = {
  rank: number;
  country: string;
  artist: string;
  song: string;
  juryPoints: number | null;
  televotePoints: number | null;
  totalPoints: number;
  finalist: boolean;
};

export const generateRankingAnalysis = async (year: number, userRanking: UserRankingEntry[], officialResults: OfficialResultEntry[]) => {
  const entriesText = officialResults.map(r => `${r.country} - ${r.artist} "${r.song}"`).join(", ");
  const userRankingText = userRanking.map(e => `${e.country}(${e.position})`).join(", ");
  const officialResultsText = officialResults.map(r =>
    `${r.rank}. ${r.country} | ${r.juryPoints ?? 0}/${r.televotePoints ?? 0}/${r.totalPoints}${!r.finalist ? " NQ" : ""}`
  ).join("\n");

  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: `Task: Compare user's Eurovision ${year} ranking vs official results. 
      Rules: 
      - Use only earlier provided data. 
      - Use full country names. 
      - Report only the most significant findings. 
      - No intro or conclusion. 
      - Output exactly 5 sentences. 
      - Conversational and enthusiastic tone 
      1) Biggest mismatch up (country, user pos, official pos, diff) 
      2) Biggest mismatch down (country, user pos, official pos, diff) 
      3) Top-10 overlap (count/10 + which countries, max 6 names) 
      4) One clear taste pattern (1 sentence) 
      5) Jury vs televote alignment insight (1 sentence)

      ENTRIES:
      ${entriesText}

      USER RANKING (position: country):
      ${userRankingText}

      OFFICIAL RESULTS (rank. country | jury/televote/total | NQ if non-finalist):
      ${officialResultsText}`
    });

  return response.output_text;
};

const testUser: UserRankingEntry[] = [
  { position: 1,  country: "HR", artist: "Baby Lasagna",              song: "Rim Tim Tagi Dim" },
  { position: 2,  country: "FI", artist: "Windows95man",              song: "No Rules!" },
  { position: 3,  country: "IE", artist: "Bambie Thug",               song: "Doomsday Blue" },
  { position: 4,  country: "UA", artist: "alyona alyona & Jerry Heil", song: "Teresa & Maria" },
  { position: 5,  country: "EE", artist: "5miinust & Puuluup",        song: "(nendest) narkootikumidest ei tea me (küll) midagi" },
  { position: 6,  country: "NO", artist: "Gåte",                      song: "Ulveham" },
  { position: 7,  country: "IT", artist: "Angelina Mango",            song: "La noia" },
  { position: 8,  country: "RS", artist: "Teya Dora",                 song: "Ramonda" },
  { position: 9,  country: "LT", artist: "Silvester Belt",            song: "Luktelk" },
  { position: 10, country: "GE", artist: "Nutsa Buzaladze",           song: "Firefighter" },
  { position: 11, country: "SE", artist: "Marcus & Martinus",         song: "Unforgettable" },
  { position: 12, country: "CH", artist: "Nemo",                      song: "The Code" },
  { position: 13, country: "FR", artist: "Slimane",                   song: "Mon amour" },
  { position: 14, country: "AM", artist: "Ladaniva",                  song: "Jako" },
  { position: 15, country: "PT", artist: "Iolanda",                   song: "Grito" },
  { position: 16, country: "GR", artist: "Marina Satti",              song: "Zari" },
  { position: 17, country: "LU", artist: "Tali",                      song: "Fighter" },
  { position: 18, country: "IL", artist: "Eden Golan",                song: "Hurricane" },
  { position: 19, country: "ES", artist: "Nebulossa",                 song: "Zorra" },
  { position: 20, country: "LV", artist: "Dons",                      song: "Hollow" },
  { position: 21, country: "GB", artist: "Olly Alexander",            song: "Dizzy" },
  { position: 22, country: "DE", artist: "Isaak",                     song: "Always on the Run" },
  { position: 23, country: "AU", artist: "Electric Fields",           song: "One Milkali (One Blood)" },
  { position: 24, country: "SI", artist: "Raiven",                    song: "Veronika" },
  { position: 25, country: "CY", artist: "Silia Kapsis",              song: "Liar" },
];

const testOfficial: OfficialResultEntry[] = [
  { rank: 1,  country: "CH", artist: "Nemo",                       song: "The Code",                                                   juryPoints: 365, televotePoints: 226, totalPoints: 591, finalist: true },
  { rank: 2,  country: "HR", artist: "Baby Lasagna",               song: "Rim Tim Tagi Dim",                                           juryPoints: 84,  televotePoints: 463, totalPoints: 547, finalist: true },
  { rank: 3,  country: "UA", artist: "alyona alyona & Jerry Heil", song: "Teresa & Maria",                                             juryPoints: 139, televotePoints: 314, totalPoints: 453, finalist: true },
  { rank: 4,  country: "FR", artist: "Slimane",                    song: "Mon amour",                                                  juryPoints: 307, televotePoints: 138, totalPoints: 445, finalist: true },
  { rank: 5,  country: "IL", artist: "Eden Golan",                 song: "Hurricane",                                                  juryPoints: 52,  televotePoints: 323, totalPoints: 375, finalist: true },
  { rank: 6,  country: "IE", artist: "Bambie Thug",                song: "Doomsday Blue",                                              juryPoints: 101, televotePoints: 177, totalPoints: 278, finalist: true },
  { rank: 7,  country: "LT", artist: "Silvester Belt",             song: "Luktelk",                                                    juryPoints: 120, televotePoints: 120, totalPoints: 240, finalist: true },
  { rank: 8,  country: "LU", artist: "Tali",                       song: "Fighter",                                                    juryPoints: 138, televotePoints: 76,  totalPoints: 214, finalist: true },
  { rank: 9,  country: "IT", artist: "Angelina Mango",             song: "La noia",                                                    juryPoints: 77,  televotePoints: 129, totalPoints: 206, finalist: true },
  { rank: 10, country: "RS", artist: "Teya Dora",                  song: "Ramonda",                                                    juryPoints: 65,  televotePoints: 135, totalPoints: 200, finalist: true },
  { rank: 11, country: "FI", artist: "Windows95man",               song: "No Rules!",                                                  juryPoints: 38,  televotePoints: 150, totalPoints: 188, finalist: true },
  { rank: 12, country: "SE", artist: "Marcus & Martinus",          song: "Unforgettable",                                              juryPoints: 82,  televotePoints: 92,  totalPoints: 174, finalist: true },
  { rank: 13, country: "GR", artist: "Marina Satti",               song: "Zari",                                                       juryPoints: 44,  televotePoints: 82,  totalPoints: 126, finalist: true },
  { rank: 14, country: "AM", artist: "Ladaniva",                   song: "Jako",                                                       juryPoints: 62,  televotePoints: 53,  totalPoints: 115, finalist: true },
  { rank: 15, country: "NO", artist: "Gåte",                       song: "Ulveham",                                                    juryPoints: 72,  televotePoints: 37,  totalPoints: 109, finalist: true },
  { rank: 16, country: "EE", artist: "5miinust & Puuluup",         song: "(nendest) narkootikumidest ei tea me (küll) midagi",          juryPoints: 19,  televotePoints: 84,  totalPoints: 103, finalist: true },
  { rank: 17, country: "PT", artist: "Iolanda",                    song: "Grito",                                                      juryPoints: 57,  televotePoints: 41,  totalPoints: 98,  finalist: true },
  { rank: 18, country: "GB", artist: "Olly Alexander",             song: "Dizzy",                                                      juryPoints: 27,  televotePoints: 19,  totalPoints: 46,  finalist: true },
  { rank: 19, country: "LV", artist: "Dons",                       song: "Hollow",                                                     juryPoints: 30,  televotePoints: 34,  totalPoints: 64,  finalist: true },
  { rank: 20, country: "GE", artist: "Nutsa Buzaladze",            song: "Firefighter",                                                juryPoints: 31,  televotePoints: 31,  totalPoints: 62,  finalist: true },
  { rank: 21, country: "ES", artist: "Nebulossa",                  song: "Zorra",                                                      juryPoints: 18,  televotePoints: 36,  totalPoints: 54,  finalist: true },
  { rank: 22, country: "DE", artist: "Isaak",                      song: "Always on the Run",                                          juryPoints: 6,   televotePoints: 5,   totalPoints: 11,  finalist: true },
  { rank: 23, country: "AU", artist: "Electric Fields",            song: "One Milkali (One Blood)",                                    juryPoints: null, televotePoints: null, totalPoints: 0,  finalist: false },
  { rank: 24, country: "SI", artist: "Raiven",                     song: "Veronika",                                                   juryPoints: null, televotePoints: null, totalPoints: 0,  finalist: false },
  { rank: 25, country: "CY", artist: "Silia Kapsis",               song: "Liar",                                                       juryPoints: null, televotePoints: null, totalPoints: 0,  finalist: false },
];

(async () => {
  const result = await generateRankingAnalysis(2024, testUser, testOfficial);
  console.log(result);
})();