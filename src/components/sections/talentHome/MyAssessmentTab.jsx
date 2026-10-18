import {
  ArrowRightIcon,
  NextAssessmentBarChartIcon,
  PersonalityLightbulbIcon,
  PersonalityTypeCompassIcon,
  ResultsLockedPadlockIcon,
  SkillFunctionIcon,
  SkillsEvidenceBoltIcon,
  SkillsLabControllerIcon,
} from '../../shared/assets.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { classNames } from '../../../utils/classNames.js';
import Button from '../../ui/Button.jsx';
import TalentHomeHero from './TalentHomeHero.jsx';
import {
  CARD,
  LIFT,
  DISPLAY,
  Chip,
  SoftChip,
  EvidenceChip,
  CheckChip,
  CardHead,
  Sticker,
  HomeTabs,
} from './TabsParts.jsx';
import {
  ASSESSMENT_SUMMARY,
  PERSONALITY,
  SKILLS_EVIDENCE,
  NEXT_ASSESSMENT,
  EVIDENCE_LEGEND,
  SKILLS_LAB,
} from './talentHomeTabsData.js';

const log = debug('MyAssessmentTab');

/*
 * MyAssessmentTab — HM-06. Figma Playful 7741:3318 / Focused 8097:8194.
 * Renders as the page body for `?tab=assessment`: hero (Core), the Home tabs switcher,
 * the assessment summary band, then Personality + Skills evidence (left) and Next
 * assessment + label legend + Skills Lab (right). Mock content: talentHomeTabsData.js.
 */

const PersonalityCard = ({ data = PERSONALITY }) => {
  const p = data;
  return (
    <section
      aria-labelledby="ma-personality"
      className={classNames(CARD, 'flex flex-col gap-[20px] p-[clamp(14px,1.6vw,22px)]')}
    >
      <CardHead
        icon={PersonalityLightbulbIcon}
        title={<span id="ma-personality">{p.title}</span>}
        trailing={<Chip>{p.status}</Chip>}
      />
      <div className="flex items-start gap-[clamp(12px,1.3vw,18px)]">
        <span
          className={classNames(
            'flex size-[clamp(56px,5vw,80px)] shrink-0 items-center justify-center rounded-[22px] bg-[#c8951a]',
            'border border-[rgba(28,42,33,0.1)] shadow-[0_2px_4px_rgba(28,42,33,0.04),0_1px_1px_rgba(28,42,33,0.04)]',
            'playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_10px_12px_rgba(28,42,33,0.06),5px_5px_0_rgba(28,42,33,0.55)]'
          )}
        >
          <PersonalityTypeCompassIcon className="size-[clamp(26px,2.4vw,38px)]" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          <p
            className={classNames(
              'text-[clamp(22px,2.1vw,29px)] font-semibold leading-[1.2] text-[#1c2a21]',
              DISPLAY
            )}
          >
            {p.lead}
            <span className="text-[#387440]">{p.type}</span>
          </p>
          <p className="text-[13px] font-medium text-[#595959]">{p.sub}</p>
          <p className="text-[14px] leading-[21px] text-[#1c2a21]">{p.body}</p>
          <div className="flex flex-wrap items-center gap-[6px]">
            <span className="whitespace-nowrap text-[12px] font-bold text-[#595959]">
              {p.affinityLabel}
            </span>
            {p.affinity.map((a) => (
              <SoftChip key={a}>{a}</SoftChip>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-[#e7e7e7] pt-[14px]">
        <ul className="grid gap-x-[28px] gap-y-[20px] md:grid-cols-2">
          {p.traits.map((t) => (
            <li key={t.name} className="flex flex-col gap-[5px]">
              <div className="flex items-center justify-between gap-2 whitespace-nowrap font-semibold">
                <span className="text-[13px] text-[#1c2a21]">{t.name}</span>
                <span
                  className={classNames(
                    'text-[12px]',
                    t.strong ? 'text-[#387440]' : 'text-[#595959]'
                  )}
                >
                  {t.label}
                </span>
              </div>
              <div
                className="h-[8px] overflow-hidden rounded-[4px] bg-[#eceee8]"
                role="img"
                aria-label={`${t.name}, ${t.label}`}
              >
                <div
                  className={classNames(
                    'h-full rounded-[4px] bg-[#387440]',
                    t.gradient
                      ? 'playful:bg-gradient-to-r playful:from-[#387440] playful:to-[#84cc16]'
                      : null
                  )}
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="flex items-start gap-[8px] rounded-[12px] bg-[#f7f8f4] px-[12px] py-[10px] text-[12px] text-[#595959]">
        <ResultsLockedPadlockIcon className="mt-px size-[14px] shrink-0" />
        {p.lock}
      </p>
    </section>
  );
};

const SkillsEvidenceCard = ({ data = SKILLS_EVIDENCE }) => {
  const s = data;
  return (
    <section
      aria-labelledby="ma-skills"
      className={classNames(
        CARD,
        'flex flex-col gap-[8px] p-[clamp(14px,1.6vw,22px)] playful:gap-[4px]'
      )}
    >
      <CardHead
        icon={SkillsEvidenceBoltIcon}
        title={<span id="ma-skills">{s.title}</span>}
        trailing={<Chip className="max-sm:hidden">{s.count}</Chip>}
      />
      <p className="text-[13px] text-[#595959]">{s.intro}</p>
      <ul>
        {s.skills.map((sk) => (
          <li
            key={sk.name}
            className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px] border-b border-[#e7e7e7] py-[11px]"
          >
            <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-[#f7f8f4]">
              <SkillFunctionIcon className="size-[17px]" />
            </span>
            <span className="flex min-w-0 flex-1 basis-[140px] flex-col gap-px">
              <span className="text-[14px] font-semibold text-[#1c2a21]">{sk.name}</span>
              <span className="text-[12px] text-[#595959]">{sk.level}</span>
            </span>
            <EvidenceChip kind={sk.evidence} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between pt-[10px] text-[13px]">
        <span className="font-medium text-[#595959]">{s.more || ''}</span>
        <button
          type="button"
          onClick={() => log('manage skills')}
          className="cursor-pointer font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {s.manage}
        </button>
      </div>
    </section>
  );
};

const NextAssessmentCard = ({ data = NEXT_ASSESSMENT }) => {
  const n = data;
  const navigate = useNavigate();
  return (
    <section
      aria-labelledby="ma-next"
      className={classNames(
        'relative flex flex-col gap-[12px] rounded-[24px] bg-white p-[clamp(14px,1.6vw,22px)] playful:overflow-visible',
        LIFT
      )}
    >
      <div className="flex items-center gap-[12px]">
        <span className="flex size-[48px] shrink-0 items-center justify-center rounded-[14px] border border-[#eedeb8] bg-[#faf4e8]">
          <NextAssessmentBarChartIcon className="size-[24px]" />
        </span>
        <span className="flex min-w-0 flex-col gap-[2px]">
          <h2 id="ma-next" className="text-[16px] font-semibold leading-normal text-[#1c2a21]">
            {n.title}
          </h2>
          <span className="text-[12px] font-medium text-[#785910]">
            <span className="playful:hidden">{n.meta('pts')}</span>
            <span className="hidden playful:inline">{n.meta('XP')}</span>
          </span>
        </span>
      </div>
      <p className="text-[14px] leading-[21px] text-[#595959]">{n.body}</p>
      <Button
        size="md"
        className="w-full"
        rightIcon={<ArrowRightIcon />}
        onClick={() => {
          log('start assessment');
          if (n.to) navigate(n.to);
        }}
      >
        {n.cta}
      </Button>
      <Sticker rotate="-5deg" className="absolute right-[clamp(12px,3.5vw,38px)] top-[-23px]">
        {n.sticker}
      </Sticker>
    </section>
  );
};

const LegendCard = () => (
  <section
    aria-labelledby="ma-legend"
    className={classNames(CARD, 'flex flex-col gap-[20px] p-[clamp(14px,1.6vw,22px)]')}
  >
    <h2 id="ma-legend" className="text-[16px] font-semibold text-[#1c2a21]">
      {EVIDENCE_LEGEND.title}
    </h2>
    {EVIDENCE_LEGEND.items.map((it) => (
      <div key={it.kind} className="flex flex-col items-start gap-[8px]">
        <EvidenceChip kind={it.kind} />
        <p className="text-[12px] text-[#595959]">{it.note}</p>
      </div>
    ))}
  </section>
);

const SkillsLabCard = ({ data = SKILLS_LAB }) => (
  <section
    aria-labelledby="ma-lab"
    className={classNames(CARD, 'flex flex-col gap-[8px] p-[clamp(14px,1.6vw,22px)]')}
  >
    <CardHead
      icon={SkillsLabControllerIcon}
      title={<span id="ma-lab">{data.title}</span>}
      trailing={
        <button
          type="button"
          onClick={() => log('play more')}
          className="cursor-pointer whitespace-nowrap text-[14px] font-semibold text-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
        >
          {data.more}
        </button>
      }
    />
    {data.empty ? <p className="text-[13px] leading-[19px] text-[#595959]">{data.empty}</p> : null}
    <ul>
      {data.games.map((g) => (
        <li
          key={g.name}
          className="flex items-center gap-[10px] border-b border-[#e7e7e7] py-[10px] first:mt-[6px] playful:first:mt-[6px]"
        >
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="truncate text-[14px] font-semibold text-[#1c2a21]">{g.name}</span>
            <span className="text-[12px] text-[#595959]">{g.when}</span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-[3px]">
            <span className="flex items-end gap-[2px] whitespace-nowrap">
              <span
                className={classNames(
                  'text-[19px] font-semibold leading-[1.25] text-[#1c2a21]',
                  DISPLAY
                )}
              >
                {g.score}
              </span>
              <span className="text-[12px] font-medium text-[#595959]">/100</span>
            </span>
            <span
              className={classNames(
                'whitespace-nowrap text-[12px] font-semibold',
                g.strong ? 'text-[#387440]' : 'text-[#595959]'
              )}
            >
              {g.top}
            </span>
            <span
              className="h-[5px] w-[90px] overflow-hidden rounded-[2.5px] bg-[#eceee8]"
              role="img"
              aria-label={`${g.name} ${g.score} out of 100`}
            >
              <span
                className="block h-full rounded-[2.5px] bg-[#387440]"
                style={{ width: `${g.score * 0.9}%` }}
              />
            </span>
          </span>
        </li>
      ))}
    </ul>
  </section>
);

// Shown on real data before the tab's data arrives, or when a part has no result yet.
const PlainCard = ({ title, body }) => (
  <section className={classNames(CARD, 'flex flex-col gap-[8px] p-[clamp(14px,1.6vw,22px)]')}>
    <h3 className="text-[17px] font-semibold text-[#1c2a21]">{title}</h3>
    <p className="text-[14px] leading-[21px] text-[#595959]">{body}</p>
  </section>
);

const MyAssessmentTab = ({ home }) => {
  // Real data (talentHomeLive.buildAssessmentContent) or the Figma demo content.
  const real = home?.live ? home.assessment : null;
  const waiting = Boolean(home?.live && !home.assessment);
  const sum = real?.summary ?? ASSESSMENT_SUMMARY;
  useEffect(() => {
    log('mount', { stateKey: home?.stateKey, tab: home?.tab });
  }, [home?.stateKey, home?.tab]);

  const selectTab = (id) => {
    log('tab ->', id);
    home.update({ tab: id === 'home' ? null : id });
  };

  return (
    <>
      <TalentHomeHero home={home} />
      <HomeTabs active="assessment" tabs={home.tabs} onSelect={selectTab} />
      {waiting ? <PlainCard title="MyAssessment" body="Loading your results…" /> : null}
      {waiting ? null : (
        <section
          aria-label={sum.title}
          className={classNames(
            'flex flex-col items-start gap-[clamp(12px,1.6vw,22px)] rounded-[22px] bg-gradient-to-r from-[#ebf1ec] to-[#f4fbe8] px-[clamp(14px,1.75vw,24px)] py-[20px] lg:flex-row lg:items-center',
            LIFT
          )}
        >
          <div className="flex shrink-0 items-center gap-[12px] text-[#387440] lg:flex-col lg:gap-0">
            <span
              className={classNames(
                'text-[44px] font-semibold leading-[1.1] lg:w-full lg:text-center',
                DISPLAY
              )}
            >
              {sum.done}
            </span>
            <span className="whitespace-nowrap text-[12px] font-bold">{sum.doneLabel}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <p className="text-[17px] font-semibold text-[#1c2a21]">{sum.title}</p>
            <p className="text-[14px] text-[#595959]">{sum.body}</p>
            <div className="flex flex-wrap items-center gap-[6px] playful:gap-[6px]">
              {sum.chips.map((c) => (
                <CheckChip key={c}>{c}</CheckChip>
              ))}
              {sum.pending ? (
                <span className="inline-flex h-[32px] items-center whitespace-nowrap rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] font-semibold text-[#595959]">
                  {sum.pending}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            variant="tertiary-subtle"
            size="lg"
            className="w-full lg:w-auto"
            onClick={() => log('preview recruiter view')}
          >
            {sum.cta}
          </Button>
        </section>
      )}
      <div className="grid items-start gap-[16px] lg:grid-cols-[minmax(0,912fr)_minmax(0,448fr)]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          {real && !real.personality ? (
            <PlainCard
              title="Personality"
              body="No result yet. Take the personality quiz with Career Buddy to see your strongest traits and the careers that suit them."
            />
          ) : waiting ? null : (
            <PersonalityCard data={real?.personality ?? undefined} />
          )}
          {waiting ? null : <SkillsEvidenceCard data={real?.skillsEvidence ?? undefined} />}
        </div>
        <div className="flex min-w-0 flex-col gap-[16px]">
          {waiting || (real && !real.next) ? null : (
            <NextAssessmentCard data={real?.next ?? undefined} />
          )}
          <LegendCard />
          {waiting ? null : <SkillsLabCard data={real?.lab ?? undefined} />}
        </div>
      </div>
    </>
  );
};

export default MyAssessmentTab;
