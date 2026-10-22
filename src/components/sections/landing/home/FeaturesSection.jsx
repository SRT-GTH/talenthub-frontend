import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import { LpCheckIcon, LpShieldIcon } from './LpAIcons.jsx';
import {
  FcAssessmentIcon,
  FcCareerBuddyIcon,
  FcChatChipIcon,
  FcEditChipIcon,
  FcGameChipIcon,
  FcJobReadinessIcon,
  FcSearchIcon,
  FcSkillsLabIcon,
  FcStreakIcon,
  FcVerifiedSkillsIcon,
  FcWalletWhiteIcon,
} from './LpFeatureCardIcons.jsx';
import { DotGrid } from './LpAParts.jsx';
import {
  ASSESSMENT_CARD,
  BUDDY_CARD,
  FEATURES_CHIP,
  FEATURES_HEADING,
  FEATURES_SUB,
  MATCHING_CARD,
  READINESS_CARD,
  SKILLS_LAB_CARD,
  STREAK_CARD,
  VERIFIED_CARD,
} from './FeaturesData.js';

const log = debug('FeaturesSection');

/*
 * FeaturesSection — landing S4 · Features. Figma: desktop 7797:11136 (1728x1434), tablet 7815:267713 (834x2441), mobile 7815:275530 (430x2879).
 * Dark-green section (#14301a, lime/gold glows, white dot grid), head (gold chip, Bricolage heading with gold "actually works.", sub) and eight
 * "LP · Feature" cards in three rows: [Career Buddy 1008 | Job readiness 480], [Skills Lab | MyAssessment | Verified skills], [Streaks 740 | Smart matching 768].
 * Tablet: rows stack (Skills Lab + MyAssessment side by side, the rest full width). Mobile: everything stacked.
 * Each card instance has 8px top padding (shadow room) and rows centre their cards vertically, as in Figma.
 * Icons are the Figma originals (LpFeatureCardIcons). Hover (Figma variant State=Hover, 250ms ease-out): card tilts -1deg and gets a lime hard shadow — ⚠️ lift/shadow offset estimated from the variant render.
 * ⚠️ ASSUMPTIONS: the Job-readiness instance keeps its drawn 378px height with the card centred inside it.
 */

const CARD =
  'flex flex-col gap-[14px] rounded-[28px] border-[1.2px] border-[#1c2a21]/[.22] bg-[#fffdf7] p-[26px] shadow-[4px_4px_0_rgba(28,42,33,0.14),0_8px_20px_rgba(28,42,33,0.05)] transition-[rotate,translate,box-shadow] duration-[250ms] ease-out hover:-translate-y-[2px] hover:-rotate-1 hover:shadow-[0_8px_0_#84cc16] motion-reduce:transition-none motion-reduce:hover:transform-none';

const Card = ({ tileBg, icon, kicker, title, body, children, className = '' }) => (
  <article className={`${CARD} ${className}`}>
    <div className="flex items-center gap-3">
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-[14px] border-[1.5px] border-[#1c2a21]"
        style={{ backgroundColor: tileBg }}
      >
        {icon}
      </span>
      <span className="font-sans text-[12px] font-bold leading-[14.3px] tracking-[0.1em] text-[#387440]">
        {kicker}
      </span>
    </div>
    <h3 className="m-0 font-heading text-[27px] font-semibold leading-[1.2] text-[#1c2a21]">
      {title}
    </h3>
    <p className="m-0 font-sans text-[15px] font-normal leading-[23px] text-[#595959]">{body}</p>
    {children}
  </article>
);

/* Instance wrapper: 8px shadow room on top; cards inside rows are centred. */
const Slot = ({ children, className = '' }) => (
  <div className={`pt-2 ${className}`}>{children}</div>
);

const Bar = ({ pct, h }) => (
  <div className="overflow-hidden rounded-full bg-[#eceee8]" style={{ height: h }}>
    <div
      className="h-full rounded-full bg-[linear-gradient(90deg,#387440,#84cc16)]"
      style={{ width: `${pct}%` }}
    />
  </div>
);

const Bubble = ({ from, text }) => (
  <div
    className={`self-stretch md:self-start rounded-[16px] px-[14px] py-[10px] ${
      from === 'you' ? 'bg-[#387440]' : 'border border-[#e7e7e7] bg-white'
    }`}
  >
    <span
      className={`font-sans text-[14px] font-medium leading-[16.7px] ${
        from === 'you' ? 'text-white' : 'text-[#1c2a21]'
      }`}
    >
      {text}
    </span>
  </div>
);

const VERIFIED_CHIP = {
  assessment: { cls: 'bg-[#387440] text-white', Icon: LpShieldIcon },
  game: { cls: 'bg-[#e8f2ed] text-[#1d7c4d]', Icon: FcGameChipIcon },
  chat: { cls: 'border border-[#c1d4c4] bg-white text-[#387440]', Icon: FcChatChipIcon },
  self: { cls: 'bg-[#faf4e8] text-[#785910]', Icon: FcEditChipIcon },
};

const FeaturesSection = () => {
  useEffect(() => {
    log('mount: 8 feature cards');
  }, []);

  return (
    <section
      id="lp-features"
      aria-labelledby="lp-features-heading"
      className="relative isolate overflow-hidden bg-[#14301a]"
    >
      <div className="pointer-events-none absolute -top-[200px] right-[-172px] -z-10 size-[700px] rounded-full bg-[#84cc16]/[0.16] blur-[100px] xl:right-[-172px]" />
      <div className="pointer-events-none absolute -left-[200px] top-[900px] -z-10 size-[600px] rounded-full bg-[#c8951a]/[0.18] blur-[100px]" />
      <DotGrid color="rgba(255,255,255,0.07)" className="-z-10" />

      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-6 px-5 py-14 md:px-10 md:py-[72px] xl:px-24 xl:pb-[120px] xl:pt-[110px]">
        {/* Head */}
        <div className="flex w-full max-w-[1031px] flex-col items-center gap-3">
          <span className="inline-flex h-[26px] items-center rounded-full border border-[#1c2a21] bg-[#ffd86b] px-[10px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
            {FEATURES_CHIP}
          </span>
          <h2
            id="lp-features-heading"
            className="m-0 text-center font-heading text-[32px] font-semibold leading-[1.1] text-white md:text-[40px] xl:text-[54px]"
          >
            {FEATURES_HEADING[0]}
            <span className="text-[#ffd86b]">{FEATURES_HEADING[1]}</span>
          </h2>
          <p className="m-0 max-w-[754px] text-center font-sans text-[16px] font-normal leading-[27px] text-white/[0.85] md:text-[18px] xl:max-w-[700px]">
            {FEATURES_SUB}
          </p>
        </div>

        <div className="flex w-full flex-col gap-1">
          {/* Row 1 — Career Buddy + Job readiness */}
          <div className="flex flex-col items-stretch gap-5 md:gap-[30px] xl:grid xl:min-h-[399px] xl:grid-cols-[1008fr_480fr] xl:items-center">
            <Slot>
              <Card
                tileBg="#ebf1ec"
                icon={<FcCareerBuddyIcon />}
                kicker={BUDDY_CARD.kicker}
                title={BUDDY_CARD.title}
                body={BUDDY_CARD.body}
              >
                <div className="flex flex-col gap-[10px] rounded-[20px] bg-[#f1ede2] p-4">
                  {BUDDY_CARD.messages.map((m) => (
                    <Bubble key={m.text} from={m.from} text={m.text} />
                  ))}
                </div>
              </Card>
            </Slot>
            <Slot className="flex min-h-[378px] flex-col justify-center">
              <Card
                tileBg="#ffd86b"
                icon={<FcJobReadinessIcon />}
                kicker={READINESS_CARD.kicker}
                title={READINESS_CARD.title}
                body={READINESS_CARD.body}
              >
                <div className="flex items-center gap-3">
                  <span className="font-heading text-[67px] font-semibold leading-[1.1] text-[#387440]">
                    {READINESS_CARD.score}
                  </span>
                  <span className="max-w-[180px] font-sans text-[14px] font-semibold leading-5 text-[#1c2a21]">
                    {READINESS_CARD.scoreNote}
                  </span>
                </div>
                <Bar pct={READINESS_CARD.scorePct} h={12} />
              </Card>
            </Slot>
          </div>

          {/* Row 2 — Skills Lab, MyAssessment, Verified skills */}
          <div className="mt-[1px] grid grid-cols-1 items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Slot>
              <Card
                tileBg="#fde7de"
                icon={<FcSkillsLabIcon />}
                kicker={SKILLS_LAB_CARD.kicker}
                title={SKILLS_LAB_CARD.title}
                body={SKILLS_LAB_CARD.body}
              >
                <div className="flex flex-wrap gap-2">
                  {SKILLS_LAB_CARD.games.map((g) => (
                    <div
                      key={g.name}
                      className="flex h-14 w-[calc(50%-4px)] max-md:last:w-full md:w-[141px] md:max-w-[calc(50%-4px)] flex-col gap-[2px] rounded-[14px] bg-[#f1ede2] p-3"
                    >
                      <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
                        {g.name}
                      </span>
                      <span className="font-sans text-[12px] font-semibold leading-[14.3px] text-[#387440]">
                        {g.rank}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Slot>
            <Slot>
              <Card
                tileBg="#ebf1ec"
                icon={<FcAssessmentIcon />}
                kicker={ASSESSMENT_CARD.kicker}
                title={ASSESSMENT_CARD.title}
                body={ASSESSMENT_CARD.body}
              >
                <div className="flex flex-col gap-[14px]">
                  {ASSESSMENT_CARD.traits.map((t) => (
                    <div key={t.name} className="flex flex-col gap-1">
                      <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
                        {t.name}
                      </span>
                      <Bar pct={t.pct} h={8} />
                    </div>
                  ))}
                </div>
              </Card>
            </Slot>
            <Slot className="md:col-span-2 xl:col-span-1">
              <Card
                tileBg="#ffd86b"
                icon={<FcVerifiedSkillsIcon />}
                kicker={VERIFIED_CARD.kicker}
                title={VERIFIED_CARD.title}
                body={VERIFIED_CARD.body}
              >
                <div className="flex flex-col items-start gap-2">
                  {VERIFIED_CARD.chips.map((c) => {
                    const { cls, Icon } = VERIFIED_CHIP[c.kind];
                    return (
                      <span
                        key={c.label}
                        className={`inline-flex items-center gap-[5px] rounded-full py-[5px] pl-2 pr-[10px] ${cls}`}
                      >
                        <Icon className="size-[15px]" />
                        <span className="font-sans text-[13px] font-semibold leading-[15.5px]">
                          {c.label}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </Card>
            </Slot>
          </div>

          {/* Row 3 — Streaks + Smart matching */}
          <div className="mt-[1px] flex flex-col items-stretch gap-5 md:gap-7 xl:grid xl:grid-cols-[740fr_768fr] xl:items-center">
            <Slot>
              <Card
                tileBg="#fff1e6"
                icon={<FcStreakIcon />}
                kicker={STREAK_CARD.kicker}
                title={STREAK_CARD.title}
                body={STREAK_CARD.body}
              >
                <div className="flex gap-[9px] md:gap-[10px]">
                  {STREAK_CARD.days.map((d, i) => (
                    <div key={i} className="flex w-10 flex-col items-center gap-1">
                      <span
                        className={`flex size-10 items-center justify-center rounded-full border-[1.5px] border-[#1c2a21] text-[#1c2a21] ${
                          d.done ? 'bg-[#f59638]' : 'border-dashed bg-transparent'
                        }`}
                      >
                        {d.done ? <LpCheckIcon className="size-4" /> : null}
                      </span>
                      <span className="font-sans text-[12px] font-semibold leading-[14.3px] text-[#1c2a21]">
                        {d.letter}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </Slot>
            <Slot>
              <Card
                tileBg="#ebf1ec"
                icon={<FcSearchIcon />}
                kicker={MATCHING_CARD.kicker}
                title={MATCHING_CARD.title}
                body={MATCHING_CARD.body}
              >
                <div className="flex items-center gap-[14px] rounded-[18px] border border-[#1c2a21]/10 bg-white py-[14px] pl-[14px] pr-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-[#387440] text-white">
                    <FcWalletWhiteIcon />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                    <span className="font-sans text-[15px] font-semibold leading-[17.9px] text-[#1c2a21]">
                      {MATCHING_CARD.role}
                    </span>
                    <span className="font-sans text-[13px] font-normal leading-[15.5px] text-[#595959]">
                      {MATCHING_CARD.meta}
                    </span>
                  </span>
                  <span className="font-heading text-[31px] font-semibold leading-[1.2] text-[#387440]">
                    {MATCHING_CARD.score}
                  </span>
                </div>
              </Card>
            </Slot>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
