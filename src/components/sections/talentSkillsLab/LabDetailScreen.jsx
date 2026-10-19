import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { HEADING, HubButton, HubChip, HubSticker, HubToggle } from './HubParts.jsx';
import { LAB_ICONS } from './hubShared.js';
import {
  LabArrowLeftIcon,
  LabArrowRightIcon,
  LabArrowRightSmIcon,
  LabBookIcon,
  LabFlagSmIcon,
  LabFunctionIcon,
  LabListBulletIcon,
  LabLockIcon,
  LabRepeatIcon,
  LabStarSmIcon,
  LabStopwatchIcon,
  LabVerifiedCheckIcon,
} from './LabPlayIcons.jsx';
import { useLabText } from './labFormat.js';
import { FOCUS_RING, INK_CARD } from './labPlayStyles.js';

const log = debug('LabDetailScreen');

/*
 * LabDetailScreen — the lab details page body, data driven per lab (Figma SL-02 Python 7834:8424 / 8110:488227,
 * SL-02b Public speaking 7852:229677 / 8110:488601, SL-02c Data analysis 7852:230161 / 8110:488964). Rendered inside
 * SkillsLabFrame by pages/talentSkillsLab/LabDetailPage.jsx.
 *
 * Props: detail — the `GET /skills-lab/labs/:id` payload (skillsLabData.js LAB_DETAILS / getLabDetail), see its header for
 * the shape. `detail.start.kind` picks the right-hand card: resume | ready | cooldown.
 * Layout (1728 frame): main column 1329 = left 965 (overview · recruiters · attempts) + 24 gap + right 340 (start card ·
 * warm-up · accessibility). Below xl it stacks, with the start card first. Focused is the default look; Playful is
 * `playful:` variants (hard shadows, stickers, Bricolage headings, "XP" instead of "pts").
 */
const FACT_ICONS = {
  'list-bullet': LabListBulletIcon,
  stopwatch: LabStopwatchIcon,
  flag: LabFlagSmIcon,
  star: LabStarSmIcon,
  repeat: LabRepeatIcon,
};
const ART_ICONS = { ...LAB_ICONS, function: LabFunctionIcon };

const H2 = classNames(HEADING, 'text-[17px] leading-[21px] tracking-[-0.01em] max-lg:text-[18px]');

const Card = ({ label, className, children }) => (
  <section
    aria-label={label}
    className={classNames(
      'flex min-w-0 flex-col rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white p-[clamp(16px,1.62vw,28px)]',
      className
    )}
  >
    {children}
  </section>
);

const TextLink = ({ to, children, withArrow }) => (
  <Link
    to={to}
    className={classNames(
      'inline-flex min-h-[24px] items-center gap-[4px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] underline',
      FOCUS_RING
    )}
  >
    {children}
    {withArrow ? <LabArrowRightSmIcon className="size-[16px]" /> : null}
  </Link>
);

const Overview = ({ detail, t }) => {
  const Art = ART_ICONS[detail.icon];
  return (
    <Card label="Overview" className="gap-[20px]">
      <div className="flex flex-wrap items-center gap-[20px]">
        <span
          aria-hidden="true"
          className="inline-flex size-[96px] shrink-0 items-center justify-center rounded-[20px] bg-[#387440] text-white max-sm:size-[72px]"
        >
          {Art ? <Art className="size-[44px] max-sm:size-[34px]" /> : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[8px] max-sm:min-w-[200px]">
          <h2
            className={classNames(
              HEADING,
              'text-[clamp(18px,1.27vw,22px)] leading-[1.27] tracking-[-0.01em] max-lg:text-[20px]'
            )}
          >
            {detail.headline}
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-[8px] p-0">
            {detail.facts.map((fact) => {
              const Icon = FACT_ICONS[fact.icon];
              return (
                <li key={fact.text}>
                  <HubChip icon={Icon ? <Icon className="size-[14px] text-[#387440]" /> : null}>
                    {t(fact.text)}
                  </HubChip>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {detail.covers.length ? (
        <>
          <hr className="m-0 h-px border-0 bg-[#e7e7e7]" />
          <h3 className={H2}>What it covers</h3>
          <ul className="m-0 -mt-[4px] flex list-none flex-wrap gap-[8px] p-0">
            {detail.covers.map((topic) => (
              <li key={topic}>
                <HubChip tone="soft">{topic}</HubChip>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <hr className="m-0 h-px border-0 bg-[#e7e7e7]" />
      <h3 className={H2}>How it works</h3>
      <ol className="m-0 -mt-[4px] grid list-none gap-[16px] p-0 [grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))]">
        {detail.steps.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col gap-[8px] rounded-[16px] bg-[#f8f8f4] p-[16px]"
          >
            <span
              aria-hidden="true"
              className="inline-flex size-[28px] items-center justify-center rounded-full border border-solid border-[rgba(28,42,33,0.12)] bg-[#ffd86b] font-sans text-[13px] leading-[16px] font-bold text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]"
            >
              {i + 1}
            </span>
            <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {step.title}
            </p>
            <p className="m-0 font-sans text-[13px] leading-[19px] font-normal text-[#595959] max-lg:text-[14px]">
              {t(step.text)}
            </p>
          </li>
        ))}
      </ol>
    </Card>
  );
};

const Recruiters = ({ detail }) => {
  const Icon = ART_ICONS[detail.icon];
  return (
    <Card label="What recruiters see" className="gap-[16px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <h2 className={H2}>What recruiters see when you pass</h2>
        <span className="min-w-0 flex-1" aria-hidden="true" />
        <HubChip onClick={() => log('preview recruiter view')}>Preview</HubChip>
      </div>
      <div className="flex flex-wrap items-center gap-[14px] rounded-[16px] bg-[#f8f8f4] p-[16px]">
        <span
          aria-hidden="true"
          className="inline-flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#387440] text-[#1c2a21] playful:bg-[#ebf1ec]"
        >
          {Icon ? <Icon className="size-[19px]" /> : null}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-[2px] font-sans">
          <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
            {detail.recruiters.skill}
          </span>
          <span className="text-[13px] leading-[16px] font-normal text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
            {detail.recruiters.line}
          </span>
        </div>
        <HubChip
          tone="statFocused"
          icon={<LabVerifiedCheckIcon className="size-[14px] text-[#272e35]" />}
        >
          Verified
        </HubChip>
      </div>
      <p className="m-0 font-sans text-[14px] leading-[20px] font-normal text-[#595959]">
        Only passes appear. Attempts that do not pass stay private to you.
      </p>
    </Card>
  );
};

const ROW_COLS =
  'sm:grid sm:grid-cols-[minmax(0,160px)_minmax(0,220px)_minmax(0,120px)_minmax(0,1fr)] sm:gap-x-[16px]';

const Attempts = ({ detail }) => (
  <Card label="Your attempts" className="gap-[12px]">
    <h2 className={H2}>Your attempts</h2>
    <div role="table" aria-label="Your attempts" className="flex flex-col">
      <div role="row" className={classNames('max-sm:sr-only', ROW_COLS, 'py-[8px]')}>
        {['Date', 'Result', 'Score', 'Status'].map((h) => (
          <span
            key={h}
            role="columnheader"
            className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]"
          >
            {h}
          </span>
        ))}
      </div>
      <hr className="m-0 mb-[12px] h-px border-0 bg-[#e7e7e7] max-sm:hidden" />
      {detail.attempts.length === 0 ? (
        <p className="m-0 font-sans text-[14px] leading-[17px] font-normal text-[#595959]">
          {detail.attemptsEmpty}
        </p>
      ) : (
        detail.attempts.map((row) => (
          <div
            role="row"
            key={row.date}
            className={classNames(
              'flex flex-wrap items-center gap-x-[16px] gap-y-[4px] py-[10px] font-sans text-[14px] leading-[17px] text-[#1c2a21]',
              ROW_COLS
            )}
          >
            <span role="cell" className="font-medium">
              {row.date}
            </span>
            <span role="cell">{row.result}</span>
            <span role="cell" className="font-semibold">
              {row.score}
            </span>
            <span role="cell">
              {row.status === 'Resume' ? (
                <HubChip
                  onClick={() => log('attempt resume')}
                  aria-label={`Resume ${detail.title}`}
                >
                  {row.status}
                </HubChip>
              ) : (
                <HubChip>{row.status}</HubChip>
              )}
            </span>
          </div>
        ))
      )}
    </div>
  </Card>
);

const StartCard = ({ detail, t }) => {
  const { start } = detail;
  const play = `/skills-lab/lab/${detail.id}/play`;
  return (
    <section
      aria-label="Start"
      className={classNames(
        'flex flex-col gap-[14px] rounded-[24px] bg-white p-[24px] max-sm:p-[16px]',
        INK_CARD
      )}
    >
      <p className="m-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.06em] text-[#387440] uppercase max-lg:text-[12px]">
        {start.eyebrow}
      </p>
      <p className={classNames(HEADING, 'text-[24px] leading-[29px] tracking-[-0.01em]')}>
        {start.title}
      </p>
      <p className="m-0 font-sans text-[14px] leading-[20px] font-normal text-[#595959]">
        {start.body}
      </p>
      {start.kind === 'cooldown' ? (
        <HubButton
          tone="disabled"
          disabled
          className="w-full"
          leftIcon={<LabLockIcon className="text-[#387440]" />}
        >
          {start.primary}
        </HubButton>
      ) : (
        <HubButton
          tone="primary"
          size="lg"
          to={play}
          className="w-full"
          rightIcon={<LabArrowRightIcon />}
        >
          {start.primary}
        </HubButton>
      )}
      {start.secondary ? (
        <HubButton
          tone="secondary"
          size="lg"
          to={start.kind === 'cooldown' ? '/profile' : '?modal=restart'}
          className="w-full"
        >
          {t(start.secondary)}
        </HubButton>
      ) : null}
    </section>
  );
};

const Warmup = ({ warmup }) => (
  <section
    aria-label={warmup.title}
    className="flex flex-col gap-[12px] rounded-[20px] bg-[#fbf4e0] p-[22px]"
  >
    <div className="flex items-center gap-[10px]">
      <span
        aria-hidden="true"
        className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#ffd86b] text-[#1c2a21]"
      >
        <LabBookIcon className="size-[17px]" />
      </span>
      <h2 className={H2}>{warmup.title}</h2>
    </div>
    <p className="m-0 font-sans text-[14px] leading-[20px] font-normal text-[#1c2a21]">
      {warmup.body}
    </p>
    <TextLink to="/learning" withArrow>
      {warmup.link}
    </TextLink>
  </section>
);

const Accessibility = ({ accessibility }) => {
  const [toggles, setToggles] = useState(accessibility.toggles);
  return (
    <Card label={accessibility.title} className="gap-[12px] p-[22px]">
      <h2 className={H2}>{accessibility.title}</h2>
      <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
        {toggles.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-[10px]">
            <span className="font-sans text-[14px] leading-[17px] font-medium text-[#1c2a21]">
              {row.label}
            </span>
            <HubToggle
              on={row.on}
              label={row.label}
              onChange={(on) => {
                log('toggle', row.id, on);
                setToggles((prev) => prev.map((r) => (r.id === row.id ? { ...r, on } : r)));
              }}
            />
          </li>
        ))}
      </ul>
      <TextLink to="/profile">{accessibility.link}</TextLink>
    </Card>
  );
};

const LabDetailScreen = ({ detail }) => {
  const { t } = useLabText();
  log('render', { lab: detail.id, start: detail.start.kind });
  return (
    <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] pl-[clamp(12px,2.3vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
      <div className="flex flex-col gap-[8px]">
        <Link
          to="/skills-lab"
          className={classNames(
            'inline-flex min-h-[24px] w-fit items-center gap-[6px] font-sans text-[15px] leading-[18px] font-semibold text-[#387440] no-underline',
            FOCUS_RING
          )}
        >
          <LabArrowLeftIcon className="size-[18px]" />
          All labs
        </Link>
        <div className="flex flex-wrap items-center gap-[12px]">
          <h1
            className={classNames(
              HEADING,
              'text-[clamp(26px,1.97vw,34px)] leading-[1.2] tracking-[-0.02em]'
            )}
          >
            {detail.title}
          </h1>
          <HubSticker>{detail.sticker}</HubSticker>
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#595959] max-sm:text-[14px] max-sm:leading-[20px]">
          {detail.breadcrumb}
        </p>
      </div>
      <div className="grid items-start gap-[24px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-[28px] max-xl:order-2">
          <Overview detail={detail} t={t} />
          <Recruiters detail={detail} />
          <Attempts detail={detail} />
        </div>
        <div className="flex min-w-0 flex-col gap-[16px] max-xl:order-1">
          <StartCard detail={detail} t={t} />
          <Warmup warmup={detail.warmup} />
          <Accessibility accessibility={detail.accessibility} />
        </div>
      </div>
    </div>
  );
};

export default LabDetailScreen;
