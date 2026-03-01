import { getCountryName } from "@/lib/countries";
import { getYoutubeThumbnailUrl } from "@/lib/youtube";
import type { Entry } from "@/types/entry";
import ReactCountryFlag from "react-country-flag";

type EntryCardProps = {
  entry: Entry;
  onOpenVideo: (videoUrl: string, title: string) => void;
  index: number;
};

export const EntryCard = ({ entry, onOpenVideo, index }: EntryCardProps) => {
  const thumbnailUrl = getYoutubeThumbnailUrl(entry.youtubeUrl);
  const videoTitle = `${entry.artist} - ${entry.song}`;

  return (
    <div className="flex items-center gap-6">
      <div>{index + 1}</div>
      <div className="flex-shrink-0 opacity-90">
        <ReactCountryFlag
          countryCode={entry.country}
          svg
          style={{ width: '4rem', height: '3rem' }}
          className="rounded shadow-sm"
        />
      </div>

      <div className="min-w-0">
        <h2 className="text-xl font-semibold">{getCountryName(entry.country)}</h2>
        <p>
          {entry.artist} - <i>{entry.song}</i>
        </p>
      </div>

      {thumbnailUrl && entry.youtubeUrl && (
        <button
          type="button"
          className="ml-auto"
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
            className="h-16 w-28 object-cover"
            loading="lazy"
          />
        </button>
      )}
    </div>
  );
};