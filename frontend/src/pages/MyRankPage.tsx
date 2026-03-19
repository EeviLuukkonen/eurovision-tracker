import { fetchEntriesByYear } from '@/api/entries';
import { getRankingByYear, saveRankingByYear } from '@/api/rankings';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Entry } from '@/types/entry';
import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntryCard } from '../components/EntryCard';
import { mapEntriesByRankingOrder, mapEntriesToRankingFormat } from '@/lib/rankingHelper';

type SortableEntryItemProps = {
  entry: Entry;
  onOpenVideo: (videoUrl: string, title: string) => void;
  index: number;
};

const SortableEntryItem = ({ entry, onOpenVideo, index }: SortableEntryItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="px-4 py-1.5 border rounded mb-1 bg-background cursor-grab active:cursor-grabbing touch-none"
    >
      <EntryCard entry={entry} onOpenVideo={onOpenVideo} index={index} />
    </div>
  );
};

const MyRankPage = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading } = useAuth();
  const [rankedEntries, setRankedEntries] = useState<Entry[]>([]);
  const [savedEntries, setSavedEntries] = useState<Entry[]>([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!year || isAuthLoading) {
      return;
    }

    const parsedYear = Number(year);

    const fetchEntries = async () => {
      try {
        const data = await fetchEntriesByYear(parsedYear);

        if (!isAuthenticated) {
          setRankedEntries(data);
          setSavedEntries(data);
          return;
        }

        const ranking = await getRankingByYear(parsedYear);
        const initialEntries = mapEntriesByRankingOrder(data, ranking.entries);
        setRankedEntries(initialEntries);
        setSavedEntries(initialEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, [year, isAuthenticated, isAuthLoading]);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setRankedEntries((currentEntries) => {
      const oldIndex = currentEntries.findIndex((entry) => entry.id === active.id);
      const newIndex = currentEntries.findIndex((entry) => entry.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        return currentEntries;
      }

      return arrayMove(currentEntries, oldIndex, newIndex);
    });
  };

  const handleOpenVideo = (videoUrl: string, title: string) => {
    setActiveVideoUrl(videoUrl);
    setActiveVideoTitle(title);
  };

  const handleCloseVideo = () => {
    setActiveVideoUrl(null);
    setActiveVideoTitle('');
  };

  const handleResetRankingChanges = () => {
    setRankedEntries([...savedEntries]);
  };

  const handleSaveRanking = async () => {
    setIsSaving(true);
    const entriesToSave = mapEntriesToRankingFormat(rankedEntries);

    try {
      await saveRankingByYear(Number(year), entriesToSave);
      setSavedEntries([...rankedEntries]);
      navigate(`/year/${year}/my-rank/view`);
    } catch (error) {
      console.error('Error saving ranking:', error);
      alert('Failed to save ranking. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Ranking - Eurovision {year}</h1>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rankedEntries.map((entry) => entry.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {rankedEntries.map((entry, index) => (
              <SortableEntryItem
                key={entry.id}
                entry={entry}
                onOpenVideo={handleOpenVideo}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog
        open={Boolean(activeVideoUrl)}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseVideo();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl border-white/20 bg-background p-5 sm:max-w-4xl"
        >
          <DialogHeader className="mb-3 flex-row items-center justify-between gap-2 space-y-0">
            <DialogTitle>{activeVideoTitle}</DialogTitle>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-white/20 hover:bg-white/10"
              >
                Close
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="aspect-video w-full overflow-hidden rounded border border-white/20 bg-black">
            {activeVideoUrl && (
              <iframe
                src={activeVideoUrl}
                title={activeVideoTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-0 right-0 border-t border-white/10 bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-end gap-3">
        {!isAuthenticated && (
          <span className="text-sm text-muted-foreground mr-4">
            Log in to save your ranking!
          </span>
        )}
        <Button
          type="button"
          onClick={handleResetRankingChanges}
          disabled={isSaving}
          variant="outline"
          size="sm"
          className="border-white/20 hover:bg-white/10"
        >
          Reset All
        </Button>
        <Button
          type="button"
          onClick={handleSaveRanking}
          disabled={isSaving || !isAuthenticated}
          size="sm"
        >
          Save & View
        </Button>
      </div>
    </main>
  );
};

export default MyRankPage;
