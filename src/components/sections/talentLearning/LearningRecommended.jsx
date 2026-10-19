import { useEffect, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { LearningBannerSparkIcon, LearningSearchIcon } from '../../shared/assets.jsx';
import LearningHub from './LearningHub.jsx';
import { RecCard } from './LearningHubParts.jsx';
import { RECOMMENDED, matchesFilter } from './talentLearningHubData.js';
import { useLearningData } from './useLearningData.js';

// ⚠️ ASSUMPTION: live banner — the API ranks by missing skills, not by matched roles (Figma: "6 matched roles").
const LIVE_BANNER = 'Ranked by the skills your target career needs that your profile doesn’t show yet.';

const log = debug('LearningRecommended');

/*
 * LearningRecommended — ML-06 "Recommended courses" (Playful 7527:625 / Focused 8110:12904). Renders the
 * shared hub header + tabs itself because the page mounts this view standalone. Filter chips and the
 * search box really filter the mock list (`matchesFilter`); "Start course" opens the course view.
 *
 * Playful chip treatment per course follows the Playful frame (Figma differs per card, see CourseChip).
 */
const PLAYFUL_CHIP = {
  powerBi: 'default',
  figma: 'pill-green',
  statistics: 'pill-green',
  interview: 'default',
  python: 'default',
  excel: 'pill-white',
};

const LearningRecommended = ({ learning }) => {
  const [filter, setFilter] = useState('matches');
  const [query, setQuery] = useState('');
  const data = useLearningData();
  const COURSES = data.courses;

  const needle = query.trim().toLowerCase();
  const items = data.recommended.filter((key) => {
    const course = COURSES[key];
    return (
      matchesFilter(course, filter) && (!needle || course.title.toLowerCase().includes(needle))
    );
  });

  useEffect(() => {
    log('mount', { view: learning.view });
  }, [learning.view]);

  log('render', { filter, query: needle, shown: items.length });

  return (
    <LearningHub learning={learning}>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <div className="flex flex-wrap items-center gap-x-[8px] gap-y-[10px]">
          <div
            role="group"
            aria-label="Filter courses"
            className="flex max-w-full min-w-0 gap-[8px] overflow-x-auto py-[2px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {RECOMMENDED.filters.map((f) => {
              const on = f.key === filter;
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    log('filter ->', f.key);
                    setFilter(f.key);
                  }}
                  className={classNames(
                    'inline-flex h-[32px] shrink-0 cursor-pointer items-center rounded-full border border-solid px-[14px] font-sans text-[13px] leading-[15.5px] font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                    on
                      ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                      : 'border-[#e1eae2] bg-white text-[#595959] hover:border-[#c1d4c4]'
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <label className="flex h-[36px] w-full items-center gap-[8px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pr-[12px] pl-[10px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440] sm:ml-auto sm:w-[240px]">
            <LearningSearchIcon className="size-[20px] shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={RECOMMENDED.search}
              aria-label={RECOMMENDED.search}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
            />
          </label>
        </div>

        <p className="m-0 flex items-center gap-[12px] rounded-[18px] border border-solid border-[#c1d4c4] bg-[#ebf1ec] py-[12px] pr-[16px] pl-[14px] font-sans text-[14px] leading-[16.7px] font-medium text-[#2d5d33]">
          <LearningBannerSparkIcon className="size-[17px] shrink-0" />
          <span className="min-w-0">{data.live ? LIVE_BANNER : RECOMMENDED.banner}</span>
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] items-start gap-[20px]">
          {items.map((key) => (
            <RecCard
              key={key}
              size="lg"
              course={COURSES[key]}
              meta={COURSES[key].metaFull}
              playfulChip={PLAYFUL_CHIP[key] ?? 'default'}
              buttonLabel={RECOMMENDED.start}
              onStart={() => {
                log('click', 'start course', key);
                data.openCourse(key);
              }}
            />
          ))}
        </div>
        {items.length === 0 && (
          <p className="m-0 py-[24px] font-sans text-[14px] text-[#737373]">
            {data.loading ? 'Loading courses…' : 'No courses match that yet.'}
          </p>
        )}
      </div>
    </LearningHub>
  );
};

export default LearningRecommended;
