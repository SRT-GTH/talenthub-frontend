import { useId, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useIsDesktop } from '../../../hooks/useMediaQuery.js';

const log = debug('StageLayout');

/*
 * StageLayout — shared responsive helpers for the 9 profile-filling
 * intro / stage-2 page pairs (wiki/responsive-plan.md §4 "Content + insight
 * aside").
 *
 * Desktop (>= lg) is the untouched Figma layout: fixed-viewport shell, left
 * content column + right insight <aside>. Below lg the shells in each
 * *Section.jsx flip to normal document flow (min-h-dvh, sticky header, sticky
 * footer) and the right <aside> is wrapped in <StageAsideAccordion>, which
 * becomes a collapsible "Why this matters" row BELOW the content.
 *
 * At >= lg the wrapper is `display: contents` and the toggle is hidden, so the
 * wrapped <aside> stays a direct flex child of the row exactly as before.
 */

const ChevronDownIcon = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d="M3.5 6l4.5 4.5L12.5 6" />
  </svg>
);

/*
 * Props:
 *   title    — toggle label (default "Why this matters").
 *   children — the existing <aside> element, passed through untouched.
 *
 * Default state: collapsed on phones (< md), open on tablets (>= md) where
 * there is room for it under the content. The toggle is >= 56px tall.
 */
export const StageAsideAccordion = ({
  title = 'Why this matters',
  tone = 'light',
  children,
  className,
}) => {
  const panelId = useId();
  const isDesktop = useIsDesktop();
  const [open, setOpen] = useState(() => {
    const isTabletUp =
      typeof window !== 'undefined' && Boolean(window.matchMedia?.('(min-width: 768px)').matches);
    log('init', { title, openByDefault: isTabletUp });
    return isTabletUp;
  });
  const dark = tone === 'dark';

  const toggle = () => {
    log('toggle', { title, nextOpen: !open });
    setOpen((value) => !value);
  };

  return (
    <div
      className={classNames(
        'lg:contents max-lg:order-1 max-lg:shrink-0 max-lg:border-t',
        dark
          ? 'max-lg:border-[rgba(255,255,255,0.12)] max-lg:bg-[#142916]'
          : 'max-lg:border-[rgba(0,0,0,0.07)] max-lg:bg-[#f8f8f4]',
        className
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={classNames(
          'lg:hidden relative flex min-h-11 w-full items-center justify-between gap-3 overflow-hidden px-4 text-left font-sans text-[14px] font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-green',
          dark ? 'text-white' : 'text-content-primary'
        )}
        style={
          dark ? { background: 'linear-gradient(109.386deg, #142916 0%, #2a5730 100%)' } : undefined
        }
      >
        {dark && (
          <>
            {/* the journey panel's sparkle decor stays visible on phones */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-12 top-1.5 select-none text-[14px] leading-none text-[rgba(255,255,255,0.25)]"
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-20 top-5 select-none text-[12px] leading-none text-[rgba(255,255,255,0.2)]"
            >
              ✦
            </span>
          </>
        )}
        <span className="relative">{title}</span>
        <ChevronDownIcon
          className={classNames(
            'relative size-4 shrink-0 transition-transform duration-200',
            dark ? 'text-white' : 'text-brand-green',
            open && 'rotate-180'
          )}
        />
      </button>
      {/* Collapsed = zero-height grid row (content stays laid out, so its
          decor is still rendered), never display:none. */}
      <div
        id={panelId}
        inert={!isDesktop && !open}
        className={classNames(
          'lg:contents max-lg:grid max-lg:transition-[grid-template-rows] max-lg:duration-200',
          open ? 'max-lg:grid-rows-[1fr]' : 'max-lg:grid-rows-[0fr]'
        )}
      >
        <div className="max-lg:min-h-0 max-lg:overflow-hidden lg:contents">{children}</div>
      </div>
    </div>
  );
};

export default StageAsideAccordion;
