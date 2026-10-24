import { safeShare, formatCount } from '../publicDataFormat.js';
import PublicCard from '../ui/PublicCard.jsx';
import { AGE_BANDS } from './data/regionsData.js';

/*
 * CompareCompositionCards — the two composition cards of the compare page (Figma 8495:2086 "row · composition", each 668x259):
 *   "Education level" (aside "Share of talents"): per region its name with a 10px dot (13/16 600), a 22px stacked bar r5 (#224626 / #6ca271 / #c1d4c4 with the
 *      share inside), then the key (12x8 r2 swatches, 12/14 500). Gap 14.
 *   "Age distribution" (aside "Grouped by age band"): four bands, per band one bar per region (30px wide for two regions, 22px for three; gap 3; 3px per
 *      percentage point; the region's colour), the band label below (12/14 500 #595959). A visually hidden table carries the shares.
 * Shares go through safeShare / StackedBar, so a group under 5 people never prints a number.
 * Props: regions [{ id, name, colour, talents, education [pre, in, post %], ageShares [4 %] }].
 
 */

const CompareAgeCard = ({ regions }) => {
  const barWidth = regions.length > 2 ? 22 : 30;
  return (
    <PublicCard
      id="compare-age"
      title="Age distribution"
      hint="Grouped by age band"
      className="max-md:hidden"
      bodyClassName="px-[24px] pb-[24px]"
    >
      <div aria-hidden="true" className="flex items-end justify-around gap-[20px] font-sans">
        {AGE_BANDS.map((band, b) => (
          <div key={band} className="flex min-w-0 flex-1 flex-col items-center gap-[8px]">
            <div className="flex h-[154px] items-end gap-[3px]">
              {regions.map((r) => {
                const share = safeShare(Math.round((r.talents * r.ageShares[b]) / 100), r.talents);
                return (
                  <span
                    key={r.id}
                    className="block"
                    style={{
                      width: `${barWidth}px`,
                      height: `${share === null ? 0 : share * 3}px`,
                      background: r.colour,
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[12px] leading-[14px] font-medium text-[#595959]">{band}</span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>Age distribution by region, share of talents</caption>
        <thead>
          <tr>
            <th scope="col">Age range</th>
            {regions.map((r) => (
              <th key={r.id} scope="col">
                {r.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AGE_BANDS.map((band, b) => (
            <tr key={band}>
              <th scope="row">{band}</th>
              {regions.map((r) => {
                const count = Math.round((r.talents * r.ageShares[b]) / 100);
                return (
                  <td key={r.id}>
                    {safeShare(count, r.talents) === null
                      ? formatCount(count)
                      : `${r.ageShares[b]}%`}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </PublicCard>
  );
};

export default CompareAgeCard;
