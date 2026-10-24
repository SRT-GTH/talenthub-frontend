import { classNames } from '../../../../utils/classNames.js';
import Skeleton from '../ui/Skeleton.jsx';

/*
 * DirectorySkeleton — loading placeholders of the directories (`?state=loading`). ⚠️ ASSUMPTION: Figma draws no directory loading frame; this
 * mirrors the overview skeleton language (flat #f2f2ee blocks, the real card geometry) so nothing jumps when the data lands.
 *   kind 'cards'  : partner cards (3 columns desktop, 2 tablet, 1 phone)
 *   kind 'table'  : opportunity table rows / phone cards
 *   kind 'detail' : the detail header + two cards
 * The wrapper is a polite status ("Loading") and aria-busy; the blocks are decorative.
 */

const CardBlock = () => (
  <div className="flex flex-col gap-[14px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[14px] md:p-[22px]">
    <div className="flex items-center gap-[12px] md:gap-[14px]">
      <Skeleton width={44} height={44} radius={12} className="shrink-0" />
      <div className="flex flex-1 flex-col gap-[8px]">
        <Skeleton width="70%" height={16} />
        <Skeleton width="40%" height={12} />
      </div>
    </div>
    <div className="hidden flex-col gap-[14px] md:flex">
      <Skeleton width="60%" height={14} />
      <Skeleton width="50%" height={14} />
      <Skeleton width="100%" height={1} radius={0} />
      <Skeleton width="45%" height={14} />
    </div>
  </div>
);

const DirectorySkeleton = ({ kind = 'cards', count, className }) => {
  let body;
  if (kind === 'cards') {
    body = (
      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 md:gap-[24px] xl:grid-cols-3">
        {Array.from({ length: count ?? 6 }, (_, i) => (
          <CardBlock key={i} />
        ))}
      </div>
    );
  } else if (kind === 'table') {
    body = (
      <div className="flex flex-col gap-[16px] md:gap-0 md:overflow-hidden md:rounded-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white">
        {Array.from({ length: count ?? 5 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-[10px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[16px] md:min-h-[70px] md:flex-row md:items-center md:justify-between md:rounded-none md:border-0 md:border-t md:px-[24px] md:py-[16px]"
          >
            <div className="flex flex-col gap-[8px]">
              <Skeleton width={180} height={16} />
              <Skeleton width={120} height={12} />
            </div>
            <Skeleton width={90} height={14} className="hidden md:block" />
            <Skeleton width={110} height={14} className="hidden md:block" />
            <Skeleton width={90} height={14} />
          </div>
        ))}
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-[16px] md:gap-[24px]">
        <div className="flex items-center gap-[16px] rounded-[24px] md:border md:border-solid md:border-[#e7e7e7] md:bg-white md:p-[28px]">
          <Skeleton width={64} height={64} radius={16} className="shrink-0" />
          <div className="flex flex-1 flex-col gap-[10px]">
            <Skeleton width={60} height={14} />
            <Skeleton width="55%" height={26} />
            <Skeleton width="80%" height={14} />
          </div>
        </div>
        <div className="grid gap-[16px] md:gap-[24px] xl:grid-cols-[minmax(0,1fr)_456px]">
          <Skeleton height={166} radius={24} />
          <Skeleton height={166} radius={24} />
        </div>
      </div>
    );
  }
  return (
    <div role="status" aria-busy="true" className={classNames(className)}>
      <span className="sr-only">Loading</span>
      {body}
    </div>
  );
};

export default DirectorySkeleton;
