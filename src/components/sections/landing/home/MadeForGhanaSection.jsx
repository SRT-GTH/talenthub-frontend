import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import bgSrc from '../../../../assets/landing/made-for-ghana-background.webp';
import { LpBFlagGh, LpBIcon } from './LpBIcons.jsx';
import { AccentTitle, CARD_SHADOW, SectionHead } from './LpBParts.jsx';
import { GHANA_FEATURES, GHANA_LANGUAGES, MADE_FOR_GHANA_HEAD } from './MadeForGhanaData.js';

const log = debug('MadeForGhanaSection');

/* Card heights as drawn (not stretched): tablet/mobile 228 (language, data, safe) / 205 (the rest), desktop all 205. Grid is top-aligned so row 2's second card is taller; the top-row pair stretches to the taller of the two so they always match (text wrapping at in-between widths). */
const CARD_MIN_H = {
  language: 'min-h-[228px] md:self-stretch xl:min-h-[205px]',
  data: 'min-h-[228px] md:self-stretch xl:min-h-[205px]',
  safe: 'min-h-[228px] xl:min-h-[205px]',
  accessibility: 'min-h-[205px]',
  control: 'min-h-[205px]',
  regions: 'min-h-[205px]',
};

/*
 * S6 · Made for Ghana — Figma 7797:13187 (1728x890), tablet 7815:269764 (834x1074), mobile 7815:277581 (430x1805).
 * Desktop: photo + #14301a @ .86 overlay. Tablet/mobile: gradient #2a5730 -> #14301a. Grid 3 col / 2 col / 1 col (gap 24),
 * cards keep their natural height (Figma does not stretch them). The language row is centred on desktop, left-aligned on tablet/mobile.
 * (The kente pattern layer in this frame is hidden in Figma, so it is not built.)
 */
const MadeForGhanaSection = () => {
  useEffect(() => {
    log('mount, features:', GHANA_FEATURES.length, 'languages:', GHANA_LANGUAGES.length);
  }, []);

  return (
    <section
      id="made-for-ghana"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#2a5730_0%,#14301a_100%)] xl:bg-none xl:bg-[#14301a]"
    >
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden size-full object-cover xl:block"
      />
      <div aria-hidden="true" className="absolute inset-0 hidden bg-[#14301a]/[.86] xl:block" />
      <div className="relative mx-auto flex max-w-[1728px] flex-col items-center gap-5 px-5 py-14 md:gap-10 md:px-10 md:py-[72px] xl:px-24 xl:py-[110px]">
        <SectionHead
          maxW="max-w-[1200px]"
          chip={
            <span className="inline-flex items-center gap-[5px] rounded-full border border-solid border-[#1c2a21] bg-[#ffd86b] py-[5px] pl-2 pr-[10px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
              <LpBFlagGh />
              {MADE_FOR_GHANA_HEAD.chip}
            </span>
          }
          title={
            <AccentTitle
              lead="Made for Ghana. "
              accent="Made for everyone."
              accentClass="text-[#ffd86b]"
            />
          }
          titleClass="font-heading font-semibold text-white"
        />

        <div className="grid w-full max-w-[1536px] grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {GHANA_FEATURES.map((f) => (
            <article
              key={f.id}
              className={`flex flex-col gap-3 ${CARD_MIN_H[f.id]} rounded-[26px] border border-solid border-white/25 bg-white/[.06] p-[26px]`}
            >
              <span
                style={{ backgroundColor: f.tile }}
                className={`flex size-[52px] items-center justify-center rounded-[16px] text-[#1c2a21] ${CARD_SHADOW}`}
              >
                <LpBIcon name={f.icon} size={24} />
              </span>
              <h3 className="m-0 font-heading text-[23px] font-semibold leading-[28.8px] text-white">
                {f.title}
              </h3>
              <p className="m-0 font-sans text-[15px] leading-[23px] text-white">{f.body}</p>
            </article>
          ))}
        </div>

        <ul className="m-0 flex w-full list-none flex-wrap gap-[10px] p-0 xl:justify-center">
          {GHANA_LANGUAGES.map((l) => (
            <li
              key={l.id}
              className={`flex flex-col gap-[2px] rounded-[16px] border-[1.5px] border-solid border-[#1c2a21] px-[18px] py-[10px] ${l.active ? 'bg-[#ffd86b]' : 'bg-white'}`}
            >
              <span className="font-sans text-[15px] font-semibold leading-[17.9px] text-[#1c2a21]">
                {l.label}
              </span>
              <span
                className={`font-sans text-[12px] leading-[14.3px] ${l.active ? 'font-medium text-[#595959]' : 'text-[#999999]'}`}
              >
                {l.sub}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default MadeForGhanaSection;
