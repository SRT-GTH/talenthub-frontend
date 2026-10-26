import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY } from './circleData.js';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleTabs — Figma `Tabs` (Discover · Invitations · 3 · Circle · 128 · Following · 46): 14px labels, 10/14/12/14 padding, the
 * selected tab is green (#387440, 600) with a 2px underline on the full-width #e7e7e7 rule.
 * Props: active ('discover' | 'invitations' | 'circle' | 'following'), counts ({ invitations, circle, following }), onSelect(id).
 */
const labelOf = (id, counts) => {
  if (id === 'discover') return COPY.tabs.discover;
  return `${COPY.tabs[id]} · ${counts[id]}`;
};

const CircleTabs = ({ active, counts, onSelect }) => (
  <div
    role="tablist"
    aria-label="My circle"
    className="no-scrollbar -mx-[12px] flex gap-[6px] overflow-x-auto border-b border-solid border-[#e7e7e7] px-[12px] md:mx-0 md:px-0"
  >
    {/* Following stays hidden on the live screen until Follow is specified (US-5.3.1-01 Q5). */}
    {['discover', 'invitations', 'circle', 'following']
      .filter((id) => id !== 'following' || counts.following != null)
      .map((id) => {
        const selected = active === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(id)}
            className={classNames(
              '-mb-px shrink-0 cursor-pointer whitespace-nowrap border-0 border-b-2 border-solid bg-transparent px-[14px] pb-[12px] pt-[10px] font-sans text-[14px] leading-[17px]',
              selected
                ? 'border-[#387440] font-semibold text-[#387440]'
                : 'border-transparent font-medium text-[#595959]',
              FOCUS_RING
            )}
          >
            {labelOf(id, counts)}
          </button>
        );
      })}
  </div>
);

export default CircleTabs;
