import { getCountryName } from "@/lib/countries";
import { getYoutubeThumbnailUrl } from "@/lib/youtube";
import type { Entry } from "@/types/entry";
import type { OfficialResult } from "@/types/officialResult";
import ReactCountryFlag from "react-country-flag";
import { PointsBadge } from "./PointsBadge";

type EntryCardProps = {
  entry: Entry;
  onOpenVideo: (videoUrl: string, title: string) => void;
  index: number;
  isRanked: boolean;
};

export const EntryCard = ({ entry, onOpenVideo, index, isRanked }: EntryCardProps) => {
  const thumbnailUrl = getYoutubeThumbnailUrl(entry.youtubeUrl);
  const videoTitle = `${entry.artist} - ${entry.song}`;

  return (
    <div className="flex w-full items-center gap-6">
      <div className="w-8 text-center font-extrabold">{isRanked ? index + 1 : '—'}</div>
      <div className="shrink-0 opacity-90">
        <ReactCountryFlag
          countryCode={entry.country}
          svg
          style={{ width: '4rem', height: '3rem' }}
          className="rounded shadow-sm"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-semibold">{getCountryName(entry.country)}</h2>
        <p>
          {entry.artist} - <i>{entry.song}</i>
        </p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-12">
        {isRanked ? (
          <PointsBadge index={index} />
        ) : (
          <div className="size-9" aria-hidden="true" />
        )}

        {thumbnailUrl && entry.youtubeUrl && (
          <button
            type="button"
            className="h-16 w-28 relative group overflow-hidden rounded"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onOpenVideo(entry.youtubeUrl as string, videoTitle);
            }}
            aria-label={`Play ${videoTitle}`}
          >
            <img
              src={thumbnailUrl}
              alt={`Thumbnail for ${videoTitle}`}
              className="h-full w-full object-cover scale-112"
              loading="lazy"
            />

            <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white shadow">
                ▶
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

type RankingEntryRowProps = {
  entry: Entry;
  position: number;
};

export const RankingEntryRow = ({ entry, position }: RankingEntryRowProps) => {
  const index = position - 1;

  return (
    <li className="flex items-center gap-3 border-x border-b border-white/20 bg-background pl-3 pr-4 py-2 first:rounded-t first:border-t last:rounded-b">
      <span className="w-5 text-xs font-bold text-muted-foreground text-right tabular-nums shrink-0">
        {position}
      </span>
      <ReactCountryFlag
        countryCode={entry.country}
        svg
        style={{ width: '1.5rem', height: '1.1rem', objectFit: 'cover' }}
        className="rounded-sm shadow-sm shrink-0"
      />
      <span className="text-sm font-medium truncate flex-1">{getCountryName(entry.country)}</span>
      <PointsBadge index={index} size="sm" />
    </li>
  );
};

type OfficialResultRowProps = {
  result: OfficialResult;
};

export const OfficialResultRow = ({ result }: OfficialResultRowProps) => {
  return (
    <li className="flex items-center gap-3 border-x border-b border-white/20 bg-background pl-3 pr-4 py-2 first:rounded-t first:border-t last:rounded-b">
      <span className="w-5 text-xs font-bold text-muted-foreground text-right tabular-nums shrink-0">
        {result.rank}
      </span>
      <ReactCountryFlag
        countryCode={result.entry.country}
        svg
        style={{ width: '1.5rem', height: '1.1rem', objectFit: 'cover' }}
        className="rounded-sm shadow-sm shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {result.entry.artist} - <i>{result.entry.song}</i>
        </p>
        <p className="text-xs text-muted-foreground truncate">{getCountryName(result.entry.country)}</p>
      </div>
      <div className="shrink-0 text-right tabular-nums leading-tight">
        <p className="text-[11px] text-muted-foreground">J {result.juryPoints ?? 0}</p>
        <p className="text-[11px] text-muted-foreground">T {result.televotePoints ?? 0}</p>
        <p className="text-sm font-semibold">{result.totalPoints}</p>
      </div>
    </li>
  );
};