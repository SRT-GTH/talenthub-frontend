import PublicCard from '../ui/PublicCard.jsx';
import { COMPARE_METRICS } from './compareMetrics.js';

/*
 * CompareMobileCards — the phone compare (Figma 8516:143, 390x1027): one white card per metric (Talents · 30-day growth · Assessment completion · Placements;
 * "Active partners" and the education / age / interests cards are not drawn on phones), each with one row per region: a 10px track (#efefea r4) filled in the
 * region's colour up to value / largest value, and the value (14/17 600, right-aligned in 64px). Gap 12, cards 16px apart.
 * Props: regions [{ id, name, colour, ... }].
 */

const CompareMobileCards = ({ regions }) => (
  <div className="flex flex-col gap-[16px] md:hidden">
    {COMPARE_METRICS.filter((m) => m.phone).map((m) => {
      const max = Math.max(1, ...regions.map(m.get));
      return (
        <PublicCard key={m.key} id={`compare-${m.key}`} title={m.label}>
          <ul className="m-0 flex list-none flex-col gap-[12px] p-0 font-sans">
            {regions.map((r) => (
              <li key={r.id} className="flex items-center gap-[10px]">
                <span className="sr-only">{r.name}</span>
                <span
                  aria-hidden="true"
                  className="block h-[10px] min-w-0 flex-1 overflow-hidden rounded-[4px] bg-[#efefea]"
                >
                  <span
                    className="block h-full rounded-[4px]"
                    style={{
                      width: `${Math.max(0, Math.min(1, m.get(r) / max)) * 100}%`,
                      background: r.colour,
                    }}
                  />
                </span>
                <span className="w-[64px] shrink-0 text-right text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
                  {m.text(r)}
                </span>
              </li>
            ))}
          </ul>
        </PublicCard>
      );
    })}
  </div>
);

export default CompareMobileCards;
