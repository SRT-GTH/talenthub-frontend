import Skeleton from './Skeleton.jsx';

/*
 * SkeletonBarRows — loading rows of the "Career interests" card (Figma 8488:239…: label block 150x12 r6 + bar block r4 whose width
 * shrinks 300 → 124 of a 462px row, row gap 10 (rows at 63px pitch)).
 * Props: rows (default 9, as drawn), className. Widths are percentages of the row so it is fluid.
 */

const SkeletonBarRows = ({ rows = 9, className }) => (
  <div className={className} role="status" aria-live="polite">
    <span className="sr-only">Loading</span>
    <div className="flex flex-col gap-[10px]" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-[12px] py-[5px]">
          <Skeleton width={150} height={12} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <Skeleton
              height={14}
              radius={4}
              width={`${Math.max(20, Math.round(100 - i * (60 / Math.max(rows - 1, 1))))}%`}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonBarRows;
