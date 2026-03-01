import { fetchEntriesByYear } from '@/api/entries';
import type { Entry } from '@/types/entry';
import { closestCenter, DndContext, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type SortableEntryItemProps = {
  entry: Entry;
};

const SortableEntryItem = ({ entry }: SortableEntryItemProps) => {
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
      className="p-4 border rounded mb-2 bg-background cursor-grab active:cursor-grabbing touch-none"
    >
      <h2 className="text-xl font-semibold">{entry.country}</h2>
      <p>
        {entry.artist} - {entry.song}
      </p>
    </div>
  );
};

const MyRankPage = () => {
  const { year } = useParams<{ year: string }>();
  const [rankedEntries, setRankedEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await fetchEntriesByYear(Number(year));
        setRankedEntries(data);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };
    
    if (year) {
      fetchEntries();
    }
  }, [year]);
  
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create Rank - Eurovision {year}</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={rankedEntries.map((entry) => entry.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {rankedEntries.map((entry) => (
              <SortableEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </main>
  );
};

export default MyRankPage;
