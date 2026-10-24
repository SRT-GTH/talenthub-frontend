import PublicCard from '../ui/PublicCard.jsx';
import { COMPARE_METRICS as METRICS } from './compareMetrics.js';

/*
 * CompareHeadlineCard — "Headline numbers" (Figma 8495:2021, 1360x432; aside "Same scale across regions"): a table, metric column 240 then one column per
 * region (gap 24). Header: "METRIC" caps 12/14 600 and each region's dot + name 14/17 600. Rows 64px with a 1px #e7e7e7 rule: the metric 15/18 500, the
 * value 18/21 700 and an 8px track (#efefea r4) whose bar is the value over the largest value of the row, in the region's colour.
 * Metrics: Talents · 30-day growth · Assessment completion · Placements made · Active partners. Talent counts go through formatCount; organisation
 * counts print as drawn. Desktop and tablet only (phones draw one card per metric, see CompareMobile).
 * Props: regions [{ id, name, colour, talents, trendPct, assessmentPct, placements, partners }].
 */

const CompareHeadlineCard = ({ regions }) => (
  <PublicCard
    id="headline"
    title="Headline numbers"
    hint="Same scale across regions"
    className="max-md:hidden"
    bodyClassName="px-[24px] pb-[20px]"
  >
    <table className="w-full table-fixed border-collapse font-sans">
      <caption className="sr-only">Headline numbers by region, same scale across regions</caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="w-[140px] py-[8px] text-left text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase xl:w-[240px]"
          >
            Metric
          </th>
          {regions.map((r) => (
            <th
              key={r.id}
              scope="col"
              className="py-[8px] pl-[24px] text-left text-[14px] leading-[17px] font-semibold text-[#1c2a21]"
            >
              <span className="flex items-center gap-[8px]">
                <span
                  aria-hidden="true"
                  className="size-[10px] shrink-0 rounded-full"
                  style={{ background: r.colour }}
                />
                {r.name}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {METRICS.map((m, i) => {
          const max = Math.max(1, ...regions.map(m.get));
          return (
            <tr
              key={m.key}
              className={i < METRICS.length - 1 ? 'border-b border-solid border-[#e7e7e7]' : ''}
            >
              <th
                scope="row"
                className="py-[14px] text-left text-[15px] leading-[18px] font-medium text-[#1c2a21]"
              >
                {m.label}
              </th>
              {regions.map((r) => (
                <td key={r.id} className="py-[14px] pl-[24px] align-top">
                  <div className="flex flex-col gap-[6px]">
                    <span className="text-[18px] leading-[21px] font-bold text-[#1c2a21]">
                      {m.text(r)}
                    </span>
                    <span
                      aria-hidden="true"
                      className="block h-[8px] overflow-hidden rounded-[4px] bg-[#efefea]"
                    >
                      <span
                        className="block h-full rounded-[4px]"
                        style={{
                          width: `${Math.max(0, Math.min(1, m.get(r) / max)) * 100}%`,
                          background: r.colour,
                        }}
                      />
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </PublicCard>
);

export default CompareHeadlineCard;
