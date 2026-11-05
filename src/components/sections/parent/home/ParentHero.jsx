import { Link } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import functionIcon from '../../../../assets/parent/home-function.svg';
import linkWardIcon from '../../../../assets/parent/home-link-ward.svg';
import { HOME_DATE, QUICK_ACTIONS } from './data/parentHomeData.js';

const log = debug('ParentHero');

/*
 * ParentHero — Figma "Hero" 10027:1679 (PD-01 / PD-01d / PD-07): white card r28 border rgba(28,42,33,.1), pad 32/32/32/36.
 * Left: date eyebrow 12/700 #387440 ls1.2, greeting 44/600 (name in #387440), 16/24 #595959 copy, three white pill chips.
 * Right: four 150px stat tiles r18 (white, white, amber #faf4e8, green #e8f2ed). "Customize" pill absolute top-right (10027:1709).
 * Props: firstName, stats [{ value, label, note, tone }], greeting.
 * ⚠️ ASSUMPTION: the hero stacks (greeting, then stats) below 2xl; Figma only draws 1728. The "Review now" / "Evaluate my child" chip icons are not exported by Figma, so simple stroke glyphs stand in.
 */
// Where each quick action goes (the pages are built: To review, Evaluate my child, Link a ward).
const QUICK_TO = {
  review: '/parent/review',
  evaluate: '/parent/evaluate',
  link: '/parent/link-ward',
};

const TONES = {
  plain: { bg: 'bg-white', note: 'text-[#1d7c4d]' },
  amber: { bg: 'bg-[#faf4e8]', note: 'text-[#785910]' },
  green: { bg: 'bg-[#e8f2ed]', note: 'text-[#387440]' },
};

const ChipGlyph = ({ kind }) => {
  if (kind === 'link') return <img src={linkWardIcon} alt="" className="size-[14px]" />;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="#595959"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'search' ? (
        <>
          <circle cx="6.2" cy="6.2" r="4.2" />
          <path d="M9.4 9.4 12.2 12.2" />
        </>
      ) : (
        <>
          <rect x="1.8" y="3.6" width="10.4" height="7.6" rx="2" />
          <path d="M7 3.6V1.6M5 7.2v.4M9 7.2v.4" />
        </>
      )}
    </svg>
  );
};

// Live passes today's date and the time-of-day greeting; the defaults are the Figma frame's.
const ParentHero = ({
  firstName = 'Emma',
  greeting,
  stats = [],
  date = HOME_DATE,
  salutation = 'Good evening',
}) => (
  <section
    aria-label="Today"
    className="relative flex flex-col gap-[24px] rounded-[28px] border border-solid border-[#1c2a21]/10 bg-white py-[32px] pr-[clamp(16px,2.3vw,32px)] pl-[clamp(20px,2.6vw,36px)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] 2xl:min-h-[255px] 2xl:flex-row 2xl:items-center"
  >
    <div className="flex min-w-0 flex-1 flex-col items-start gap-[10px]">
      <p className="m-0 font-sans text-[12px] leading-normal font-bold tracking-[1.2px] whitespace-nowrap text-[#387440]">
        {date}
      </p>
      <h1 className="m-0 font-sans text-[clamp(32px,2.55vw,44px)] leading-[1.1] font-semibold text-[#1c2a21]">
        {salutation}, <span className="text-[#387440]">{firstName}.</span>
      </h1>
      <p className="m-0 max-w-[560px] font-sans text-[16px] leading-[24px] text-[#595959]">
        {greeting}
      </p>
      <div className="flex flex-wrap gap-[8px]">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.id}
            to={QUICK_TO[a.id]}
            onClick={() => log('quick action:', a.id)}
            className="flex h-[32px] cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e1eae2] bg-white px-[14px] font-sans text-[13px] leading-normal font-semibold whitespace-nowrap text-[#595959] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <ChipGlyph kind={a.icon} />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
    <ul className="m-0 grid shrink-0 list-none grid-cols-2 gap-[12px] p-0 sm:grid-cols-4 2xl:w-[636px]">
      {stats.map((s) => {
        const t = TONES[s.tone] ?? TONES.plain;
        return (
          <li
            key={s.label}
            className={`flex min-w-[150px] flex-col items-start gap-[4px] rounded-[18px] border border-solid border-[#1c2a21]/10 p-[16px] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)] ${t.bg}`}
          >
            <span className="font-sans text-[32px] leading-[1.2] font-semibold whitespace-nowrap text-[#1c2a21]">
              {s.value}
            </span>
            <span className="font-sans text-[13px] leading-normal font-semibold whitespace-nowrap text-[#1c2a21]">
              {s.label}
            </span>
            <span
              className={`font-sans text-[12px] leading-normal font-medium whitespace-nowrap ${t.note}`}
            >
              {s.note}
            </span>
          </li>
        );
      })}
    </ul>
    <button
      type="button"
      onClick={() => log('Customize (hero)')}
      className="absolute top-[17px] right-[24px] flex cursor-pointer items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[10px] py-[6px] font-sans text-[12px] leading-normal font-semibold whitespace-nowrap text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    >
      <img src={functionIcon} alt="" className="size-[14px]" />
      Customize
    </button>
  </section>
);

export default ParentHero;
