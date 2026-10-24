import PublicCard from '../ui/PublicCard.jsx';
import StackedBar from '../ui/StackedBar.jsx';
import { formatCount } from '../publicDataFormat.js';

/*
 * EducationCard — "Education" (Figma 8493:1906, 437x314): the region's education split as a 24px stacked bar with the share inside each segment, the
 * comparison split ("National"; on the district page the region) as a 12px bar, and the key (9px dots + 12/14 500 labels, gap 16).
 * Props: education { aside, label, segments, compareLabel, compareSegments }.
 * The shares are printed by StackedBar through safeShare(), so a group under 5 people never shows a number.
 */

const DOT = { dark: '#224626', mid: '#6ca271', light: '#c1d4c4' };

const EducationCard = ({ education }) => (
  <PublicCard
    id="education"
    title="Education"
    hint={education.aside}
    bodyClassName="flex flex-col gap-[12px] px-[24px] pb-[24px]"
  >
    <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
      {education.label}
    </p>
    <StackedBar
      segments={education.segments}
      height={24}
      radius={5}
      gap={0}
      legend="none"
      ariaLabel={`Education level in ${education.label}`}
    />
    <p className="m-0 font-sans text-[13px] leading-[16px] font-semibold text-[#595959]">
      {education.compareLabel}
    </p>
    <StackedBar
      segments={education.compareSegments}
      height={education.compareShowShare ? 24 : 12}
      radius={5}
      gap={0}
      showShare={Boolean(education.compareShowShare)}
      legend="none"
      ariaLabel={`Education level in ${education.compareLabel}`}
    />
    <ul
      aria-label="Key"
      className="m-0 flex list-none flex-wrap gap-x-[16px] gap-y-[6px] p-0 font-sans text-[12px] leading-[14px] font-medium text-[#1c2a21]"
    >
      {education.segments.map((s) => (
        <li key={s.key} className="flex items-center gap-[6px]">
          <span
            aria-hidden="true"
            className="size-[9px] shrink-0 rounded-full"
            style={{ background: DOT[s.tone] }}
          />
          {s.label}
          <span className="sr-only">{`: ${formatCount(s.count)} talents`}</span>
        </li>
      ))}
    </ul>
  </PublicCard>
);

export default EducationCard;
