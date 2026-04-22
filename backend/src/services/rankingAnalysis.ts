import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

  const prompt = `Compare user's Eurovision ${year} personal taste ranking with official results. 
    Rules: 
    - Use only provided rankings 
    - Use full country names and address user as 'you' if needed
    - Focus ONLY on biggest differences and clear patterns 
    - Be concise but slightly entertaining 
    - Output 2 short paragraphs (max 3 sentences each) 
    Include at least: 
      - Biggest positive and negative ranking gaps (with exact differences) 
      - Top-10 overlap (count + country names, if < 6) 
      - One clear preference pattern (style/taste) 
    - Avoid: 
      - Listing too many countries 
      - Repeating numbers unnecessarily 
      - Generic statements 
    Write like a sharp Eurovision analyst, not a report.

      ENTRIES:
      ${entriesText}

      USER RANKING (position: country):
      ${userRankingText}

      OFFICIAL RESULTS (rank. country | jury/televote/total | NQ if non-finalist):
      ${officialResultsText}`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 320,
    temperature: 0.4,
    system: "You are a sharp and concise Eurovision ranking analyst.",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    });

  return response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
};

