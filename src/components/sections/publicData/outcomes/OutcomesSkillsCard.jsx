import { formatCount, formatPercent } from '../publicDataFormat.js';
import PublicCard from '../ui/PublicCard.jsx';

/*
 * OutcomesSkillsCard — Figma "Skills evidenced" 8496:197 (668x229): header "Skills evidenced" · "How talents prove their skills"; big "83,400"
 * (40/48 700 #2a5730, formatCount) + "talents with ≥1 validated skill · 38% of all" (15/18 500 #595959); "Where the evidence comes from"
 * (12/14 600 caps +0.72 #595959); one 26px stacked bar r6 gap 2 (Assessments 61% #387440 · Skills Lab games 27% #eb6834 · Verified certificates 12% #2a78d6,
 * shares printed inside 12/14 700 white) and a key with 10px dots (13/16 500). The orange has no StackedBar tone, so the bar is drawn here.
 * The three segments are shares of the evidence (they add up to 100), not people counts. Not drawn on the phone frame -> hidden below md.
 * Props: skills { count, caption, sourcesTitle, sources[{key,label,count,tone}] }
 */

const COLORS = { green: '#387440', orange: '#eb6834', blue: '#2a78d6' };

const OutcomesSkillsCard = ({ skills, className }) => {
  const total = skills.sources.reduce((acc, s) => acc + s.count, 0);
  return (
    <PublicCard
      id="outcomes-skills"
      title="Skills evidenced"
      hint="How talents prove their skills"
      className={className}
    >
      <div className="flex flex-col gap-[14px]">
        <p className="m-0 flex flex-wrap items-baseline gap-x-[12px]">
          <span className="text-[40px] leading-[48px] font-bold text-[#2a5730]">
            {formatCount(skills.count)}
          </span>
          <span className="text-[15px] leading-[18px] font-medium text-[#595959]">
            {skills.caption}
          </span>
        </p>
        <p className="m-0 text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase">
          {skills.sourcesTitle}
        </p>
        <div
          aria-hidden="true"
          className="flex h-[26px] w-full gap-[2px] overflow-hidden rounded-[6px]"
        >
          {skills.sources.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-center text-[12px] leading-[14px] font-bold text-white"
              style={{ flex: `${s.count} 1 0`, background: COLORS[s.tone] }}
            >
              {formatPercent(s.count / total)}
            </div>
          ))}
        </div>
        <ul
          aria-label="Where the evidence comes from"
          className="m-0 flex list-none flex-wrap gap-x-[20px] gap-y-[6px] p-0"
        >
          {skills.sources.map((s) => (
            <li
              key={s.key}
              className="flex items-center gap-[6px] text-[13px] leading-[16px] font-medium text-[#1c2a21]"
            >
              <span
                aria-hidden="true"
                className="size-[10px] shrink-0 rounded-full"
                style={{ background: COLORS[s.tone] }}
              />
              {s.label}
              <span className="sr-only"> {formatPercent(s.count / total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </PublicCard>
  );
};

export default OutcomesSkillsCard;
