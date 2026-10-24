import { Link } from 'react-router-dom';
import PublicCard from '../ui/PublicCard.jsx';
import { DATA_BASE } from '../publicDataNav.js';
import { OUTCOMES_COPY, OUTCOME_STORY_COPY } from './data/outcomesData.js';
import OutcomesStoryCard from './OutcomesStoryCard.jsx';

/*
 * OutcomesStoriesSection — desktop/tablet: Figma "case head" 8496:255 (h2 "Stories from the platform" 22/26 600 + "Shared with each talent’s written consent."
 * 14/17 #595959 + link "All stories →" 14/17 600 #387440 on the right) over "row · stories" (3 cards, gap 24, tops aligned).
 * Phone (8507:535): one "Stories" card (hint "With consent") with the first story photo 170 high r12, title 16/19 600 and "Read story →   ·   2 more stories".
 * ⚠️ ASSUMPTION: "All stories →" has no list page drawn; it scrolls to this section (#outcomes-stories) so the link is never dead.
 * Props: stories
 */

const OutcomesStoriesSection = ({ stories }) => {
  const first = stories[0];
  return (
    <>
      <section
        id="outcomes-stories"
        aria-labelledby="outcomes-stories-title"
        className="hidden flex-col gap-[24px] md:flex"
      >
        <div className="flex flex-wrap items-end justify-between gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <h2
              id="outcomes-stories-title"
              className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]"
            >
              {OUTCOMES_COPY.storiesTitle}
            </h2>
            <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
              {OUTCOMES_COPY.storiesSub}
            </p>
          </div>
          <a
            href="#outcomes-stories"
            className="inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {OUTCOMES_COPY.storiesLink}
          </a>
        </div>
        <ul className="m-0 grid list-none grid-cols-1 items-start gap-[24px] p-0 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id} className="min-w-0">
              <OutcomesStoryCard story={story} />
            </li>
          ))}
        </ul>
      </section>
      <PublicCard
        id="outcomes-stories-mobile"
        title={OUTCOME_STORY_COPY.mobileStoriesTitle}
        hint={OUTCOME_STORY_COPY.mobileStoriesHint}
        className="md:hidden"
        bodyClassName="px-[16px] pb-[16px]"
      >
        <div className="flex flex-col gap-[12px]">
          <img
            src={first.photo}
            alt=""
            width="324"
            height="170"
            loading="lazy"
            className="h-[170px] w-full rounded-[12px] object-cover"
          />
          <p className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
            {first.title}
          </p>
          <p className="m-0 text-[13px] leading-[16px] font-semibold text-[#387440]">
            <Link
              to={`${DATA_BASE}/outcomes/stories/${first.id}`}
              className="text-inherit no-underline"
            >
              Read story →
            </Link>
            <span aria-hidden="true">&nbsp; · &nbsp;</span>
            <span className="sr-only">, </span>
            {stories.length - 1} more stories
          </p>
        </div>
      </PublicCard>
    </>
  );
};

export default OutcomesStoriesSection;
