import { classNames } from '../../../../utils/classNames.js';
import KpiTile from '../ui/KpiTile.jsx';

/*
 * LandingStats — the "stats row" under the hero (Figma 8514:211: 1440x176, p 28/40 gap 16, three white r24 cards 443x148; phone 8515:2703: a 2x2 grid
 * of four small cards, gap 10).
 * Stats fallback 8.1.1c (8514:2214): the live numbers did not load — each value is "—" (40/700 #595959), each sub reads "Loading live data…", and a dark
 * tooltip "Loading live data…" (8514:2220, 123x30, #1c2a21 r10) sits on the first card as drawn.
 * Props: cards (landingData buildStatCards), fallback (boolean)
 */

const LandingStats = ({ cards, fallback = false }) => (
  <section
    aria-label="Ghana Talent Hub in numbers"
    aria-busy={fallback || undefined}
    className="md:px-[28px] md:pt-[28px] xl:px-[40px]"
  >
    <ul className="m-0 grid list-none grid-cols-2 gap-[10px] p-0 md:grid-cols-3 md:gap-[16px]">
      {cards.map((card, i) => (
        <li
          key={card.key}
          className={classNames(
            'relative min-w-0 md:rounded-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white md:shadow-[0_5px_17px_rgba(0,0,0,0.04)]',
            card.phoneOnly && 'md:hidden'
          )}
        >
          <KpiTile
            eyebrow={card.eyebrow}
            eyebrowShort={card.eyebrowShort}
            count={fallback ? undefined : card.count}
            value={fallback ? '—' : card.value}
            sub={fallback ? 'Loading live data…' : card.sub}
            subShort={fallback ? 'Loading live data…' : card.subShort}
            className={classNames(fallback && 'md:[&>p:nth-child(2)]:text-[#595959]')}
          />
          {fallback && i === 0 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[8px] left-[24px] hidden rounded-[10px] bg-[#1c2a21] px-[12px] py-[8px] font-sans text-[12px] leading-[14px] font-semibold text-white md:block"
            >
              Loading live data…
            </span>
          )}
        </li>
      ))}
    </ul>
    {fallback && (
      <p role="status" className="sr-only">
        Loading live data…
      </p>
    )}
  </section>
);

export default LandingStats;
