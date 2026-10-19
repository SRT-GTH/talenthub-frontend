import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import { LearningSpotBookIllustration } from '../../shared/assets.jsx';
import { CourseChip, HEAD, LearningCover, PLAIN } from './LearningHubParts.jsx';
import { EMPTY } from './talentLearningHubData.js';
import { useLearningData } from './useLearningData.js';

const log = debug('LearningEmptyState');

/*
 * LearningEmptyState — ML-07 "My Learning · empty (nothing started)" body (Playful 7527:1080 /
 * Focused 8110:13310): spot illustration, headline, two suggested courses, Explore / Ask Career Buddy.
 */
const LearningEmptyState = ({ learning }) => {
  const data = useLearningData();
  useEffect(() => {
    log('mount', { empty: learning.empty });
  }, [learning.empty]);

  return (
    <section
      className={classNames(
        'flex min-h-[clamp(360px,70vh,747px)] flex-col items-center justify-center gap-[14px] rounded-[28px] px-[clamp(16px,2.3vw,40px)] py-[34px] text-center',
        PLAIN
      )}
    >
      <LearningSpotBookIllustration className="size-[140px]" />
      <h2
        className={classNames(
          'm-0 text-[clamp(26px,1.97vw,34px)] leading-[1.2] text-[#1c2a21]',
          HEAD
        )}
      >
        {EMPTY.title}
      </h2>
      <p className="m-0 max-w-[640px] font-sans text-[15px] leading-[17.9px] text-[#595959]">
        {EMPTY.body}
      </p>
      <ul className="m-0 flex list-none flex-wrap justify-center gap-[16px] p-0">
        {data.emptyPicks.map((key) => {
          const course = data.courses[key];
          return (
            <li
              key={key}
              className="flex max-w-full items-center gap-[12px] rounded-[18px] border border-solid border-[#e1eae2] bg-[#f8f8f4] py-[12px] pr-[16px] pl-[12px] text-left"
            >
              <div className="size-[64px] shrink-0 overflow-hidden rounded-[14px]">
                <LearningCover kind={course.cover} variant="thumb" />
              </div>
              <div className="flex min-w-0 flex-col items-start gap-[3px]">
                <h3 className={classNames('m-0 text-[17px] leading-[21.3px] text-[#1c2a21]', HEAD)}>
                  {course.title}
                </h3>
                <p className="m-0 font-sans text-[12.5px] leading-[14.9px] text-[#737373]">
                  {course.metaPick}
                </p>
                <CourseChip
                  chip={course.chip}
                  text={course.chip.pick}
                  size="sm"
                  playfulChip="ink"
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-start justify-center gap-[10px] pt-[6px]">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            log('click', 'explore courses');
            learning.update({ view: 'explore' });
          }}
        >
          {EMPTY.explore}
        </Button>
        <Button
          variant="tertiary"
          size="lg"
          className="!text-[#1c2a21]"
          onClick={() => log('click', 'ask career buddy (no route wired yet)')}
        >
          {EMPTY.buddy}
        </Button>
      </div>
    </section>
  );
};

export default LearningEmptyState;
