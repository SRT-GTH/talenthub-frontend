import { CsWalletIcon } from './ComingSoonIcons.jsx';
import { FcStreakIcon } from '../home/LpFeatureCardIcons.jsx';
import { CS_AVATARS, CS_FLOATS } from './ComingSoonData.js';
import buddyMascot from '../../../../assets/landing/career-buddy-mascot.png';
import { classNames } from '../../../../utils/classNames.js';

/* "LP · Float" cards — white, 1.2px ink border, hard 4px shadow (.14) + soft drop. */
const FLOAT_SHADOW = 'shadow-[4px_4px_0_rgba(28,42,33,0.14),0_8px_20px_rgba(28,42,33,0.05)]';
const FLOAT_BASE = `border-[1.2px] border-[#1c2a21] bg-white text-[#1c2a21] ${FLOAT_SHADOW}`;

/* Match card — 260x130 r20: wallet tile + role/company, "96%" + label, 8px gradient bar (#387440 → #84cc16). */
export const MatchFloat = ({ className }) => {
  const m = CS_FLOATS.match;
  return (
    <div
      className={classNames(
        'flex w-[260px] flex-col gap-2 rounded-[20px] px-[18px] py-4',
        FLOAT_BASE,
        className
      )}
    >
      <div className="flex items-center gap-[10px]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#387440] text-white">
          <CsWalletIcon size={20} />
        </span>
        <div className="flex flex-col gap-px">
          <span className="font-sans text-[14px] font-semibold leading-[16.7px]">{m.title}</span>
          <span className="font-sans text-[12px] leading-[14.3px] text-[#595959]">{m.meta}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-heading text-[27px] font-semibold leading-[32.4px] text-[#387440]">
          {m.pct}
        </span>
        <span className="font-sans text-[12px] font-semibold leading-[14.3px] text-[#595959]">
          {m.pctLabel}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#eceee8]">
        <div
          className="h-2 rounded-full bg-[linear-gradient(90deg,#387440_0%,#84cc16_100%)]"
          style={{ width: `${m.fill * 100}%` }}
        />
      </div>
    </div>
  );
};

/* Streak card — 189x66 r18: fire tile (#fff1e6) + "12-day streak" (Bricolage 17/600) + "+90 XP this week" (12/600 #785910). */
export const StreakFloat = ({ className }) => (
  <div
    className={classNames(
      'flex items-center gap-[10px] rounded-[18px] py-3 pl-3 pr-4',
      FLOAT_BASE,
      className
    )}
  >
    <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#fff1e6]">
      <FcStreakIcon className="h-6 w-[19px]" />
    </span>
    <div className="flex flex-col gap-px">
      <span className="whitespace-nowrap font-heading text-[17px] font-semibold leading-[21.2px]">
        {CS_FLOATS.streak.title}
      </span>
      <span className="whitespace-nowrap font-sans text-[12px] font-semibold leading-[14.3px] text-[#785910]">
        {CS_FLOATS.streak.meta}
      </span>
    </div>
  </div>
);

/* Buddy bubble — 276x62, corners 20/20/20/4: mint mascot tile (36) + 13/500 message. */
export const BuddyFloat = ({ className }) => (
  <div
    className={classNames(
      'flex w-[276px] items-center gap-[10px] rounded-[20px_20px_20px_4px] py-3 pl-3 pr-4',
      FLOAT_BASE,
      className
    )}
  >
    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ebf1ec]">
      <img src={buddyMascot} alt="" className="size-[34px] rounded-full object-cover" />
    </span>
    <span className="font-sans text-[13px] font-medium leading-[18px]">{CS_FLOATS.buddy.text}</span>
  </div>
);

/* Recruiter ping — 283x54 pill: 32px photo (2px ink ring) + "Ama from Hubtel viewed your profile" 13/700. */
export const RecruiterFloat = ({ className }) => (
  <div
    className={classNames(
      'flex w-[283px] items-center gap-[10px] rounded-full py-[10px] pl-[10px] pr-[14px]',
      FLOAT_BASE,
      className
    )}
  >
    <img
      src={CS_AVATARS[1]}
      alt=""
      className="size-8 shrink-0 rounded-full border-2 border-[#1c2a21] object-cover"
    />
    <span className="font-sans text-[13px] font-bold leading-[15.5px]">
      {CS_FLOATS.recruiter.text}
    </span>
  </div>
);
