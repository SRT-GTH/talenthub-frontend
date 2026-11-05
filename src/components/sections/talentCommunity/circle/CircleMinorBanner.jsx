import { MINOR_RESPONSE } from './circleData.js';
import { CircleShieldIcon } from './circleIcons.jsx';
import { FOCUS_RING } from './circleStyles.js';

/*
 * CircleMinorBanner — Figma `Under-18 banner` (NW-10): #e8f0fe r16 with a 1px ink@.35 outline, shield tile, "Your circle is for
 * classmates and verified mentors", the 13px rules line and "Learn more" (#1e4fd8). ⚠️ Figma draws it in the Playful frame only
 * (the Focused frame has the layer hidden), so it is `hidden` in Focused. Props: onLearnMore().
 */
const CircleMinorBanner = ({ onLearnMore, banner = MINOR_RESPONSE.banner }) => (
  <section className="hidden items-center gap-[14px] rounded-[16px] border border-solid border-[rgba(28,42,33,0.35)] bg-[#e8f0fe] px-[18px] py-[16px] playful:flex max-sm:flex-wrap">
    <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[12px] bg-white p-[8px] text-[#1e4fd8]">
      <CircleShieldIcon className="size-[22px]" />
    </span>
    <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
      <h2 className="m-0 font-sans text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
        {banner.title}
      </h2>
      <p className="m-0 font-sans text-[13px] leading-[19px] text-[#595959] max-lg:text-[14px]">
        {banner.body}
      </p>
    </div>
    <button
      type="button"
      onClick={onLearnMore}
      className={`cursor-pointer border-0 bg-transparent p-0 font-sans text-[13px] font-semibold leading-[16px] text-[#1e4fd8] max-lg:text-[14px] ${FOCUS_RING}`}
    >
      {banner.learnMore ?? MINOR_RESPONSE.banner.learnMore}
    </button>
  </section>
);

export default CircleMinorBanner;
