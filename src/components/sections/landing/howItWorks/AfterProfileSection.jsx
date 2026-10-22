import { useEffect } from 'react';
import { AFTER_PROFILE_CARDS, POP_SHADOW } from './HowItWorksData.js';
import AccentText from '../shared/AccentText.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('AfterProfileSection');

/* P-01 "After your profile" — Figma 7797:25249 (1728x529, #14301a), tablet 7815:285652, mobile 7815:292248. */
const AfterProfileSection = () => {
  useEffect(() => {
    log('mount', { cards: AFTER_PROFILE_CARDS.length });
  }, []);
  return (
    <section className="relative isolate overflow-hidden bg-[#14301a] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="pointer-events-none absolute -right-[100px] -top-[100px] -z-10 size-[600px] rounded-full bg-[#84cc16]/15 blur-[200px]" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1.5px)] bg-[length:40px_40px]"
      />
      <div className="mx-auto flex w-full max-w-[1536px] flex-col items-center gap-5 md:gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-7 items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-3 font-sans text-[13px] font-semibold text-[#1c2a21]">
            After your profile
          </span>
          <h2 className="m-0 font-heading text-[32px] font-semibold leading-[1.1] md:text-[35px] xl:text-[47px] text-white xl:whitespace-nowrap">
            <AccentText accent="good part" tone="gold">
              Then the good part starts.
            </AccentText>
          </h2>
        </div>
        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {AFTER_PROFILE_CARDS.map((card) => {
            const { key, bg, title, text } = card;
            return (
              <div
                key={key}
                className={`flex flex-col gap-3 rounded-[26px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] p-6 ${POP_SHADOW}`}
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] text-[#1c2a21] ${bg}`}
                >
                  <card.Icon className="size-6" />
                </span>
                <h3 className="m-0 font-heading text-[23px] font-semibold leading-[28.8px] text-[#1c2a21]">
                  {title}
                </h3>
                <p className="m-0 font-sans text-[15px] leading-[23px] text-[#595959]">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AfterProfileSection;
