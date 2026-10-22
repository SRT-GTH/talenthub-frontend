import { StoriesPinIcon } from './StoriesIcons.jsx';
import { CARD_SHADOW, StorySticker } from './StoryParts.jsx';
import { FEATURED_STORY } from './StoriesData.js';
import storyPhoto from '../../../../assets/landing/stories-feature-photo.webp';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('FeaturedStory');

/*
 * FeaturedStory — "Section · Featured" (Figma 7797:30698, 1728x722, gradient #fbf3e4 → #f7ebcf, pad 100/96).
 * Card 1536x522 r36, 1.4px ink border + hard shadow: photo 620x520 | copy (pad 48/56, gap 18: region chip, quote Bricolage 27/500, author, timeline chips).
 * Tablet (7815:299550): card stacks, photo 751x520 on top, copy pad 48/40. Mobile (7815:300608): quote 22, timeline chips 2x2.
 */
const FeaturedStory = () => {
  const s = FEATURED_STORY;
  log('render', { name: s.name });
  return (
    <section className="bg-[linear-gradient(180deg,#fbf3e4_0%,#f7ebcf_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <article
        className={classNames(
          'relative mx-auto flex w-full max-w-[1536px] flex-col rounded-[36px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] xl:flex-row',
          CARD_SHADOW
        )}
      >
        <img
          src={storyPhoto}
          alt={`${s.name} — featured story`}
          className="h-[520px] w-full shrink-0 rounded-t-[34px] object-cover xl:w-[clamp(440px,40.4%,620px)] xl:rounded-l-[34px] xl:rounded-tr-none"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[18px] px-5 py-12 md:px-10 xl:px-14">
          <span className="inline-flex h-[30px] w-fit items-center gap-[6px] rounded-full border border-[#1c2a21] bg-[#ffd86b] py-[6px] pl-[10px] pr-3 font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
            <StoriesPinIcon />
            {s.region}
          </span>
          <blockquote className="m-0 font-heading text-[clamp(22px,calc(15px+1.4vw),27px)] font-medium leading-[1.2] text-[#1c2a21]">
            {s.quote}
          </blockquote>
          <div className="flex items-center gap-[14px]">
            <img
              src={s.avatar}
              alt=""
              className="size-14 shrink-0 rounded-full border-2 border-[#1c2a21] object-cover"
            />
            <div className="flex flex-col gap-[2px]">
              <span className="font-sans text-[18px] font-semibold leading-[21px] text-[#1c2a21]">
                {s.name}
              </span>
              <span className="font-sans text-[14px] leading-[17px] text-[#595959]">{s.role}</span>
            </div>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:flex md:flex-wrap">
            {s.timeline.map((t) => (
              <li
                key={t.label}
                style={{ backgroundColor: t.bg }}
                className="inline-flex min-h-7 items-center rounded-full border border-[#1c2a21] px-3 py-[5px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]"
              >
                {t.label}
              </li>
            ))}
          </ul>
        </div>
        <StorySticker bg="#84cc16" className="-top-[14px] right-2 rotate-[5deg] xl:right-[77px]">
          {s.sticker}
        </StorySticker>
      </article>
    </section>
  );
};

export default FeaturedStory;
