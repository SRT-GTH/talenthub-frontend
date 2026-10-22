import AccentText from '../shared/AccentText.jsx';
import { StoriesPinIcon } from './StoriesIcons.jsx';
import { CARD_SHADOW, SectionChip, StorySticker } from './StoryParts.jsx';
import { MORE_STORIES, STORIES } from './StoriesData.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('MoreStories');

/* One story card — Figma "Story · Kwame A." 7797:30728: r28, pad 26, gap 16, tilted ±0.5–1.5deg, corner sticker rotated -5deg. */
const StoryCard = ({ story }) => (
  <li
    style={{ rotate: `${story.rotate}deg`, '--sr': `${story.stickerRight}px` }}
    className={classNames(
      'relative flex flex-col gap-4 rounded-[28px] border-[1.4px] border-[#1c2a21]/[.32] bg-white p-[26px]',
      CARD_SHADOW
    )}
  >
    <span
      aria-hidden="true"
      className="font-heading text-[clamp(32px,calc(14px+2.1vw),54px)] font-semibold leading-[1.1] text-[#387440]"
    >
      “
    </span>
    <p className="m-0 font-sans text-[17px] leading-[28px] text-[#1c2a21] md:text-[19px]">
      {story.quote}
    </p>
    <div className="flex items-center gap-3">
      <img
        src={story.avatar}
        alt=""
        className="size-12 shrink-0 rounded-full border-2 border-[#1c2a21] object-cover"
      />
      <div className="flex flex-col gap-[2px]">
        <span className="font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
          {story.name}
        </span>
        <span className="font-sans text-[13px] leading-[15.5px] text-[#595959]">{story.role}</span>
      </div>
    </div>
    <span className="mt-auto inline-flex h-7 w-fit items-center gap-[6px] rounded-full bg-[#ebf1ec] py-[6px] pl-[10px] pr-3 font-sans text-[12px] font-semibold leading-[14.3px] text-[#387440]">
      <StoriesPinIcon size={14} />
      {story.region}
    </span>
    <StorySticker
      bg={story.sticker.bg}
      className="-top-4 right-2 -rotate-[5deg] xl:right-[var(--sr)]"
    >
      {story.sticker.label}
    </StorySticker>
  </li>
);

/*
 * MoreStories — "Section · More stories" (Figma 7797:30722, 1728x965, gradient #f7ebcf → #fbf6ea, pad 100/96, gap 40).
 * Head: white chip + Bricolage 56/600 title (tablet 35, mobile 32). Grid gap 24: 3 cols desktop, 2 cols tablet (7815:299574), 1 col mobile.
 */
const MoreStories = () => {
  log('render', { count: STORIES.length });
  return (
    <section className="bg-[linear-gradient(180deg,#f7ebcf_0%,#fbf6ea_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <SectionChip tone="white">{MORE_STORIES.chip}</SectionChip>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-[#1c2a21]">
            <AccentText accent="a star.">{MORE_STORIES.title}</AccentText>
          </h2>
        </header>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 xl:grid-cols-3">
          {STORIES.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MoreStories;
