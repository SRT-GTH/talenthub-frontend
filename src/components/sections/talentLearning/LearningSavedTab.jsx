import { useEffect } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  LearningBellIcon,
  LearningBookmarkIcon,
  LearningClockIcon,
  LearningSpotBookmarkIllustration,
} from '../../shared/assets.jsx';
import { CourseChip, HEAD, HubSticker, LearningCover, LIFT, PLAIN } from './LearningHubParts.jsx';
import { SAVED, SAVED_EMPTY } from './talentLearningHubData.js';
import { useLearningData } from './useLearningData.js';

const log = debug('LearningSavedTab');

/*
 * LearningSavedTab — SV-02 "My Learning · Saved" (Playful 7536:1505 / Focused 8110:16121) and SV-03
 * "Saved (empty)" (Playful 7536:1892 / Focused 8110:16470). The first row is the "lifted" one in both
 * frames. The round dark button un-saves (session-only mock via savedStore, so the tab count follows);
 * when nothing is left the SV-03 empty state shows. `?empty=1` forces the empty state.
 */

const EmptySaved = ({ learning }) => (
  <section
    className={classNames(
      'flex flex-col items-center gap-[14px] rounded-[28px] px-[clamp(16px,2.3vw,40px)] py-[40px] text-center',
      PLAIN
    )}
  >
    <LearningSpotBookmarkIllustration className="size-[140px]" />
    <h2
      className={classNames(
        'm-0 text-[clamp(26px,1.97vw,34px)] leading-[1.2] text-[#1c2a21]',
        HEAD
      )}
    >
      {SAVED_EMPTY.title}
    </h2>
    <p className="m-0 max-w-[640px] font-sans text-[15px] leading-[17.9px] text-[#595959]">
      {SAVED_EMPTY.body}
    </p>
    <div className="flex flex-wrap items-start justify-center gap-[10px] pt-[6px]">
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          log('click', 'explore courses');
          learning.update({ view: 'explore', tab: null });
        }}
      >
        {SAVED_EMPTY.explore}
      </Button>
      <Button
        variant="tertiary"
        size="lg"
        className="!text-[#1c2a21]"
        onClick={() => {
          log('click', 'see recommended');
          learning.update({ view: 'recommended', tab: null });
        }}
      >
        {SAVED_EMPTY.recommended}
      </Button>
    </div>
  </section>
);

const LearningSavedTab = ({ learning }) => {
  const data = useLearningData();
  const COURSES = data.courses;
  const rows = data.saved;
  const empty = data.savedEmpty || rows.length === 0;

  useEffect(() => {
    log('mount', { empty, rows: rows.length });
  }, [empty, rows.length]);

  if (empty) return <EmptySaved learning={learning} />;

  return (
    <div className="flex min-w-0 flex-col gap-[18px]">
      <p className="m-0 flex items-center gap-[10px] rounded-[18px] border border-solid border-[#eedeb8] bg-[#faf4e8] py-[12px] pr-[16px] pl-[14px] font-sans text-[14px] leading-[16.7px] font-medium text-[#1c2a21]">
        <LearningBellIcon className="size-[17px] shrink-0" />
        <span className="min-w-0 flex-1">{SAVED.banner}</span>
        <HubSticker tone="gold" size="md" rotate={4}>
          {SAVED.count(rows.length)}
        </HubSticker>
      </p>

      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {rows.map((item, index) => {
          const course = COURSES[item.course];
          return (
            <li
              key={item.course}
              className={classNames(
                'flex flex-wrap items-center gap-x-[18px] gap-y-[10px] rounded-[22px] bg-white py-[14px] pr-[18px] pl-[14px]',
                index === 0 ? LIFT : PLAIN
              )}
            >
              <div className="h-[72px] w-[96px] shrink-0 overflow-hidden rounded-[16px] sm:h-[96px] sm:w-[150px]">
                <LearningCover kind={course.cover} variant="row" />
              </div>
              <div className="flex min-w-[160px] flex-1 flex-col items-start gap-[6px]">
                <h3
                  className={classNames(
                    'm-0 max-w-full line-clamp-2 text-[clamp(18px,1.27vw,22px)] leading-[1.25] text-[#1c2a21]',
                    HEAD
                  )}
                >
                  {course.title}
                </h3>
                <p className="m-0 max-w-full truncate font-sans text-[13px] leading-[15.5px] text-[#737373]">
                  {course.metaFull}
                </p>
                <CourseChip chip={course.chip} />
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-x-[18px] gap-y-[10px] md:w-auto md:flex-nowrap">
                <span className="inline-flex items-center gap-[5px] font-sans text-[12.5px] leading-[14.9px] font-medium whitespace-nowrap text-[#737373]">
                  <LearningClockIcon className="size-[13px] shrink-0" />
                  {item.when}
                </span>
                <button
                  type="button"
                  aria-pressed="true"
                  aria-label="Saved"
                  onClick={() => {
                    log('click', 'unsave', item.course);
                    data.unsave(item.course);
                  }}
                  className="flex size-[40px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-[#1c2a21] p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <LearningBookmarkIcon className="size-[16px]" />
                </button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    log('click', 'start course', item.course);
                    data.openCourse(item.course);
                  }}
                >
                  {SAVED.start}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LearningSavedTab;
