import { classNames } from '../../../../utils/classNames.js';
import { CIRCLE_COPY as COPY, CIRCLE_SUMMARY } from './circleData.js';
import { BUDDY_AVATAR } from './circlePhotos.js';
import { CARD, HEADING } from './circleStyles.js';

/*
 * CircleSidePanel — Figma `Your network` right-rail card: "Your circle" + three stat tiles (128 · 46 · 31) + the Buddy tip
 * (#faf4e8, r14, Buddy avatar). Props: stats ({ inCircle, following, profileViews } — defaults to the summary block), className.
 */
const CircleSidePanel = ({ stats, className }) => {
  const values = [
    stats?.inCircle ?? CIRCLE_SUMMARY.inCircle,
    stats?.following ?? CIRCLE_SUMMARY.following,
    stats?.profileViews ?? CIRCLE_SUMMARY.profileViewsThisWeek,
  ];
  return (
    <section className={classNames(CARD, 'flex flex-col gap-[14px] p-[20px]', className)}>
      <h2 className={classNames(HEADING, 'text-[18px] leading-[21px]')}>{COPY.yourCircle}</h2>
      <div className="grid grid-cols-3 gap-[10px]">
        {values.map((value, i) => (
          <div
            key={COPY.stats[i]}
            className="flex min-h-[68px] flex-col gap-[2px] rounded-[14px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[12px]"
          >
            <span className="font-sans text-[22px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading">
              {value}
            </span>
            <span className="font-sans text-[11px] leading-[14px] text-[#737373] max-lg:text-[12px]">
              {COPY.stats[i]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-[10px] rounded-[14px] bg-[#faf4e8] p-[12px]">
        <img
          src={BUDDY_AVATAR}
          alt=""
          draggable="false"
          className="size-[32px] shrink-0 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-col gap-[2px]">
          <span className="font-sans text-[12px] font-semibold leading-[14px] text-[#785910]">
            {COPY.tipTitle}
          </span>
          <p className="m-0 font-sans text-[13px] leading-[19px] text-[#1c2a21] max-lg:text-[14px] max-lg:leading-[20px]">
            {CIRCLE_SUMMARY.tip}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CircleSidePanel;
