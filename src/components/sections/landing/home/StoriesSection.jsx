import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { AccentTitle, CARD_SHADOW, Chip, SectionHead, Sticker } from './LpBParts.jsx';
import { STORIES, STORIES_HEAD } from './StoriesData.js';

const log = debug('StoriesSection');

/*
 * S8 · Stories — Figma 7797:14810 (1728x742), tablet 7815:271387 (834x984), mobile 7815:279204 (430x1225).
 * Cards: 3 across (gap 32) on desktop, 2 + 1 full-width on tablet, stacked (gap 20) on mobile; each card is tilted a hair (+/-0.02-0.03 rad)
 * and carries a sticker poking above its top edge. Quote glyph 67 / 50 / 34px, card padding 28 / 24 / 20.
 */
const StoriesSection = () => {
  useEffect(() => {
    log('mount, stories:', STORIES.length);
  }, []);

  return (
    <section id="stories" className="relative overflow-hidden bg-[#fbf3e4]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6px] top-[-200px] size-[700px] rounded-full bg-[#ffd86b]/35 blur-[100px] md:left-[-200px]"
      />
      <div className="relative mx-auto flex max-w-[1728px] flex-col items-center gap-5 px-5 py-14 md:gap-10 md:px-10 md:py-[72px] xl:px-24 xl:pb-[120px] xl:pt-[110px]">
        <SectionHead
          maxW="max-w-[1200px]"
          chip={
            <Chip className="border border-solid border-[#1c2a21] bg-[#ffd86b] text-[#1c2a21]">
              {STORIES_HEAD.chip}
            </Chip>
          }
          title={
            <AccentTitle
              lead="Meet people who "
              accent="found their path."
              accentClass="text-[#387440]"
            />
          }
          titleClass="font-heading font-semibold text-[#1c2a21]"
          sub={
            <p className="m-0 font-sans text-[13px] font-medium leading-[15.5px] text-[#595959]">
              {STORIES_HEAD.note}
            </p>
          }
        />

        <div className="grid w-full max-w-[1536px] grid-cols-1 gap-5 pt-5 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {STORIES.map((s, i) => (
            <article
              key={s.id}
              style={{ transform: `rotate(${s.tilt}deg)` }}
              className={`relative flex flex-col gap-[18px] rounded-[28px] bg-white px-5 py-7 md:px-6 xl:p-7 ${CARD_SHADOW} ${i === 2 ? 'md:col-span-2 xl:col-span-1' : ''}`}
              onMouseEnter={() => log('card hover:', s.id)}
            >
              <span
                aria-hidden="true"
                className="font-heading text-[34px] font-semibold leading-[37.4px] text-[#387440] md:text-[50px] md:leading-[55px] xl:text-[clamp(50px,3.9vw,67px)] xl:leading-[1.1]"
              >
                “
              </span>
              <blockquote className="m-0 font-sans text-[17px] leading-[30px] text-[#1c2a21] md:text-[20px]">
                {s.quote}
              </blockquote>
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar}
                  alt=""
                  className="size-[53px] shrink-0 rounded-full border-2 border-solid border-[#1c2a21] object-cover"
                />
                <div className="flex flex-col gap-[2px]">
                  <span className="font-sans text-[16px] font-semibold leading-[19.1px] text-[#1c2a21]">
                    {s.name}
                  </span>
                  <span className="font-sans text-[13px] leading-[15.5px] text-[#595959]">
                    {s.role}
                  </span>
                </div>
              </div>
              <Sticker
                tilt={-5.2}
                className={s.stickerPos}
                style={{ backgroundColor: s.sticker.bg }}
              >
                {s.sticker.label}
              </Sticker>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
