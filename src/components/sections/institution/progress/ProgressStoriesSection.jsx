import OutcomesStoryCard from '../../publicData/outcomes/OutcomesStoryCard.jsx';
import { OUTCOMES_PAGE } from './data/progressData.js';

/*
 * ProgressStoriesSection — "Stories from your alumni" (Figma 8745:47: h2 22/26 600, "Shared with each student’s written consent." 14/17, link "All stories →",
 * three Theme 8 story cards). ⚠️ ASSUMPTION: "All stories →" has no list page drawn; it scrolls to this section. Story cards link under `base` and the
 * page turns that link into ?story=<id> (the story page is the Theme 8 one). Props: base.
 */

const ProgressStoriesSection = ({ base }) => (
  <section
    id="class-stories"
    aria-labelledby="class-stories-title"
    className="flex flex-col gap-[24px]"
  >
    <div className="flex flex-wrap items-end justify-between gap-[8px]">
      <div className="flex flex-col gap-[4px]">
        <h2
          id="class-stories-title"
          className="m-0 font-sans text-[22px] leading-[26px] font-semibold text-[#1c2a21]"
        >
          {OUTCOMES_PAGE.storiesTitle}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[17px] text-[#595959]">
          {OUTCOMES_PAGE.storiesSub}
        </p>
      </div>
      <a
        href="#class-stories"
        className="inline-flex min-h-[24px] items-center font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        {OUTCOMES_PAGE.storiesLink}
      </a>
    </div>
    <ul className="m-0 grid list-none grid-cols-1 items-start gap-[24px] p-0 lg:grid-cols-3">
      {OUTCOMES_PAGE.stories.map((story) => (
        <li key={story.id} className="min-w-0">
          <OutcomesStoryCard story={story} base={base} />
        </li>
      ))}
    </ul>
  </section>
);

export default ProgressStoriesSection;
