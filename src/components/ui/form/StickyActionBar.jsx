import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';

const log = debug('StickyActionBar');

/*
 * StickyActionBar — keeps a form's primary action reachable on phones.
 *
 * Below `md` it pins to the bottom of the nearest scroll container with a
 * blurred white background, hairline top border and safe-area padding, and
 * bleeds into the page gutter (`bleed`, default 24px = Tailwind px-6) so the
 * bar spans the full screen width.
 *
 * From `md` up it is `display: contents`, so the wrapped children lay out
 * exactly as if the bar were not there (desktop output unchanged).
 *
 * Must sit as a direct child of a flex-column form / page container (the
 * onboarding pattern); negative side margins widen it into the page gutter.
 */
/*
 * `surfaceWhenStuck`: the white surface (background, hairline, blur) only shows while the bar is actually pinned to the bottom,
 * i.e. while the content after it is below the fold. When the whole form fits on screen the button sits on the page as drawn,
 * without a white band around it. Off by default so existing forms keep their always-on bar.
 */
const useStuckToBottom = (enabled) => {
  const ref = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const bar = ref.current;
      if (!bar) return;
      // where the bar would sit if it weren't sticky = just above whatever follows it in the column
      const next = bar.nextElementSibling;
      const naturalBottom = next
        ? next.getBoundingClientRect().top
        : bar.parentElement.getBoundingClientRect().bottom;
      const isStuck = naturalBottom > window.innerHeight + 1;
      setStuck((prev) => {
        if (prev !== isStuck) log('stuck', isStuck);
        return isStuck;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);
  return [ref, stuck];
};

const StickyActionBar = ({ children, className, bleed = 24, surfaceWhenStuck = false }) => {
  const [ref, stuck] = useStuckToBottom(surfaceWhenStuck);
  const surface = !surfaceWhenStuck || stuck;
  log('render', { bleed, surfaceWhenStuck, stuck });
  return (
    <div
      ref={ref}
      className={classNames(
        'flex flex-col items-center md:contents max-md:self-stretch',
        'max-md:sticky max-md:bottom-0 max-md:z-20 max-md:border-t',
        'max-md:-mx-[var(--bar-bleed)] max-md:px-[var(--bar-bleed)]',
        'max-md:pt-2 max-md:pb-[max(8px,env(safe-area-inset-bottom))] max-md:transition-[background-color,border-color] max-md:duration-200',
        surface
          ? 'max-md:border-[#E7E7E7] max-md:bg-white/95 max-md:backdrop-blur'
          : 'max-md:border-transparent max-md:bg-transparent',
        // Phones: 44px flat primary button (<= 61px bar). Overrides the 56px / 3px-shelf desktop look.
        'max-md:[&_button]:h-11 max-md:[&_button]:min-h-11 max-md:[&_button]:py-0 max-md:[&_button]:px-4 max-md:[&_button]:rounded-[10px] max-md:[&_button]:text-[14px]! max-md:[&_button]:drop-shadow-none! max-md:[&_button]:shadow-none! max-md:[&_button]:mt-0! max-md:[&_button]:whitespace-nowrap',
        className
      )}
      style={{ '--bar-bleed': `${bleed}px` }}
    >
      {children}
    </div>
  );
};

export default StickyActionBar;
