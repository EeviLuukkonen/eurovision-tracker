export const PointsBadge = ({ index }: { index: number }) => {
  const indexToPoints: Record<number, string> = {
    0: '12',
    1: '10',
    2: '8',
    3: '7',
    4: '6',
    5: '5',
    6: '4',
    7: '3',
    8: '2',
    9: '1',
  };

  const points = indexToPoints[index];

  if (!points) {
    return <div className="size-9" aria-hidden="true" />;
  }

  return (
    <div
      className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 text-base font-extrabold tabular-nums"
      aria-label={`${points} points`}
    >
      {points}
    </div>
  );
};