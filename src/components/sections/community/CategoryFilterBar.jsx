import { useCallback, useEffect, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { COMMUNITY_CATEGORIES, COMMUNITY_SEARCH_PLACEHOLDER } from './communityData.js';
import CommunityIcon from './CommunityIcon.jsx';
import { icons } from './communityIcons.js';
import CommunityPageBackground from './CommunityPageBackground.jsx';

const log = debug('CategoryFilterBar');

// Same shape as Modal.jsx's own `ScrollDownChevron` (a plain 3-point
// polyline, not the heavier `ArrowRightSmIcon` from shared/assets.jsx),
// just rotated 90° for a horizontal row instead of a vertical one — this is
// the "scroll for more" affordance already established there, reused here
// rather than inventing a different shape for the same idea.
const ScrollRightChevron = ({ className }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <polyline points="6 4 10 8 6 12" />
  </svg>
);

/*
 * CategoryFilterBar — the category-chip row on the community index, joined
 * by a COMPACT search box only once the page has scrolled.
 * Source: Figma 7025:85211 (chips, default) / 7025:85526 (active chip) /
 * 7025:85850 (compact search input, "GTHInput", scrolled frame only).
 *
 * Corrected 2026-09-17, two passes:
 *   1st pass moved the search box in here unconditionally, reasoning that
 *   Figma's scrolled frame (7025:85782) groups a search input with the
 *   chips. True, but incomplete: the DEFAULT frame's own "Frame 14450"
 *   (7025:85211, the chip row) has no search child at all — the search box
 *   there (7025:85205, 450px) is a sibling of the *title*, one row above the
 *   chips. Only the SCROLLED frame's copy of that same-named frame
 *   (7025:85815) carries a search input, and it's narrower (306px) — a
 *   distinct, compact copy, not the header's box relocating.
 *   2nd pass (this one): the compact search now only renders when
 *   `showSearch` is true, driven by the same page-level scroll-swap
 *   `CommunityHomePage.jsx` already uses for the header — mirrors
 *   `CommunityDetailPage.jsx`'s hero → compact-header pattern exactly.
 *
 * Figma annotation on 7025:85211: "This remains fixed on scroll"
 * → implemented with `sticky`.
 *
 * Background + full-bleed edges, corrected 2026-09-17 (three passes):
 *   1st pass gave this row `bg-white/85 backdrop-blur-sm` — a foggy white
 *   wash that didn't match the page's own grid+ellipse background at all.
 *   2nd pass removed it entirely, which then let scrolled-past cards bleed
 *   through unreadably, since the row still needs to be fully opaque.
 *   3rd pass restored opacity via a clipped `CommunityPageBackground` copy,
 *   but still only escaped `<main>`'s own horizontal padding via a negative
 *   margin — it never reached `<main>`'s true edges (flush with the sidebar,
 *   flush with the screen edge) because it was still nested inside the
 *   page's own `mx-auto max-w-[1309px]` content column, and it still sat
 *   ~32px below `<main>`'s real top because `<main>` used to carry its own
 *   `pt-[32px]` — a `sticky top: 0` element sticks to the *padding edge* of
 *   its scrolling ancestor, so that padding became a permanent gap above the
 *   bar that scrolled cards bled through forever, no matter how the bar's
 *   own background was styled.
 *
 * Fixed for real this time: `<main>` no longer carries any padding (see
 * `CommunityShell.jsx`), so THIS component is now the thing that owns full
 * `w-full` width — genuinely flush with `<main>`'s real edges, top included,
 * with zero gap and zero horizontal inset. The chip row itself realigns to
 * the page's own content column via an inner wrapper.
 *
 * Side padding + row padding, corrected 2026-09-17 (re-verified against
 * 7025:85782 metadata, not the earlier `px-[clamp(16px,1.85vw,32px)]` guess
 * carried over from an unrelated page): the content column is NOT centered
 * via equal margins — `Main Content Canvas` (1309 wide) sits at x=363 in a
 * 1728-wide frame whose sidebar ends at x=339, i.e. 24px from the sidebar,
 * 56px from the frame's own right edge (1728-(363+1309)) — the same 56px
 * right margin the top `Nav`'s own content uses (`Frame 14443` starts at
 * x=56), so that's the page's real, consistent right-edge constant; the
 * left side is genuinely narrower because it's only the sidebar gap, not the
 * page-edge margin. `mx-auto` (implying equal margins) is wrong — replaced
 * with explicit, asymmetric `pl`/`pr`.
 *
 * Row padding also differs by state, not just search visibility: the default
 * frame's own chip row (7025:85211) is 49px tall with 6px above/below each
 * chip's 37px height; the SCROLLED row (7025:85815, inside the taller 61px
 * "Page Header & Filters") gives the chips 12px above/below instead — real,
 * deliberate extra breathing room once stuck, not a fixed constant. Both
 * states now reproduced exactly rather than one shared guessed value.
 *
 * States (both from Figma, not invented):
 *   default → white fill, 1.216px #e1eae2 border, #737373 medium label
 *   active  → #387440 fill, same border, cream-gradient semibold label
 *             (the gradient text is Figma's `bg-clip-text` treatment)
 */

const ACTIVE_LABEL_GRADIENT = 'linear-gradient(193.15deg, #fef1e7 0%, #e8f2ed 20.192%)';

const CategoryFilterBar = ({ value, onChange, query, onQueryChange, showSearch, className }) => {
  const scrollRef = useRef(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Same overflow-affordance pattern as Modal.jsx's footer "scroll down"
  // button, adapted for this row's horizontal overflow: only show the
  // button once there's genuinely more to scroll to, recheck on resize and
  // whenever the category list itself could change the row's content width.
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasMore = el.scrollWidth - el.scrollLeft - el.clientWidth > 8;
    setCanScrollRight(hasMore);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, showSearch]);

  const handleScrollClick = () => {
    log('scroll-right button clicked');
    scrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' });
  };

  return (
    <div
      className={classNames(
        'sticky top-0 z-20 w-full overflow-hidden',
        showSearch ? 'py-[12px]' : 'py-[6px]',
        className
      )}
    >
      <CommunityPageBackground className="z-0" />
      <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-[16px] pl-[clamp(12px,1.39vw,24px)] pr-[clamp(28px,3.24vw,56px)]">
        <div className="relative min-w-0 flex-1">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex min-w-0 items-center gap-[8px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Filter communities by category"
          >
            {COMMUNITY_CATEGORIES.map((category) => {
              const active = category === value;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    log('category selected:', category);
                    onChange?.(category);
                  }}
                  className={classNames(
                    'flex shrink-0 flex-col items-center justify-center rounded-[12px] border-[1.216px] border-brand-green-light-hover px-[14px] py-[6px] shadow-bottom-100 transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green',
                    active ? 'bg-brand-green' : 'bg-white hover:bg-brand-green-light'
                  )}
                >
                  <span
                    className={classNames(
                      'whitespace-nowrap font-sans tracking-[0.2431px]',
                      active
                        ? 'bg-clip-text text-[14.5px] font-semibold leading-[24.314px] text-transparent'
                        : 'text-[13px] font-medium leading-[24.314px] text-[#737373]'
                    )}
                    style={active ? { backgroundImage: ACTIVE_LABEL_GRADIENT } : undefined}
                  >
                    {category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Overflow affordance — same visual pattern as Modal.jsx's footer
              "scroll down" button, rotated for this row's horizontal
              overflow: a floating circular button, only rendered once the
              row actually has more to scroll to. */}
          {canScrollRight && (
            <button
              type="button"
              onClick={handleScrollClick}
              aria-label="Scroll right for more categories"
              className="absolute -right-[16px] top-1/2 z-10 flex size-[32px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#e0e0e0] bg-white shadow-[0px_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
            >
              <ScrollRightChevron className="size-[14px] text-[#575755]" />
            </button>
          )}
        </div>

        {/* Compact search — Figma 7025:85850 "GTHInput" on the SCROLLED frame
            only (306px, narrower than the header's own 450px copy) — see
            file header comment for why this is conditional. */}
        {showSearch && (
          <label className="flex w-[clamp(180px,18vw,306px)] shrink-0 items-center gap-[9.73px] overflow-hidden rounded-[12px] border-[1.216px] border-[#ccc] bg-white px-[24px] py-[12px] shadow-[0px_3.039px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
            <span className="sr-only">{COMMUNITY_SEARCH_PLACEHOLDER}</span>
            <CommunityIcon src={icons.search} size={19.45} />
            <input
              type="search"
              value={query}
              placeholder={COMMUNITY_SEARCH_PLACEHOLDER}
              onChange={(event) => onQueryChange?.(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] tracking-[0.2431px] text-black outline-none placeholder:text-[#999]"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default CategoryFilterBar;
