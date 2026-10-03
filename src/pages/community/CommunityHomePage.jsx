import { useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../utils/debug.js';
import DashboardShell from '../../components/sections/dashboard/DashboardShell.jsx';
import CategoryFilterBar from '../../components/sections/community/CategoryFilterBar.jsx';
import CommunityCard from '../../components/sections/community/CommunityCard.jsx';
import CommunityIcon from '../../components/sections/community/CommunityIcon.jsx';
import { icons } from '../../components/sections/community/communityIcons.js';
import {
  COMMUNITIES,
  COMMUNITY_SEARCH_PLACEHOLDER,
  INDEX_HEADING,
  INDEX_SUBHEADING,
  buildResultsLine,
} from '../../components/sections/community/communityData.js';

const log = debug('CommunityHomePage');

/*
 * CommunityHomePage — route `/community`.
 *
 * Covers three Figma frames, which are three STATES of one screen (confirmed
 * by diffing their subtrees, not assumed):
 *   7025:85167 — default, "All" selected, 10 cards, full page header
 *   7025:85477 — a category selected: header stays, a results line appears
 *                ("Showing 4 communities in Software Engineering") and the
 *                grid narrows to the matching cards
 *   7025:85782 — scrolled: the page heading has scrolled away and only the
 *                sticky filter row remains above the grid (Figma annotation
 *                on 7025:85211: "This remains fixed on scroll") —
 *                implemented as a real sticky bar, so this state is produced
 *                by scrolling rather than by a separate screen.
 *
 * ⚠️ Figma's headline is literally "Find you People" (plain "Find you " +
 * italic brand-green "People"). Reproduced verbatim per the no-invented-copy
 * rule; see the note in communityData.js. It is very likely meant to read
 * "Find your People" — flagged for the manual Figma pass.
 *
 * Search box, corrected 2026-09-17 (second pass): a first pass moved this
 * into CategoryFilterBar unconditionally, reasoning that Figma's scrolled
 * frame (7025:85782) groups a search input with the chips. True, but
 * incomplete — re-diving the DEFAULT frame's own metadata (7025:85167) shows
 * the search box there is actually a SIBLING of the *title* (both inside
 * "Container" 7025:85200, at 450px wide), one row above the chips ("Frame
 * 14450" 7025:85211), which by itself has NO search child at all. Only the
 * SCROLLED frame's own copy of "Frame 14450" (7025:85815) carries a search
 * input, and it's narrower (306px, not 450px) — a distinct, compact copy,
 * not the same element following the chips. So there are genuinely two:
 * this page's own header search (full-size, scrolls away normally) and a
 * compact one CategoryFilterBar renders only once scrolled — same
 * hero-to-compact-header swap pattern already used on
 * `CommunityDetailPage.jsx` (IntersectionObserver + sentinel), mirrored here.
 *
 * Join state is local component state seeded from the COMMUNITIES mock —
 * no backend, no fake API call, matching every other feature in this app.
 */

const CommunityHomePage = () => {
  const [communities, setCommunities] = useState(COMMUNITIES);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    log('mount', { communities: COMMUNITIES.length, category: 'All' });
  }, []);

  /* Header → sticky-bar-gains-a-compact-search swap (Figma annotation on
     7025:85211: "This remains fixed on scroll"). The sentinel sits right
     after the header; once it scrolls out of view the sticky bar has
     reached the top, so the compact search appears alongside the chips —
     mirrors CommunityDetailPage.jsx's hero/compact-header swap exactly. */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = !entry.isIntersecting;
        setScrolled((current) => {
          if (current === next) return current;
          log('branch: header sentinel', next ? 'left view → compact search' : 'back in view');
          return next;
        });
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const visible = useMemo(() => {
    const byCategory =
      category === 'All'
        ? communities
        : communities.filter((item) => item.categories.includes(category));

    const needle = query.trim().toLowerCase();
    const result = needle
      ? byCategory.filter(
          (item) =>
            item.name.toLowerCase().includes(needle) ||
            item.description.toLowerCase().includes(needle)
        )
      : byCategory;

    log('filter applied:', { category, query: needle || '(none)', matched: result.length });
    return result;
  }, [communities, category, query]);

  const handleToggleJoin = (id) => {
    setCommunities((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        log('join state changed:', id, item.joined, '→', !item.joined);
        return { ...item, joined: !item.joined };
      })
    );
  };

  const showResultsLine = category !== 'All';
  const resultsLine = showResultsLine ? buildResultsLine(visible.length, category) : null;

  return (
    <DashboardShell>
      {/* Page header (title + full-size search) — non-sticky, so its own
          padding is fine here: `<main>` itself carries none (see
          DashboardShell.jsx), precisely so CategoryFilterBar below can be a
          true full-width, full-bleed sticky child instead of being trapped
          inside this same padded column.
          Side padding is NOT centered via `mx-auto`/`max-w` — see
          CategoryFilterBar.jsx's header comment for the real, asymmetric
          Figma numbers (24px from the sidebar, 56px from the screen edge)
          this and every other content wrapper on this page now use instead
          of a guessed symmetric value. No `max-w` cap either: Figma's
          1309px was this specific content column's width on ONE fixed
          1728px reference frame (i.e. `<main>`'s own width there, minus
          these exact margins) — capping every viewport at that px value
          left a large dead gap on wider real screens instead of letting the
          content genuinely fill the space between the two margins, which is
          what the card grid's own `auto-fill` columns are already built to
          do. */}
      <div className="flex w-full flex-col items-start gap-[3px] pb-[24px] pl-[clamp(12px,1.39vw,24px)] pr-[clamp(28px,3.24vw,56px)] pt-[32px]">
        <div className="flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex w-[355px] max-w-full flex-col items-start gap-[3px]">
            <h1 className="w-full font-display text-[clamp(30px,2.31vw,40px)] tracking-[-2px] text-black">
              {INDEX_HEADING.lead}
              {/* Figma sets this run to Instrument Serif *Italic* #387440. */}
              <em className="italic text-brand-green">{INDEX_HEADING.accent}</em>
            </h1>
            <p className="font-sans text-[16px] leading-6 tracking-[0.2px] text-[#999]">
              {INDEX_SUBHEADING}
            </p>
          </div>

          <label className="flex w-[clamp(240px,26vw,450px)] max-w-full items-center gap-[9.73px] overflow-hidden rounded-[12px] border-[1.216px] border-[#ccc] bg-white px-[24px] py-[12px] shadow-[0px_3.039px_0px_0px_rgba(191,191,191,0.8)] focus-within:border-brand-green-light-active">
            <span className="sr-only">{COMMUNITY_SEARCH_PLACEHOLDER}</span>
            <CommunityIcon src={icons.search} size={19.45} />
            <input
              type="search"
              value={query}
              placeholder={COMMUNITY_SEARCH_PLACEHOLDER}
              onChange={(event) => setQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent font-sans text-[14.5px] leading-[24.31px] tracking-[0.2431px] text-black outline-none placeholder:text-[#999]"
            />
          </label>
        </div>
      </div>

      {/* Sentinel drives the header → compact-search swap (see the
          IntersectionObserver effect above). */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full shrink-0" />

      {/* Full-bleed sticky bar (chips, + a compact search once scrolled) — a
          direct child of `<main>`, NOT nested inside the padded column
          above, so it can reach `<main>`'s true top and side edges. Its own
          inner content uses the same margins so it still aligns visually. */}
      <CategoryFilterBar
        value={category}
        onChange={setCategory}
        query={query}
        onQueryChange={setQuery}
        showSearch={scrolled}
      />

      <div className="flex w-full flex-col items-start gap-[20px] pb-[8px] pl-[clamp(12px,1.39vw,24px)] pr-[clamp(28px,3.24vw,56px)] pt-[24px]">
        {showResultsLine && (
          <p className="font-sans text-[14px] leading-[19.95px] tracking-[0.1995px] text-neutral-dark-hover">
            {resultsLine.lead}
            <span className="font-medium text-brand-green">{resultsLine.accent}</span>
          </p>
        )}

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(258px,1fr))] justify-items-center gap-[19.45px]">
          {visible.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onToggleJoin={handleToggleJoin}
            />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
};

export default CommunityHomePage;
