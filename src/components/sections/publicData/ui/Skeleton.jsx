import { classNames } from '../../../../utils/classNames.js';

/*
 * Skeleton — the loading placeholder block of the Theme 8 loading frames (8.2.1b overview 8488:8, 8.3.1b region 8494:8,
 * 8.5.1d outcomes 8496:294): flat #f2f2ee rectangles; KPI tile 140x36 / 220x12 / 180x12 radius 6, bar rows radius 4, map regions #f2f2ee.
 * Props
 *   width / height   number | string   px number or any CSS length; omit width for a full-width block
 *   radius           number            px, default 6 (bars use 4)
 *   className
 * a11y: purely decorative (aria-hidden). Wrap the loading area in a container with aria-busy / role="status" and a
 * visually-hidden "Loading" label so assistive tech hears it once.
 * Motion: ⚠️ ASSUMPTION the frames are static; a soft pulse is added only under prefers-reduced-motion: no-preference.
 */

const Skeleton = ({ width, height = 12, radius = 6, className }) => (
  <span
    aria-hidden="true"
    className={classNames('block max-w-full bg-[#f2f2ee] motion-safe:animate-pulse', className)}
    style={{
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      borderRadius: `${radius}px`,
    }}
  />
);

export default Skeleton;
