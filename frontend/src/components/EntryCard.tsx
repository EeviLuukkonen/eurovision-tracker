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

const getPodiumRowClass = (rank: number) => {
  if (rank > 3) return '';

  return `
    relative
    before:absolute before:left-0 before:top-0 before:h-full before:w-[3px]
    before:bg-podium-gold before:rounded-l
    bg-gradient-to-r from-primary/18 via-primary/8 to-transparent
  `;
};

export const RankingEntryRow = ({ entry, position }: RankingEntryRowProps) => {
  const index = position - 1;
  const podiumCSS = getPodiumRowClass(position);

  return (
    <li className={`grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.35fr)_4.5rem] items-center gap-3 border-x border-b border-white/20 bg-background px-3 py-1.5 first:rounded-t first:border-t last:rounded-b md:grid-cols-[2rem_minmax(0,1.05fr)_minmax(0,1.7fr)_4.5rem] ${podiumCSS}`}>
      <span className="text-xs font-bold text-muted-foreground text-center tabular-nums">
        {position}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <ReactCountryFlag
          countryCode={entry.country}
          svg
          style={{ width: '1.5rem', height: '1.1rem', objectFit: 'cover' }}
          className="rounded-sm shadow-sm shrink-0"
        />
        <span className="truncate text-sm">{getCountryName(entry.country)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">
          {entry.artist} - <i>{entry.song}</i>
        </p>
      </div>
      <div className="flex justify-center">
        <PointsBadge index={index} size="xs" />
      </div>
    </li>
  );
};

type OfficialResultRowProps = {
  result: OfficialResult;
};

export const OfficialResultRow = ({ result }: OfficialResultRowProps) => {
  const podiumCSS = getPodiumRowClass(result.rank);
    
  return (
    <li className={`grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.35fr)_4rem_4rem_4.5rem] items-center gap-3 border-x border-b border-white/20 bg-background px-3 py-2 first:rounded-t first:border-t last:rounded-b md:grid-cols-[2rem_minmax(0,1.05fr)_minmax(0,1.7fr)_4rem_4rem_4.5rem] ${podiumCSS}`}>
      <span className="text-xs font-bold text-muted-foreground text-center tabular-nums">
        {result.rank}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <ReactCountryFlag
          countryCode={result.entry.country}
          svg
          style={{ width: '1.5rem', height: '1.1rem', objectFit: 'cover' }}
          className="rounded-sm shadow-sm shrink-0"
        />
        <span className="truncate text-sm">{getCountryName(result.entry.country)}</span>
        {!result.finalist && (
          <span className="shrink-0 rounded border border-muted-foreground/40 px-1 text-[10px] font-bold leading-tight text-muted-foreground">
            NQ
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">
          {result.entry.artist} - <i>{result.entry.song}</i>
        </p>
      </div>
      <span className="text-[11px] text-center tabular-nums">{result.juryPoints ?? ''}</span>
      <span className="text-[11px] text-center tabular-nums">{result.televotePoints ?? ''}</span>
      <span className="text-sm font-semibold text-center tabular-nums">{result.totalPoints ?? ''}</span>
    </li>
  );
};