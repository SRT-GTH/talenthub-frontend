import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { PLAIN } from './LearningHubParts.jsx';
import { LOADING } from './talentLearningHubData.js';

const log = debug('LearningLoading');

/*
 * LearningLoading — ML-08 "My Learning · loading" body (Playful 7527:1427 / Focused 8110:13617). Static
 * grey placeholders exactly as drawn in Figma (#e7e7e7 / #e1eae2); the shimmer is a motion-safe pulse so
 * reduced-motion users get the still frame. The visible note doubles as the polite live status.
 */
const Bone = ({ className }) => (
  <span
    className={classNames('block max-w-full bg-[#e7e7e7] motion-safe:animate-pulse', className)}
  />
);

const LearningLoading = () => {
  useEffect(() => {
    log('mount');
  }, []);

  return (
    <div
      aria-busy="true"
      className="grid grid-cols-[minmax(0,1fr)] items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="flex min-w-0 flex-col gap-[16px]">
        <div
          className={classNames(
            'flex flex-col gap-[16px] rounded-[26px] p-[14px] sm:flex-row sm:gap-[22px] sm:py-[18px] sm:pr-[22px] sm:pl-[18px]',
            PLAIN
          )}
        >
          <span className="block h-[clamp(110px,30vw,170px)] w-full shrink-0 rounded-[16px] bg-[#e1eae2] motion-safe:animate-pulse sm:h-[170px] sm:w-[clamp(180px,15vw,260px)]" />
          <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
            <Bone className="h-[10px] w-[160px] rounded-[6px]" />
            <Bone className="h-[28px] w-[360px] rounded-[16px]" />
            <Bone className="h-[12px] w-[260px] rounded-[6px]" />
            <Bone className="h-[8px] w-[480px] rounded-[6px]" />
            <div className="flex flex-wrap gap-[10px]">
              <Bone className="h-[56px] w-[200px] rounded-[16px]" />
              <Bone className="h-[48px] w-[150px] rounded-[16px]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-[16px] md:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={classNames(
                'flex items-center gap-[14px] rounded-[20px] py-[14px] pr-[16px] pl-[14px]',
                PLAIN
              )}
            >
              <Bone className="size-[64px] shrink-0 rounded-[16px] sm:size-[84px]" />
              <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                <Bone className="h-[16px] w-[180px] rounded-[6px]" />
                <Bone className="h-[10px] w-[120px] rounded-[6px]" />
                <Bone className="h-[8px] w-[220px] rounded-[6px]" />
              </div>
            </div>
          ))}
        </div>

        <p
          role="status"
          className={classNames(
            'm-0 inline-flex w-fit items-center rounded-full py-[8px] pr-[14px] pl-[12px] font-sans text-[13px] leading-[15.5px] font-semibold text-[#2d5d33]',
            PLAIN
          )}
        >
          {LOADING.note}
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[16px] xl:grid-cols-1">
        <span className="block h-[230px] rounded-[16px] bg-[#e1eae2] motion-safe:animate-pulse" />
        <Bone className="h-[110px] rounded-[16px]" />
        <Bone className="h-[120px] rounded-[16px]" />
      </div>
    </div>
  );
};

export default LearningLoading;
