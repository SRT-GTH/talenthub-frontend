import { useEffect } from 'react';
import { HERO_MILESTONES, POP_SHADOW } from './HowItWorksData.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('HeroMilestones');

/*
 * Milestones row in the P-01 hero (Figma 7797:20801). Desktop: three auto-width cards in a row (gap 12, 62px tall).
 * Tablet (7815:281204): first two share the row 50/50, "Top Talent" takes the full second row. Mobile (7815:287800): stacked, full width.
 */
const HeroMilestones = () => {
  useEffect(() => {
    log('mount', { count: HERO_MILESTONES.length });
  }, []);
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap xl:w-auto xl:flex-nowrap">
      {HERO_MILESTONES.map((milestone, i) => {
        const { key, bg, title, text } = milestone;
        return (
          <div
            key={key}
            className={`flex min-h-[62px] items-center gap-[10px] rounded-[18px] border-[1.4px] border-[#1c2a21]/[.32] py-3 pl-3 pr-4 ${bg} ${POP_SHADOW} ${
              i < 2 ? 'md:basis-[calc(50%-6px)]' : 'md:basis-full'
            } xl:basis-auto`}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#387440]">
              <milestone.Icon className="size-[18px]" />
            </span>
            <span className="flex min-w-0 flex-col gap-px xl:whitespace-nowrap">
              <span className="font-sans text-[16px] font-bold leading-[1.19] text-[#1c2a21]">
                {title}
              </span>
              <span className="font-sans text-[13px] font-medium leading-[1.19] text-[#1c2a21]">
                {text}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HeroMilestones;
