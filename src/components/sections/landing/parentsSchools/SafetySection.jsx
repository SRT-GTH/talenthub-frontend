import PsSectionHead from './PsSectionHead.jsx';
import { SAFETY } from './ParentsSchoolsData.js';
import { FlagGlyph, LockGlyph, ShieldGlyph, UserCheckGlyph } from './ParentsSchoolsIcons.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('SafetySection');

const ICONS = {
  shield: ShieldGlyph,
  lock: LockGlyph,
  flag: FlagGlyph,
  'user-check': UserCheckGlyph,
};

/*
 * Section · Safety (Figma 7797:29820 desktop 1728x514 / tablet 7815:297416 / mobile 7815:298580): dark #14301a band with gold glow,
 * centred head and four cards (4 col → 2 col → 1 col).
 */
const SafetySection = () => {
  log('render');
  return (
    <section className="relative isolate overflow-hidden bg-[#14301a] px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:py-[100px]">
      <div className="pointer-events-none absolute -left-[200px] top-0 -z-10 size-[600px] rounded-full bg-[#c8951a]/[0.18] blur-[200px]" />
      <div className="mx-auto flex max-w-[1536px] flex-col gap-5 md:gap-10">
        <PsSectionHead
          dark
          className="max-w-[1100px]"
          chip={SAFETY.chip}
          title={SAFETY.title}
          accent="from day one."
        />
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-4">
          {SAFETY.cards.map((c) => {
            const Icon = ICONS[c.icon];
            return (
              <li
                key={c.id}
                className="flex flex-col gap-[10px] rounded-[26px] border-[1.4px] border-[#1c2a21]/[0.32] bg-[#fffdf7] p-[22px] shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]"
              >
                <span
                  className="flex size-11 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21] text-[#1c2a21]"
                  style={{ background: c.tile }}
                >
                  <span className="size-[22px]">
                    <Icon />
                  </span>
                </span>
                <h3 className="m-0 font-heading text-[22px] font-semibold leading-[27.5px] text-[#1c2a21]">
                  {c.title}
                </h3>
                <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">{c.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default SafetySection;
