import { useEffect } from 'react';
import FeatureMock from './FeatureMockups.jsx';
import { ACCESS, FEATURES } from './FeaturesData.js';
import { CheckGlyph } from './FeaturesIcons.jsx';
import AccentText from '../shared/AccentText.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('FeatureDeepDives');

const POP_TILE = 'shadow-[5px_5px_0_rgba(28,42,33,.2),0_10px_24px_rgba(28,42,33,.06)]';
const H3 =
  'm-0 whitespace-pre-line font-heading text-[32px] font-semibold leading-[1.1] text-[#1c2a21] md:text-[30px] xl:text-[40px]';
/* Trailing green phrase of each deep-dive title (Figma character overrides). */
const ACCENTS = {
  'career-buddy': 'any time.',
  'job-readiness': 'you are.',
  'skills-lab': 'by playing.',
  'my-assessment': 'real strengths.',
  'verified-skills': 'a CV.',
  streaks: 'every day.',
  'smart-matching': 'find you.',
};

const BODY =
  'm-0 xl:max-w-[540px] font-sans text-[16px] leading-[26px] text-[#595959] md:text-[17px]';
const EYEBROW = 'font-sans text-[12px] font-bold leading-[1.19] tracking-[1.2px] text-[#387440]';

/* Row: copy (560 wide at desktop) + visual panel. Desktop alternates sides; tablet/mobile stack copy first. */
const rowClass = 'flex w-full flex-col gap-6 md:gap-8 xl:flex-row xl:items-center xl:gap-16';
const copyClass = 'flex min-w-0 flex-col gap-4 xl:w-[560px] xl:shrink-0';

const FeatureRow = ({ feature }) => {
  const { key, mock, flip, tint, tile, Icon, eyebrow, title, text, bullets } = feature;
  return (
    <article id={key} className={rowClass}>
      <div className={copyClass}>
        <div className="flex items-center gap-[10px]">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-[14px] border-[1.4px] border-[#1c2a21]/[.32] text-[#1c2a21] ${tile} ${POP_TILE}`}
          >
            <Icon className="size-[22px]" />
          </span>
          <span className={EYEBROW}>{eyebrow}</span>
        </div>
        <h3 className={H3}>
          <AccentText accent={ACCENTS[key]}>{title}</AccentText>
        </h3>
        <p className={BODY}>{text}</p>
        <ul className="m-0 flex list-none flex-col gap-6 p-0">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-[10px]">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
                <CheckGlyph className="size-[13px]" />
              </span>
              <span className="font-sans text-[16px] font-medium leading-[1.19] text-[#1c2a21]">
                {b}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`flex w-full min-w-0 items-center justify-center rounded-[40px] px-5 py-12 md:px-6 xl:flex-1 xl:px-10 ${tint} ${
          flip ? 'xl:order-first' : ''
        }`}
      >
        <FeatureMock name={mock} />
      </div>
    </article>
  );
};

/* "Access for everyone": dark panel with the language picker + accessibility toggles (Figma 7797:27374). */
const AccessRow = () => (
  <article id="access" className={`${rowClass} xl:items-center`}>
    <div className={copyClass}>
      <span className={EYEBROW}>{ACCESS.eyebrow}</span>
      <h3 className={H3}>
        <AccentText accent="your way.">{ACCESS.title}</AccentText>
      </h3>
      <p className={BODY}>{ACCESS.text}</p>
    </div>
    <div className="flex w-full min-w-0 flex-col items-center justify-center gap-4 rounded-[40px] bg-[#14301a] max-xl:items-start px-5 py-10 md:px-6 xl:flex-1 xl:px-10">
      <div className="flex flex-wrap justify-center gap-x-6 max-md:gap-x-4 gap-y-4 max-xl:justify-start">
        {ACCESS.languages.map(({ name, native, active }) => (
          <span
            key={name}
            className={`flex flex-col rounded-2xl border-[1.5px] border-[#1c2a21] px-[14px] py-[10px] ${active ? 'bg-[#ffd86b]' : 'bg-white'}`}
          >
            <span className="font-sans text-[14px] font-bold leading-[1.19] text-[#1c2a21]">
              {name}
            </span>
            <span className="font-sans text-[12px] font-medium leading-[1.19] text-[#595959]">
              {native}
            </span>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 max-xl:justify-start">
        {ACCESS.toggles.map(({ label, on }) => (
          <span
            key={label}
            className="flex h-9 items-center gap-2 rounded-full border border-white/30 bg-white/10 max-md:w-[161px] py-2 pl-[10px] pr-3 font-sans text-[13px] font-semibold leading-[1.19] text-white"
          >
            <span
              className={`relative h-[18px] w-[30px] rounded-full ${on ? 'bg-[#84cc16]' : 'bg-[#5b6b5d]'}`}
            >
              <span
                className={`absolute top-[2px] size-[14px] rounded-full bg-white ${on ? 'right-[2px]' : 'left-[2px]'}`}
              />
            </span>
            {label}
          </span>
        ))}
      </div>
    </div>
  </article>
);

/* P-02 "Feature deep-dives" — Figma 7797:27218 (1728x3490), tablet 7815:262147, mobile 7815:263628. */
const FeatureDeepDives = () => {
  useEffect(() => {
    log('mount', { features: FEATURES.length + 1 });
  }, []);
  return (
    <section className="bg-[linear-gradient(180deg,#fbf6ea_0%,#eef4ea_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto flex w-full max-w-[1536px] flex-col gap-6 md:gap-8 xl:gap-14">
        {FEATURES.map((f) => (
          <FeatureRow key={f.key} feature={f} />
        ))}
        <AccessRow />
      </div>
    </section>
  );
};

export default FeatureDeepDives;
