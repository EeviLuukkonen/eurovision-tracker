export const PointsBadge = ({ index, size = "md" }: { index: number; size?: "xs" | "sm" | "md" }) => {
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
  const sizeClasses = size === "xs" ? "size-6 text-[10px]" : size === "sm" ? "size-7 text-xs" : "size-9 text-base";
  const spacerClasses = size === "xs" ? "size-6" : size === "sm" ? "size-7" : "size-9";

  if (!points) {
    return <div className={spacerClasses} aria-hidden="true" />;
  }

  return (
    <div
      className={`flex ${sizeClasses} items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 font-extrabold tabular-nums`}
      aria-label={`${points} points`}
    >
      {points}
    </div>
  );
};