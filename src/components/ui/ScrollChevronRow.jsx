import { createElement, useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('ScrollChevronRow');

const Chevron = ({ direction }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="size-[14px]"
  >
    <polyline points={direction === 'prev' ? '10 4 6 8 10 12' : '6 4 10 8 6 12'} />
  </svg>
);

/*
 * ScrollChevronRow — a horizontally scrolling row with NO visible scrollbar and
 * a chevron button on each side that only appears while there is more content
 * in that direction (same affordance as the community category bar and the
 * Schedule Interview day carousel, generalised so every overflowing strip —
 * breadcrumbs, tab rows — behaves identically).
 *
 * The scroller element is polymorphic (`as`) so a breadcrumb can stay a real
 * <nav>/<ol>; all other props land on it. The chevrons are mouse/touch
 * conveniences only (`tabIndex=-1`, aria-hidden): keyboard and screen-reader
 * users reach every item through the row's own focusable content, so the
 * buttons add no tab stops and no duplicate announcements.
 *
 * Props:
 *   as              element type of the scroller (default 'div').
 *   wrapperClassName classes for the relative wrapper (give it the flex sizing,
 *                   e.g. 'flex-1 min-w-0').
 *   className       classes for the scroller itself.
 *   scrollStep      px per chevron press (default 160).
 *   focusSelector   CSS selector of the item to centre on mount / when
 *                   `focusKey` changes (e.g. the current breadcrumb step).
 *   focusKey        any value; changing it re-centres `focusSelector`.
 *   edgeClassName   background of the chevron buttons + edge fade (default
 *                   white) — pass the surface colour the row sits on.
 */
const ScrollChevronRow = ({
  as: Tag = 'div',
  wrapperClassName,
  className,
  scrollStep = 160,
  focusSelector,
  focusKey,
  edgeFrom = 'from-white',
  edgeBg = 'bg-white',
  children,
  ...rest
}) => {
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ canPrev: false, canNext: false });

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 2px tolerance for sub-pixel scroll positions.
    const next = {
      canPrev: el.scrollLeft > 2,
      canNext: el.scrollWidth - el.scrollLeft - el.clientWidth > 2,
    };
    setEdges((prev) =>
      prev.canPrev === next.canPrev && prev.canNext === next.canNext ? prev : next
    );
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    // Children can change the scroll width without resizing the scroller.
    Array.from(el.children).forEach((child) => ro?.observe(child));
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', measure);
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // Bring the current item into view without scrolling the page vertically.
  useEffect(() => {
    const el = scrollerRef.current;
    const target = focusSelector ? el?.querySelector(focusSelector) : null;
    if (!el || !target) return;
    const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2;
    el.scrollTo({ left: Math.max(0, left) });
    measure();
    log('centre', { focusSelector, left });
  }, [focusSelector, focusKey, measure]);

  const scrollBy = (direction) => {
    log('chevron', { direction });
    scrollerRef.current?.scrollBy({
      left: direction === 'next' ? scrollStep : -scrollStep,
      behavior: 'smooth',
    });
  };

  const chevronButton = (direction) => (
    <button
      type="button"
      tabIndex={-1}
      aria-hidden="true"
      onClick={() => scrollBy(direction)}
      className={classNames(
        'absolute top-1/2 z-10 grid size-[24px] -translate-y-1/2 place-items-center rounded-full',
        'border border-[#e1eae2] text-brand-green shadow-sm transition-colors hover:bg-brand-green-light',
        edgeBg,
        direction === 'prev' ? 'left-0' : 'right-0'
      )}
    >
      <Chevron direction={direction} />
    </button>
  );

  return (
    <div className={classNames('relative', wrapperClassName)}>
      {createElement(
        Tag,
        {
          ref: scrollerRef,
          // `no-scrollbar` hides the bar in every engine (Firefox AND WebKit).
          className: classNames('no-scrollbar overflow-x-auto', className),
          ...rest,
        },
        children
      )}
      {edges.canPrev && (
        <>
          <span
            aria-hidden="true"
            className={classNames(
              'pointer-events-none absolute inset-y-0 left-0 w-[40px] bg-gradient-to-r to-transparent',
              edgeFrom
            )}
          />
          {chevronButton('prev')}
        </>
      )}
      {edges.canNext && (
        <>
          <span
            aria-hidden="true"
            className={classNames(
              'pointer-events-none absolute inset-y-0 right-0 w-[40px] bg-gradient-to-l to-transparent',
              edgeFrom
            )}
          />
          {chevronButton('next')}
        </>
      )}
    </div>
  );
};

export default ScrollChevronRow;
