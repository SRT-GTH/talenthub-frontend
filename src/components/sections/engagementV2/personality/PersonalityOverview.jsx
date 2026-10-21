import { useEffect } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { GoalsStepIcon, PitchStepIcon } from '../../../shared/assets.jsx';
import { ArrowLeftIcon, ArrowRightIcon, HabitBuilderIcon, PlayIcon } from './personalityIcons.jsx';
import { OVERVIEW } from './personalityData.js';
import { DISPLAY } from './personalityStyles.js';
import { PIcon, StageTrail } from './PersonalityParts.jsx';
import Button from '../../../ui/Button.jsx';

const log = debug('PersonalityOverview');

const GLYPH_NAMES = {
  User: 'User',
  Interests: 'InterestsGlyph',
  HabitBuilderSmall: 'HabitBuilderSmall',
  Skills: 'SkillsGlyph',
  Work: 'WorkGlyph',
  Portfolio: 'PortfolioGlyph',
  Certificate: 'Certificate',
};

const Glyph = ({ name, className }) => {
  if (name === 'Goals') return <GoalsStepIcon className={className} />;
  if (name === 'Pitch') return <PitchStepIcon className={className} />;
  return <PIcon name={GLYPH_NAMES[name]} className={className} />;
};

const SPARKLE = 'pointer-events-none absolute font-serif text-white/20 max-lg:hidden';
const GLASS =
  'rounded-[14px] border border-solid border-white/[0.18] bg-white/[0.12] backdrop-blur-[4px]';

/*
 * "interests(intro page(optional)" (Figma Focused 8285:11574 / Playful 7660:21908) — an optional STAGE OVERVIEW page for the
 * Personality stage (its frame name and layer names were pasted from Interests; every visible string is Personality). It sits
 * before PE-01: stage trail, title + tags, "What this stage covers" (4 numbered cards), a right dark panel (stage badge,
 * recruiter impact, time to complete, journey list) and a bottom bar (Go back / Open Personality).
 * Props: onBack (Go back), onOpen (Open Personality).
 */
const PersonalityOverview = ({ onBack, onOpen }) => {
  useEffect(() => {
    log('mount');
  }, []);
  const [titleMain, titleSub] = OVERVIEW.title.split('\n');

  return (
    <>
      <StageTrail statusTail="· 22% profile complete · auto-saved" fillPx={134} />
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1399fr_329fr]">
        <div className="flex min-w-0 flex-col">
          <section className="flex flex-col gap-[20px] bg-white px-[clamp(16px,3.24vw,56px)] py-[23px] lg:min-h-[240px]">
            <div className="flex max-w-[798px] flex-col gap-[8px]">
              <h1
                className={`${DISPLAY} m-0 text-[clamp(26px,2.14vw,37px)] leading-[1.19] font-semibold tracking-[-0.02em] text-[#1c2a21]`}
              >
                {titleMain}
                <br />
                {titleSub}
              </h1>
              <p className="m-0 font-sans text-[14px] leading-[20px] whitespace-pre-line text-[#959592] max-lg:text-[12px] max-sm:whitespace-normal">
                {OVERVIEW.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-[10px]">
              {OVERVIEW.tags.map((t, i) => (
                <span
                  key={t}
                  className={classNames(
                    'inline-flex min-h-[32px] items-center rounded-full border-2 border-solid px-[12px] font-sans text-[12px] leading-[20px] font-semibold tracking-[0.2px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]',
                    i === 0
                      ? 'border-[#eedeb8] bg-[#c8951a] text-[#fffefc]'
                      : 'border-[#e1eae2] border-[1px] bg-white text-[#737373]'
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
          </section>

          <div className="flex flex-1 flex-col gap-[24px] px-[clamp(16px,3.1vw,54px)] pb-[24px] pt-[23px]">
            <div className="flex items-center gap-[8px]">
              <span className="font-sans text-[10px] leading-[16px] font-bold tracking-[0.2px] whitespace-nowrap text-[#888888] max-lg:text-[12px]">
                What this stage covers
              </span>
              <span aria-hidden="true" className="h-[2px] flex-1 bg-[rgba(28,42,33,0.07)]" />
            </div>
            <div className="flex flex-col gap-[8px]">
              {OVERVIEW.covers.map((c, i) => (
                <div
                  key={c.title}
                  className="flex items-start gap-[13px] rounded-[12px] border border-solid border-[#e8e8e4] bg-white p-[20px_16px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]"
                >
                  <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.1)] bg-[#387440] font-mono text-[11px] leading-[14px] font-medium text-white playful:border-[rgba(28,42,33,0.35)] max-lg:text-[12px]">
                    {i + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-[4px]">
                    <h2 className="m-0 font-sans text-[13px] leading-[16px] font-bold text-[#1c2a21] max-lg:text-[14px]">
                      {c.title}
                    </h2>
                    <p className="m-0 font-sans text-[12px] leading-[18px] tracking-[0.2px] text-[#888888]">
                      {c.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 z-20 flex min-h-[84px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-solid border-[#f1f5f9] bg-white px-[clamp(16px,3.24vw,56px)] py-3">
            <p className="m-0 flex items-center gap-[4px] font-sans text-[12px] leading-[14px] text-[#babab7]">
              <span aria-hidden="true" className="size-[6px] rounded-[3px] bg-[#387440]" />
              Auto-saved · changes carry to all tabs
            </p>
            <div className="flex flex-wrap items-center gap-[24px]">
              <Button
                variant="tertiary"
                size="lg"
                leftIcon={<ArrowLeftIcon />}
                onClick={() => {
                  log('go back');
                  onBack?.();
                }}
                className="!border-[rgba(28,42,33,0.1)] !px-[34px] !py-[14px] playful:!border-[rgba(28,42,33,0.3)]"
              >
                Go back
              </Button>
              <Button
                size="md"
                rightIcon={<ArrowRightIcon />}
                onClick={() => {
                  log('open personality');
                  onOpen?.();
                }}
              >
                Open Personality
              </Button>
            </div>
          </div>
        </div>

        <aside className="relative flex flex-col items-center gap-[24px] overflow-hidden bg-[linear-gradient(135deg,#142916_0%,#2a5730_100%)] p-[10px_28px_28px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-[-142px] left-[69px] size-[320px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_60%)]"
          />
          <span className={`${SPARKLE} top-[0] right-[20px] text-[20px]`}>✦</span>
          <span className={`${SPARKLE} top-[26px] right-[52px] text-[11px]`}>✦</span>
          <span className={`${SPARKLE} bottom-[110px] left-[24px] text-[13px]`}>✦</span>
          <div className="relative flex w-full max-w-[273px] flex-col items-center gap-[10px] pt-[20px]">
            <span className="flex size-[56px] items-center justify-center rounded-[16px] border-2 border-solid border-white/30 bg-white/15 text-white">
              <HabitBuilderIcon className="size-[40px]" />
            </span>
            <div className="flex flex-col items-center gap-[3px] text-center">
              <p
                className={`${DISPLAY} m-0 font-sans text-[21px] leading-[26px] font-semibold tracking-[-0.4px] text-white`}
              >
                Personality
              </p>
              <p className="m-0 font-sans text-[10px] leading-[16px] tracking-[0.2px] text-white/60 max-lg:text-[12px]">
                Your working style, measured.
              </p>
            </div>
          </div>
          <div
            className={`${GLASS} relative flex h-[112px] w-full max-w-[273px] flex-col items-center justify-center gap-[2px] px-4 text-center`}
          >
            <p className="m-0 font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] text-white/70 max-lg:text-[12px]">
              Recruiter impact
            </p>
            <p
              className={`${DISPLAY} m-0 font-sans text-[35px] leading-[42px] font-semibold text-white`}
            >
              3+
            </p>
            <p className="m-0 font-sans text-[10px] leading-[16px] tracking-[0.2px] text-white/70 max-lg:text-[12px]">
              recruiter matches refined by working style
            </p>
          </div>
          <div
            className={`${GLASS} relative flex h-[107px] w-full max-w-[273px] flex-col items-center justify-center gap-[2px] px-4 text-center`}
          >
            <p className="m-0 font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] text-white/70 max-lg:text-[12px]">
              Time to complete
            </p>
            <p
              className={`${DISPLAY} m-0 font-sans text-[27px] leading-[32px] font-semibold text-white`}
            >
              ~8 min
            </p>
            <p className="m-0 font-sans text-[10px] leading-[16px] tracking-[0.2px] text-white/65 max-lg:text-[12px]">
              Auto-saves · do it across sittings
            </p>
          </div>
          <div
            className={`${GLASS} relative flex w-full max-w-[273px] flex-col gap-[8px] p-[16px_17px]`}
          >
            <p className="m-0 font-sans text-[10px] leading-[16px] font-semibold tracking-[0.2px] text-white/70 max-lg:text-[12px]">
              Your journey
            </p>
            {OVERVIEW.panelJourney.map((r) => {
              const dim = !r.done && !r.current;
              return (
                <div
                  key={r.label}
                  className={classNames(
                    'flex min-h-[32px] items-center gap-[13px] rounded-[10px] px-[10px]',
                    r.done && 'bg-white/[0.18] opacity-50',
                    r.current && 'border border-solid border-[#fef1e7] bg-white/[0.28] py-[1px]'
                  )}
                >
                  <span className={classNames('shrink-0 text-white', dim && 'opacity-[0.45]')}>
                    <Glyph name={r.glyph} className="size-[16px]" />
                  </span>
                  <span
                    className={classNames(
                      'flex-1 font-sans text-[10px] leading-[16px] font-medium tracking-[0.2px] text-white max-lg:text-[12px]',
                      dim && 'opacity-[0.45]'
                    )}
                  >
                    {r.label}
                  </span>
                  {r.done ? (
                    <span aria-hidden="true" className="font-sans text-[10px] text-white/80">
                      ✓
                    </span>
                  ) : null}
                  {r.current ? <PlayIcon className="size-[16px] text-white" /> : null}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
};

export default PersonalityOverview;
