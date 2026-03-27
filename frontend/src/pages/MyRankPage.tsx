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
import { mapEntriesByRankingOrder, mapEntriesToRankingFormat, saveDraftToLocalStorage, clearDraftFromLocalStorage, loadDraftFromLocalStorage } from '@/lib/rankingHelper';

type SortableEntryItemProps = {
  entry: Entry;
  onOpenVideo: (videoUrl: string, title: string) => void;
  index: number;
  isRanked: boolean;
};

type StartRankingDropZoneProps = {
  enabled: boolean;
};

const StartRankingDropZone = ({ enabled }: StartRankingDropZoneProps) => {
  if (!enabled) {
    return null;
  }

  return (
    <div className="mb-2 flex flex-col items-center justify-center gap-1 rounded border border-dashed border-white/40 bg-white/5 px-4 py-4 text-muted-foreground transition-colors">
      <span className="text-sm">Drag and drop an entry here to start your ranking</span>
      <span className="text-lg leading-none">↓</span>
    </div>
  );
};

const SortableEntryItem = ({ entry, onOpenVideo, index, isRanked }: SortableEntryItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : isRanked ? 1 : 0.85,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-1.5 border rounded mb-1 cursor-grab active:cursor-grabbing touch-none transition-colors ${
        isRanked
          ? 'bg-background border-white/20'
          : 'bg-background/90 border-white/10'
      }`}
    >
      <EntryCard entry={entry} onOpenVideo={onOpenVideo} index={index} isRanked={isRanked} />
    </div>
  );
};

const MyRankPage = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAuthLoading, user } = useAuth();
  
  const [orderedEntries, setOrderedEntries] = useState<Entry[]>([]);
  const [orderedCount, setOrderedCount] = useState(0);

  const [savedState, setSavedState] = useState<{ entries: Entry[]; count: number }>({ entries: [], count: 0 });
  
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

        const guestDraft = loadDraftFromLocalStorage(parsedYear, null);
        const userDraft = loadDraftFromLocalStorage(parsedYear, user?.id ?? null);

        // guest user
        if (!isAuthenticated) {
          console.log('guest user, loading guest draft if exists');
          const { entriesInOrder, rankedCount } = mapEntriesByRankingOrder(data, guestDraft ?? []);
          setOrderedEntries(entriesInOrder);
          setOrderedCount(rankedCount);
          setSavedState({ entries: data, count: 0 });
          return;
        }

        const ranking = await getRankingByYear(parsedYear);
        const hasDbRanking = ranking.entries.length > 0;

        // logged in user with saved ranking
        if (hasDbRanking) {
          const { entriesInOrder, rankedCount } = mapEntriesByRankingOrder(data, ranking.entries);

          if (userDraft) {
            const { entriesInOrder: draftEntries, rankedCount: draftCount } = mapEntriesByRankingOrder(data, userDraft);
            setOrderedEntries(draftEntries);
            setOrderedCount(draftCount);
            setSavedState({ entries: entriesInOrder, count: rankedCount });
          } else {
            setOrderedEntries(entriesInOrder);
            setOrderedCount(rankedCount);
            setSavedState({ entries: entriesInOrder, count: rankedCount });
          }

          clearDraftFromLocalStorage(parsedYear, null);
          return;
        }

        // logged in user without saved ranking
        const draftToUse = guestDraft ?? userDraft;
        if (draftToUse) {
          console.log('logged in user without saved ranking but with draft, loading draft');
          const { entriesInOrder: initialEntries, rankedCount } = mapEntriesByRankingOrder(data, draftToUse);
          setOrderedEntries(initialEntries);
          setOrderedCount(rankedCount);
          setSavedState({ entries: data, count: 0 });

          if (guestDraft && user?.id) {
            saveDraftToLocalStorage(parsedYear, initialEntries, rankedCount, user.id);
            clearDraftFromLocalStorage(parsedYear, null);
          }

          return;
        }

        // logged in user without saved ranking or drafts
        console.log('logged in user without saved ranking or drafts, loading entries without order');
        setOrderedEntries(data);
        setOrderedCount(0);
        setSavedState({ entries: data, count: 0 });

      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    void fetchEntries();
  }, [year, isAuthenticated, isAuthLoading]);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    if (active.id === over.id && !(orderedCount === 0 && active.id === over.id)) {
      return;
    }

    setOrderedEntries((currentEntries) => {
      const oldIndex = currentEntries.findIndex((entry) => entry.id === active.id);
      const newIndex = currentEntries.findIndex((entry) => entry.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return currentEntries;

      const wasRanked = oldIndex < orderedCount;
      const droppedBelowBoundary = newIndex > orderedCount;
      const droppedAtBoundary = newIndex === orderedCount;

      if (droppedBelowBoundary) return currentEntries;
      if (wasRanked && droppedAtBoundary) return currentEntries;

      const nextEntries = arrayMove(currentEntries, oldIndex, newIndex);
      const nextCount = !wasRanked ? orderedCount + 1 : orderedCount;

      setOrderedCount(nextCount);
      saveDraftToLocalStorage(Number(year), nextEntries, nextCount, user?.id ?? null);

      return nextEntries;
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
    setOrderedEntries([...savedState.entries]);
    setOrderedCount(savedState.count);
    clearDraftFromLocalStorage(Number(year), user?.id ?? null);
  };

  const handleSaveRanking = async () => {
    setIsSaving(true);
    const entriesToSave = mapEntriesToRankingFormat(orderedEntries, orderedCount);

    try {
      await saveRankingByYear(Number(year), entriesToSave);
      clearDraftFromLocalStorage(Number(year), user?.id ?? null);
      setSavedState({ entries: [...orderedEntries], count: orderedCount });
      void navigate(`/year/${year}/my-rank/view`);
    } catch (error) {
      console.error('Error saving ranking:', error);
      alert('Failed to save ranking. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Eurovision {year}</p>
        <h1 className="text-2xl font-semibold">Create Ranking</h1>
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedEntries.map((entry) => entry.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            <StartRankingDropZone enabled={orderedCount === 0} />
            {orderedEntries.map((entry, index) => (
              <SortableEntryItem
                key={entry.id}
                entry={entry}
                onOpenVideo={handleOpenVideo}
                index={index}
                isRanked={index < orderedCount}
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
          Reset Changes
        </Button>
        <Button
          type="button"
          onClick={() => void handleSaveRanking()}
          disabled={isSaving || !isAuthenticated || orderedCount === 0}
          size="sm"
        >
          Save & View
        </Button>
      </div>
    </main>
  );
};

export default MyRankPage;
