import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../ui/Button.jsx';
import { ArrowRightIcon, ShareKofiAvatarIllustration } from '../../../shared/assets.jsx';
import { LANDING_ROUTES } from '../../../../constants/landingRoutes.js';
import { debug } from '../../../../utils/debug.js';
import {
  LpBoltIcon,
  LpBriefcaseIcon,
  LpBulbIcon,
  LpCheckIcon,
  LpDiamondIcon,
  LpEyeIcon,
  LpFolderIcon,
  LpHeartIcon,
  LpMortarboardIcon,
  LpPinIcon,
  LpTargetIcon,
  LpTrophyIcon,
  LpUserIcon,
  LpVideoIcon,
} from './LpAIcons.jsx';
import { DotGrid, RecruiterCard, Sticker } from './LpAParts.jsx';
import {
  HOW_CHIP,
  HOW_HEADING,
  HOW_STEPS,
  HOW_STICKER,
  HOW_SUB,
  JOURNEY_CTA,
  JOURNEY_PING,
  JOURNEY_RAIL,
  JOURNEY_REGIONS,
  JOURNEY_STAGES,
} from './HowItWorksData.js';
import madeForGhanaBg from '../../../../assets/landing/made-for-ghana-background.webp';
import photoFeatures from '../../../../assets/landing/features-preview-photo.webp';
import photoHow from '../../../../assets/landing/page-hero-how-it-works.webp';
import photoOpportunities from '../../../../assets/landing/page-hero-opportunities.webp';

const log = debug('HowItWorksSection');

/*
 * HowItWorksSection — landing S3 · How it works. Figma: desktop 7797:9190 (1728x1468), tablet 7815:265767 (834x1406), mobile 7815:273584 (430x1939).
 *  - Head: chip, Bricolage heading ("three moves." green), sub, rotated "20 MIN TOTAL" sticker.
 *  - Three step cards (photo, title, body, "Unlocks" chip, rotated number sticker): 3 columns on desktop, 2 + 1 on tablet, stacked on mobile.
 *  - Below the cards: desktop = the 1536x560 "Road across Ghana" journey panel (scaled with `--u`, drawn in em units); tablet/mobile = the
 *    "Journey rail" of nine stage chips.
 * ⚠️ ASSUMPTIONS: road path = smooth S-curve through the stage circles (path data is not available offline); icons redrawn (LpAIcons);
 *    the road/panel scale between 1280 and 1728 follows `--u`, the Figma desktop design is only drawn at 1728.
 */

const STEP_IMAGES = {
  'features-preview-photo': photoFeatures,
  'page-hero-how-it-works': photoHow,
  'page-hero-opportunities': photoOpportunities,
};

const CARD_SHADOW = 'shadow-[5px_5px_0_rgba(28,42,33,0.2),0_10px_24px_rgba(28,42,33,0.06)]';

/* ─── Journey panel geometry (Figma px inside the 1536x560 panel; rendered in em = scaled px) ─── */
const PITCH = (1421 - 115) / 11; // distance between stage centres
const ROAD_X0 = 115;
const ROAD_Y_TOP = 236;
const ROAD_Y_BOTTOM = 336;
const stageCx = (i) => ROAD_X0 + i * PITCH;
const stageCy = (i) => (i % 2 === 0 ? ROAD_Y_TOP : ROAD_Y_BOTTOM);

/* S-curve through the stage centres (svg space: x from stage 1, y 0..100). */
const roadPath = (from, to) => {
  let d = `M${(from * PITCH).toFixed(1)} ${from % 2 === 0 ? 0 : 100}`;
  for (let i = from; i < to; i += 1) {
    const x0 = i * PITCH;
    const x1 = (i + 1) * PITCH;
    const y0 = i % 2 === 0 ? 0 : 100;
    const y1 = (i + 1) % 2 === 0 ? 0 : 100;
    const mid = (x0 + x1) / 2;
    d += ` C${mid.toFixed(1)} ${y0} ${mid.toFixed(1)} ${y1} ${x1.toFixed(1)} ${y1}`;
  }
  return d;
};
const ROAD_ALL = roadPath(0, 11);
const ROAD_AHEAD = roadPath(1, 11);
const ROAD_DONE = roadPath(0, 1);

const STAGE_ICONS = {
  user: { Icon: LpUserIcon, size: 30 },
  heart: { Icon: LpHeartIcon, size: 34 },
  bulb: { Icon: LpBulbIcon, size: 30 },
  eye: { Icon: LpEyeIcon, size: 40 },
  bolt: { Icon: LpBoltIcon, size: 30 },
  work: { Icon: LpBriefcaseIcon, size: 30 },
  folder: { Icon: LpFolderIcon, size: 30 },
  trophy: { Icon: LpTrophyIcon, size: 39 },
  mortarboard: { Icon: LpMortarboardIcon, size: 30 },
  target: { Icon: LpTargetIcon, size: 30 },
  video: { Icon: LpVideoIcon, size: 30 },
  diamond: { Icon: LpDiamondIcon, size: 40 },
};

const CIRCLE_BY_KIND = {
  done: {
    size: 84,
    cls: 'rounded-full border-[4em] border-white bg-[#387440] text-white',
    icon: '',
  },
  active: {
    size: 96,
    cls: 'rounded-full border-[5em] border-[#387440] bg-white text-[#387440]',
    icon: '',
  },
  todo: {
    size: 84,
    cls: 'rounded-full border-[3em] border-[#d9dcd3] bg-white text-[#575755]',
    icon: '',
  },
  milestone: {
    size: 104,
    cls: 'rounded-[32em] bg-white/90 text-[#785910]',
    icon: '',
  },
};

const SUB_COLOR = { done: '#387440', active: '#785910', todo: '#595959', milestone: '#595959' };

const JourneyStage = ({ stage, index }) => {
  const { size, cls } = CIRCLE_BY_KIND[stage.kind];
  const { Icon, size: iconSize } = STAGE_ICONS[stage.icon];
  const cx = stageCx(index);
  const cy = stageCy(index);
  return (
    <div
      className="absolute"
      style={{
        left: `${cx - 75}em`,
        top: `${cy - size / 2}em`,
        width: '150em',
        height: `${size}em`,
      }}
    >
      {stage.kind === 'active' ? (
        <span
          className="absolute rounded-full bg-[#387440]"
          style={{
            left: `${75 - 62}em`,
            top: `${size / 2 - 62}em`,
            width: '124em',
            height: '124em',
          }}
        />
      ) : null}
      <span
        className={`absolute left-1/2 top-0 box-border flex -translate-x-1/2 items-center justify-center shadow-[0_6em_14em_rgba(20,51,26,0.12)] ${cls}`}
        style={{ width: `${size}em`, height: `${size}em` }}
      >
        <span
          className={`flex items-center justify-center ${stage.id === 's9' ? 'opacity-[0.45]' : ''}`}
          style={{ width: `${iconSize}em`, height: `${iconSize}em` }}
        >
          <Icon className="size-full" />
        </span>
        {stage.kind === 'milestone' ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 104 104"
            fill="none"
            className="pointer-events-none absolute inset-0 size-full"
          >
            <rect
              x="1.5"
              y="1.5"
              width="101"
              height="101"
              rx="30.5"
              stroke="#c8951a"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
          </svg>
        ) : null}
        {stage.kind === 'done' ? (
          <span className="absolute -top-[4em] right-0 flex size-[26em] items-center justify-center rounded-full border-[2em] border-[#387440] bg-white text-[#387440]">
            <LpCheckIcon className="size-[14em]" />
          </span>
        ) : null}
      </span>
      <span
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-[2em] whitespace-nowrap rounded-[12em] bg-white/[0.88] px-[12em] pb-[6em] pt-[5em]"
        style={{ top: `${size + 8}em` }}
      >
        <span
          className="font-sans text-[15em] font-semibold leading-[1.193]"
          style={{ color: stage.kind === 'milestone' ? '#785910' : '#1c2a21' }}
        >
          {stage.label}
        </span>
        <span
          className="font-sans text-[12em] font-medium leading-[1.193]"
          style={{ color: SUB_COLOR[stage.kind] }}
        >
          {stage.sub}
        </span>
      </span>
    </div>
  );
};

const JourneyPanel = () => (
  <div
    className={`relative hidden aspect-[1536/560] w-full overflow-hidden rounded-[28px] border-[1.4px] border-[#1c2a21]/[.32] xl:block ${CARD_SHADOW}`}
    style={{ fontSize: 'var(--u)' }}
  >
    <img src={madeForGhanaBg} alt="" className="absolute inset-0 size-full object-cover" />
    <div className="absolute inset-0 bg-white/[0.16]" />

    {/* Road: white 22px road (75%), dotted "ahead" line, solid green "travelled" line */}
    <svg
      aria-hidden="true"
      viewBox="0 0 1306 100"
      fill="none"
      className="absolute overflow-visible"
      style={{ left: `${ROAD_X0}em`, top: `${ROAD_Y_TOP}em`, width: '1306em', height: '100em' }}
    >
      <path
        d={ROAD_ALL}
        stroke="#fff"
        strokeOpacity="0.75"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={ROAD_AHEAD}
        stroke="#a9b8a6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />
      <path d={ROAD_DONE} stroke="#387440" strokeWidth="6" strokeLinecap="round" />
    </svg>

    {/* Region pills */}
    {JOURNEY_REGIONS.map((r) => (
      <div
        key={r.name}
        className="absolute top-[32em] flex items-center gap-[8em] rounded-full border border-[#e7e7e7] bg-white/[0.92] py-[8em] pl-[10em] pr-[14em]"
        style={{ left: `${r.x}em` }}
      >
        <LpPinIcon className="size-[16em] text-[#387440]" />
        <span className="font-sans text-[12em] font-bold leading-[1.193] tracking-[0.1em] text-[#387440]">
          {r.name}
        </span>
        <span className="whitespace-pre font-sans text-[13em] font-medium leading-[1.193] text-[#1c2a21]">
          {r.note}
        </span>
        <span className="rounded-full bg-[#f1f1ee] px-[8em] py-[2em]">
          <span className="block font-sans text-[12em] font-semibold leading-[1.193] text-[#595959]">
            {r.count}
          </span>
        </span>
      </div>
    ))}

    {JOURNEY_STAGES.map((s, i) => (
      <JourneyStage key={s.id} stage={s} index={i} />
    ))}

    {/* Kofi, standing on the road at stage 2 */}
    <div
      aria-hidden="true"
      className="absolute [&>svg]:size-full"
      style={{ left: '170em', top: '169em', width: '123em', height: '125em' }}
    >
      <ShareKofiAvatarIllustration />
    </div>

    <RecruiterCard text={JOURNEY_PING} className="absolute left-[40em] top-[458em]" />

    <Link
      to={LANDING_ROUTES.getStarted}
      className="absolute bottom-[40em] right-[40em] no-underline"
      onClick={() => log('journey cta: start your road ->', LANDING_ROUTES.getStarted)}
    >
      <Button size="lg" className="py-[14.5px]!" rightIcon={<ArrowRightIcon />} tabIndex={-1}>
        {JOURNEY_CTA}
      </Button>
    </Link>
  </div>
);

/* Tablet / mobile journey rail: nine chips, milestones (3, 6, 9) in gold. */
const JourneyRail = () => (
  <ol
    className={`m-0 flex w-full list-none flex-wrap items-center gap-2 rounded-full border-[1.4px] border-[#1c2a21]/[.32] bg-white px-5 py-[14px] xl:hidden ${CARD_SHADOW}`}
    aria-label="The nine profile stages"
  >
    {JOURNEY_RAIL.map((label, i) => {
      const milestone = (i + 1) % 3 === 0;
      return (
        <li
          key={label}
          className={`flex items-center gap-[6px] rounded-full py-[6px] pl-2 pr-3 ${
            milestone ? 'border border-[#1c2a21] bg-[#ffd86b]' : 'bg-[#f7f8f4]'
          }`}
        >
          <span
            className={`flex size-[22px] shrink-0 items-center justify-center rounded-full font-sans text-[11px] font-bold leading-[13px] ${
              milestone ? 'bg-[#1c2a21] text-white' : 'bg-white text-[#1c2a21]'
            }`}
          >
            {i + 1}
          </span>
          <span className="font-sans text-[13px] font-semibold leading-[15.5px] text-[#1c2a21]">
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);

const HowItWorksSection = () => {
  useEffect(() => {
    log('mount: steps', HOW_STEPS.length, 'stages', JOURNEY_STAGES.length);
  }, []);

  return (
    <section
      id="lp-how"
      aria-labelledby="lp-how-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#fbf6ea_0%,#eef4ea_100%)] [container-type:inline-size] xl:bg-[#fefefe] xl:bg-none"
    >
      <DotGrid color="rgba(200,185,146,0.35)" step={36} className="-z-10" />
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-5 px-5 py-14 [--u:calc(min(100cqw,1728px)/1728)] md:gap-10 md:px-10 md:py-[72px] xl:gap-10 xl:px-24 xl:py-[110px]">
        {/* Head */}
        <div className="relative flex w-full max-w-[964px] flex-col items-center gap-3">
          <span className="inline-flex h-[26px] items-center rounded-full border border-[#c1d4c4] bg-white px-[10px] font-sans text-[13px] font-semibold leading-[15.5px] text-[#387440]">
            {HOW_CHIP}
          </span>
          <h2
            id="lp-how-heading"
            className="m-0 text-center font-heading text-[32px] font-semibold leading-[1.1] text-[#1c2a21] md:text-[40px] xl:text-[54px]"
          >
            {HOW_HEADING[0]}
            <span className="text-[#387440]">{HOW_HEADING[1]}</span>
          </h2>
          <p className="m-0 max-w-[754px] text-center font-sans text-[16px] font-normal leading-[27px] text-[#595959] md:text-[18px] xl:max-w-[680px]">
            {HOW_SUB}
          </p>
          <div
            className="pointer-events-none absolute -top-[26px] right-[5px] -rotate-6 xl:right-[95px] xl:top-[18px]"
            style={{ fontSize: '1px' }}
          >
            <Sticker bg="#ffd86b">{HOW_STICKER}</Sticker>
          </div>
        </div>

        {/* Steps */}
        <ol className="m-0 grid w-full list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 md:gap-7 xl:grid-cols-3">
          {HOW_STEPS.map((step, i) => (
            <li
              key={step.n}
              className={`relative flex flex-col gap-4 rounded-[28px] border-[1.4px] border-[#1c2a21]/[.32] bg-white px-4 pb-6 pt-4 ${CARD_SHADOW} ${
                i === 2 ? 'md:col-span-2 xl:col-span-1' : ''
              }`}
            >
              <div className="absolute -top-4 left-[21px] rotate-6" style={{ fontSize: '1px' }}>
                <Sticker bg={step.accent}>{step.n}</Sticker>
              </div>
              <img
                src={STEP_IMAGES[step.image]}
                alt=""
                className="h-[300px] w-full rounded-[20px] object-cover"
              />
              <div className="flex flex-1 flex-col items-start gap-2 px-2">
                <h3 className="m-0 font-heading text-[22px] font-semibold leading-[27.5px] text-[#1c2a21]">
                  {step.title}
                </h3>
                <p className="m-0 font-sans text-[15px] font-normal leading-[23px] text-[#595959]">
                  {step.body}
                </p>
                <span
                  className="mt-auto inline-flex items-center rounded-full border border-[#1c2a21] px-[10px] py-1"
                  style={{ backgroundColor: step.accent }}
                >
                  <span className="font-sans text-[12px] font-semibold leading-[14.3px] text-[#1c2a21]">
                    {step.chip}
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ol>

        <JourneyPanel />
        <JourneyRail />
      </div>
    </section>
  );
};

export default HowItWorksSection;
