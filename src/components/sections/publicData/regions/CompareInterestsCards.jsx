import { formatCount } from '../publicDataFormat.js';
import CompareDot from './CompareDot.jsx';

/*
 * CompareCompositionCards — the two composition cards of the compare page (Figma 8495:2086 "row · composition", each 668x259):
 *   "Education level" (aside "Share of talents"): per region its name with a 10px dot (13/16 600), a 22px stacked bar r5 (#224626 / #6ca271 / #c1d4c4 with the
 *      share inside), then the key (12x8 r2 swatches, 12/14 500). Gap 14.
 *   "Age distribution" (aside "Grouped by age band"): four bands, per band one bar per region (30px wide for two regions, 22px for three; gap 3; 3px per
 *      percentage point; the region's colour), the band label below (12/14 500 #595959). A visually hidden table carries the shares.
 * Shares go through safeShare / StackedBar, so a group under 5 people never prints a number.
 * Props: regions [{ id, name, colour, talents, education [pre, in, post %], ageShares [4 %] }].
 
 */

const CompareInterestsCards = ({ regions }) => (
  <div
    className={`grid min-w-0 grid-cols-1 gap-[24px] max-md:hidden ${
      regions.length > 2 ? 'xl:grid-cols-3' : 'md:grid-cols-2'
    }`}
  >
    {regions.map((r) => (
      <section
        key={r.id}
        aria-label={`Top interests · ${r.name}`}
        className="flex min-w-0 flex-col gap-[10px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[24px] py-[20px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)]"
      >
        <h2 className="m-0 flex items-center gap-[8px] text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          <CompareDot colour={r.colour} />
          {`Top interests · ${r.name}`}
        </h2>
        <ol className="m-0 flex list-none flex-col gap-[10px] p-0">
          {r.interests.map(([name, count], i) => (
            <li
              key={name}
              className="flex items-center justify-between gap-[8px] text-[14px] leading-[17px]"
            >
              <span className="font-medium whitespace-pre text-[#1c2a21]">{`${i + 1}  ${name}`}</span>
              <span className="font-semibold text-[#1c2a21]">{formatCount(count)}</span>
            </li>
          ))}
        </ol>
      </section>
    ))}
  </div>
);

export default CompareInterestsCards;
