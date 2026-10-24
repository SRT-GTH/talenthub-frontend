import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';
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

const SWATCH = [
  { key: 'pre', label: 'Pre-tertiary', colour: '#224626' },
  { key: 'in', label: 'In-tertiary', colour: '#6ca271' },
  { key: 'post', label: 'Post-tertiary', colour: '#c1d4c4' },
];

const TONES = ['dark', 'mid', 'light'];

const CompareEducationCard = ({ regions }) => (
  <PublicCard
    id="compare-education"
    title="Education level"
    hint="Share of talents"
    className="max-md:hidden"
    bodyClassName="flex flex-col gap-[14px] px-[24px] pb-[24px]"
  >
    {regions.map((r) => (
      <div key={r.id} className="flex flex-col gap-[14px]">
        <p className="m-0 flex items-center gap-[8px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
          <CompareDot colour={r.colour} />
          {r.name}
        </p>
        <StackedBar
          segments={SWATCH.map((s, i) => ({
            key: s.key,
            label: s.label,
            count: Math.round((r.talents * r.education[i]) / 100),
            tone: TONES[i],
          }))}
          height={22}
          radius={5}
          gap={0}
          legend="none"
          ariaLabel={`Education level in ${r.name}`}
        />
      </div>
    ))}
    <ul
      aria-label="Key"
      className="m-0 flex list-none flex-wrap gap-x-[16px] gap-y-[6px] p-0 font-sans text-[12px] leading-[14px] font-medium text-[#1c2a21]"
    >
      {SWATCH.map((s) => (
        <li key={s.key} className="flex items-center gap-[6px]">
          <span
            aria-hidden="true"
            className="h-[8px] w-[12px] shrink-0 rounded-[2px]"
            style={{ background: s.colour }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  </PublicCard>
);

export default CompareEducationCard;
