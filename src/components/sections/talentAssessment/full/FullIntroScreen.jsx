import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { LabArrowRightIcon } from '../../talentSkillsLab/LabPlayIcons.jsx';
import { useLabText } from '../../talentSkillsLab/labFormat.js';
import { FOCUS_RING, INK_CARD } from '../../talentSkillsLab/labPlayStyles.js';
import {
  FullArrowLeftIcon,
  FullBookIcon,
  FullFunctionIcon,
  FullRefreshIcon,
  FullTimeClockIcon,
  FullWifiIcon,
} from './FullIcons.jsx';

const log = debug('FullIntroScreen');

/*
 * FullIntroScreen — MA-04 "TypeScript assessment" intro (Playful 7968:9939 / Focused 8110:31895), the body that sits in the
 * talent shell (AssessmentFrame). Main column 1329 wide at 1728: left 893 (overview card · "Before you start" card) + 16 gap +
 * right 420 (Start card · "What changes on your card"). Below xl it stacks with the Start card first.
 * Focused = hairline cards + small 22px grey / amber / green chips + green pill sticker; Playful = hard-shadow Start card,
 * 32px outline chips (dark for the "after" chip) and the yellow tilted "Biggest boost" sticker.
 *
 * Props: flow (FULL_ASSESSMENT_*), startTo (href of "Start assessment"), practiseTo (href of "Practise first").
 */
const RULE_ICONS = {
  clock: FullTimeClockIcon,
  wifi: FullWifiIcon,
  book: FullBookIcon,
  refresh: FullRefreshIcon,
};

const CARD =
  'rounded-[20px] border border-solid border-[rgba(28,42,33,0.1)] bg-white shadow-[0_6px_20px_rgba(28,42,33,0.06)]';
const H3 = 'm-0 font-sans text-[16px] leading-[19px] font-semibold text-[#1c2a21]';

/* Count / state chip: Focused 22px quiet pill, Playful 32px outline pill (generated text so labels never wrap on phones). */
const Chip = ({ children, tone = 'plain', label }) => (
  <span
    aria-label={label}
    className={classNames(
      'inline-flex shrink-0 items-center justify-center rounded-full font-sans font-semibold whitespace-nowrap',
      'px-[10px] py-[4px] text-[12px] leading-[14px] playful:h-[32px] playful:border playful:border-solid playful:px-[14px] playful:py-0 playful:text-[13px] playful:leading-[16px]',
      tone === 'plain' && 'bg-[#f8f8f4] text-[#595959] playful:border-[#e1eae2] playful:bg-white',
      tone === 'now' &&
        'bg-[#faf4e8] text-[#463409] playful:border-[#e1eae2] playful:bg-white playful:text-[#595959]',
      tone === 'after' && 'bg-[#387440] text-white playful:border-[#1c2a21] playful:bg-[#1c2a21]'
    )}
  >
    {children}
  </span>
);

const Stat = ({ value, label }) => (
  <div className="flex min-w-0 flex-col gap-[2px] rounded-[14px] border border-solid border-[rgba(28,42,33,0.12)] bg-white p-[16px]">
    <span className="font-sans text-[24px] leading-[29px] font-semibold tracking-[-0.01em] text-[#1c2a21] playful:font-heading">
      {value}
    </span>
    <span className="font-sans text-[13px] leading-[16px] font-medium text-[#595959] max-lg:text-[14px]">
      {label}
    </span>
  </div>
);

const Topic = ({ topic }) => (
  <li className="flex items-center gap-[14px] border-0 border-t border-solid border-[rgba(28,42,33,0.08)] py-[10px]">
    <span
      aria-hidden="true"
      className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#ebf1ec] text-[#387440]"
    >
      <FullFunctionIcon className="size-[18px]" />
    </span>
    <span className="flex min-w-0 flex-1 flex-col gap-[2px] font-sans">
      <span className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">{topic.label}</span>
      <span className="text-[13px] leading-[16px] font-normal text-[#595959] max-lg:text-[14px] max-lg:leading-[18px]">
        {topic.blurb}
      </span>
    </span>
    <Chip>{`${topic.count} questions`}</Chip>
  </li>
);

const Rule = ({ rule }) => {
  const Icon = RULE_ICONS[rule.icon];
  return (
    <li className="flex items-center gap-[12px]">
      <span
        aria-hidden="true"
        className="inline-flex size-[36px] shrink-0 items-center justify-center rounded-[11px] bg-[#f8f8f4] text-[#1c2a21]"
      >
        <Icon className="size-[18px]" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-[2px] font-sans">
        <span className="text-[14.5px] leading-[17px] font-semibold text-[#1c2a21]">
          {rule.title}
        </span>
        <span className="text-[13px] leading-[19px] font-normal text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
          {rule.text}
        </span>
      </span>
    </li>
  );
};

const FullIntroScreen = ({ flow, startTo, practiseTo = '/skills-lab' }) => {
  const navigate = useNavigate();
  const { t } = useLabText();
  const { intro } = flow;
  log('render', { startTo });
  return (
    <div className="mx-auto flex w-full max-w-[1433px] flex-col gap-[24px] pt-[clamp(16px,1.85vw,32px)] pr-[clamp(12px,3.24vw,56px)] pb-[clamp(24px,3vw,56px)] pl-[clamp(12px,2.3vw,40px)]">
      <Link
        to="/my-assessment"
        className={classNames(
          'relative inline-flex h-[17px] w-fit after:absolute after:-inset-y-[4px] after:inset-x-0 after:content-["_"] items-center gap-[6px] font-sans text-[14px] leading-[17px] font-semibold text-[#387440] no-underline hover:underline',
          FOCUS_RING
        )}
      >
        <FullArrowLeftIcon className="size-[16px]" />
        {intro.back}
      </Link>

      <header className="flex flex-col gap-[3px]">
        <div className="flex flex-wrap items-center gap-x-[12px] gap-y-[6px]">
          <h1 className="m-0 font-sans text-[clamp(26px,1.97vw,34px)] leading-[1.2] font-semibold tracking-[-0.02em] text-[#1c2a21] playful:font-heading">
            {intro.title}
          </h1>
          {intro.sticker ? (
            <span className="inline-flex items-center rounded-full bg-[#ebf1ec] px-[11px] py-[5px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b] playful:rotate-[6deg] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21]">
              {intro.sticker}
            </span>
          ) : null}
        </div>
        <p className="m-0 font-sans text-[16px] leading-[24px] font-normal tracking-[0.2px] text-[#595959]">
          {intro.lede}
        </p>
      </header>

      <div className="flex flex-col gap-[16px] xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-col gap-[16px] max-xl:order-2 xl:flex-1">
          <section
            aria-label="Overview"
            className={classNames(CARD, 'flex flex-col gap-[16px] p-[clamp(16px,1.4vw,24px)]')}
          >
            <div className="grid grid-cols-2 gap-[12px] md:grid-cols-4">
              {intro.stats.map((stat) => (
                <Stat key={stat.label} value={t(stat.value)} label={stat.label} />
              ))}
            </div>
            <h2 className={H3}>{intro.coversTitle}</h2>
            <ul className="m-0 flex list-none flex-col gap-[16px] p-0">
              {intro.topics.map((topic) => (
                <Topic key={topic.id} topic={topic} />
              ))}
            </ul>
          </section>
          <section
            aria-label={intro.rulesTitle}
            className={classNames(CARD, 'flex flex-col gap-[12px] p-[clamp(16px,1.4vw,24px)]')}
          >
            <h2 className={H3}>{intro.rulesTitle}</h2>
            <ul className="m-0 flex list-none flex-col gap-[12px] p-0">
              {intro.rules.map((rule) => (
                <Rule key={rule.title} rule={rule} />
              ))}
            </ul>
          </section>
        </div>

        <div className="flex min-w-0 flex-col gap-[16px] max-xl:order-1 xl:w-[420px] xl:shrink-0">
          <section
            aria-label={intro.start.title}
            className={classNames(
              'flex flex-col gap-[14px] rounded-[20px] bg-white p-[clamp(16px,1.4vw,24px)]',
              INK_CARD
            )}
          >
            <h2 className="m-0 font-sans text-[18px] leading-[21px] font-semibold text-[#1c2a21]">
              {intro.start.title}
            </h2>
            <p className="m-0 font-sans text-[13.5px] leading-[20px] font-normal text-[#595959] max-lg:text-[14px]">
              {intro.start.body}
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(startTo)}
              rightIcon={<LabArrowRightIcon className="size-[20px]" />}
              className="w-full"
            >
              {intro.start.primary}
            </Button>
            <Button
              variant="tertiary"
              size="lg"
              onClick={() => navigate(practiseTo)}
              className="w-full"
            >
              {intro.start.secondary}
            </Button>
          </section>
          <section
            aria-label={intro.card.title}
            className={classNames(CARD, 'flex flex-col gap-[12px] p-[clamp(16px,1.4vw,24px)]')}
          >
            <h2 className={H3}>{intro.card.title}</h2>
            <div className="flex items-center justify-between gap-[10px] py-[6px] font-sans text-[14px] leading-[17px] font-medium text-[#595959]">
              <span>{intro.card.nowLabel}</span>
              <Chip tone="now">{intro.card.now}</Chip>
            </div>
            <div className="flex items-center justify-between gap-[10px] py-[6px] font-sans text-[14px] leading-[17px] font-medium text-[#595959]">
              <span>{intro.card.afterLabel}</span>
              <Chip tone="after">{intro.card.after}</Chip>
            </div>
            <p className="m-0 font-sans text-[13px] leading-[19px] font-normal text-[#595959] max-lg:text-[14px] max-lg:leading-[20px]">
              {intro.card.note}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FullIntroScreen;
