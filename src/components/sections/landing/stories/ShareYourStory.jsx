import AccentText from '../shared/AccentText.jsx';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon } from '../../../shared/assets.jsx';
import { CARD_SHADOW, StorySticker } from './StoryParts.jsx';
import { SHARE_STORY } from './StoriesData.js';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('ShareYourStory');

/*
 * ShareYourStory — "Section · Share yours" (Figma 7797:30825, 1728x390, gradient #eef4ea → #e3eedd, pad 100/96).
 * Card 1200x190 r36 (pad 40/48, gap 40, row): text (Bricolage 48/600 title, 17/26 body, max 620) + CTA block (button + 13/500 note);
 * "+100 XP" sticker rotated -6deg on the top edge. Tablet (7815:299677) and mobile (7815:300735): card stacks, title 30 / 32.
 * ⚠️ The CTA is inert here: Figma draws no destination for "Share my story".
 */
const ShareYourStory = () => {
  log('render');
  return (
    <section className="bg-[linear-gradient(180deg,#eef4ea_0%,#e3eedd_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div
        className={classNames(
          'relative mx-auto flex w-full max-w-[1200px] flex-col gap-5 rounded-[36px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] px-5 py-10 md:gap-7 md:px-6 xl:flex-row xl:items-center xl:gap-10 xl:px-12',
          CARD_SHADOW
        )}
      >
        <div className="flex min-w-0 flex-col gap-3 xl:max-w-[620px]">
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] text-[#1c2a21] md:text-[30px] xl:text-[40px]">
            <AccentText accent="GTH story?">{SHARE_STORY.title}</AccentText>
          </h2>
          <p className="m-0 font-sans text-[16px] leading-[26px] text-[#595959] md:text-[17px]">
            {SHARE_STORY.body}
          </p>
        </div>
        <div className="flex flex-col gap-[10px]">
          <Button
            size="md"
            rightIcon={<ArrowRightIcon />}
            className="w-fit"
            onClick={() => log('share my story clicked (inert: no destination in Figma)')}
          >
            {SHARE_STORY.cta}
          </Button>
          <span className="font-sans text-[13px] font-medium leading-[15.5px] text-[#595959]">
            {SHARE_STORY.note}
          </span>
        </div>
        <StorySticker bg="#ffd86b" className="-top-[22px] right-[5px] -rotate-6 xl:right-[74px]">
          {SHARE_STORY.sticker}
        </StorySticker>
      </div>
    </section>
  );
};

export default ShareYourStory;
