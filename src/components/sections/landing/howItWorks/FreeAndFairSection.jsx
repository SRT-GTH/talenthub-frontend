import { useEffect } from 'react';
import { CheckGlyph, HeartGlyph, LockGlyph } from './HowItWorksIcons.jsx';
import { POP_SHADOW, PRIVACY_BULLETS } from './HowItWorksData.js';
import AccentText from '../shared/AccentText.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('FreeAndFairSection');

const CARD = `flex flex-col gap-[14px] rounded-[26px] border-[1.4px] border-[#1c2a21]/[.32] bg-[#fffdf7] px-5 py-8 md:px-6 xl:p-8 ${POP_SHADOW}`;
const H3 =
  'm-0 font-heading text-[30px] font-semibold leading-[1.1] text-[#1c2a21] md:text-[34px] xl:text-[37px]';

/* P-01 "Free and fair" — Figma 7797:26223 (1728x506, #f7ebcf → #fbf6ea), tablet 7815:286626, mobile 7815:293222. */
const FreeAndFairSection = () => {
  useEffect(() => {
    log('mount');
  }, []);
  return (
    <section className="bg-[linear-gradient(180deg,#f7ebcf_0%,#fbf6ea_100%)] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="mx-auto grid w-full max-w-[1536px] grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <div className={CARD}>
          <span className="inline-flex h-7 w-fit items-center gap-[6px] rounded-full bg-[#387440] py-[6px] pl-[10px] pr-3 font-sans text-[13px] font-semibold text-white">
            <HeartGlyph className="size-[15px]" />
            For students and graduates
          </span>
          <h3 className={H3}>
            <AccentText accent="Forever.">Free. Forever. Really.</AccentText>
          </h3>
          <p className="m-0 font-sans text-[16px] leading-[25px] text-[#595959]">
            Building your profile, assessments, Skills Lab, Career Buddy and applying to roles never
            cost you anything. Companies pay to hire, so you never have to.
          </p>
        </div>
        <div className={CARD}>
          <span className="inline-flex h-[30px] w-fit items-center gap-[6px] rounded-full border border-[#1c2a21] bg-[#ffd86b] py-[6px] pl-[10px] pr-3 font-sans text-[13px] font-semibold text-[#1c2a21]">
            <LockGlyph className="size-[15px]" />
            Privacy
          </span>
          <h3 className={H3}>
            <AccentText accent="your call.">Your data, your call.</AccentText>
          </h3>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {PRIVACY_BULLETS.map((text) => (
              <li key={text} className="flex items-center gap-[10px]">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#387440] text-white">
                  <CheckGlyph className="size-[13px]" />
                </span>
                <span className="font-sans text-[15px] font-medium leading-[1.19] text-[#1c2a21]">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FreeAndFairSection;
