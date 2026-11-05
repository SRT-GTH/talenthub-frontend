import { classNames } from '../../utils/classNames.js';

/*
 * SkeletonBlock — a loading placeholder (Figma "skeleton" fills in the recruiter dashboard frames, e.g. 10050:61097: #ecefe9-to-#f4f6f1 rounded blocks).
 * Pure presentation: aria-hidden, a slow pulse that stops under prefers-reduced-motion. Size and radius come from `className` (e.g. "h-[40px] w-full rounded-[12px]").
 */
const SkeletonBlock = ({ className, style }) => (
  <div
    aria-hidden="true"
    style={style}
    className={classNames(
      'animate-pulse bg-[linear-gradient(90deg,#ecefe9,#f4f6f1,#ecefe9)] motion-reduce:animate-none',
      className
    )}
  />
);

export default SkeletonBlock;
