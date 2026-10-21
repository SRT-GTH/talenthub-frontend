import { useNavigate } from 'react-router-dom';
import careerBuddyMark from '../../../../assets/engagement-v2/journey/career-buddy-mark.webp';
import careerBuddyMascot from '../../../../assets/engagement-v2/journey/career-buddy-mascot.webp';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { COPY, STAGE_COPY } from './journeyData.js';
import {
  ArrowRightIcon,
  CheckCircleFillIcon,
  DiamondIcon,
  EyeIcon,
  RepeatIcon,
  TrophyIcon,
  TrophyMonoIcon,
} from './JourneyIcons.jsx';
import { milestoneBar } from './journeyModel.js';
import { stageIconFor } from './stageIcons.js';

const log = debug('JourneyRail');

const CARD =
  'flex flex-col rounded-[24px] border border-[rgba(28,42,33,0.1)] bg-white p-[24px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] max-sm:p-[16px]';

const UpNext = ({ model }) => {
  const navigate = useNavigate();
  const { current, progress } = model;
  if (!current) {
    const c = COPY.allDone;
    return (
      <section className={classNames(CARD, 'gap-[16px]')} aria-label="Up next">
        <div className="flex items-center gap-[8px]">
          <span className="rounded-full border border-[rgba(28,42,33,0.1)] bg-[#faf4e8] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] tracking-[1px] max-lg:text-[12px] text-[#785910] playful:border-[rgba(28,42,33,0.35)]">
            {c.tag}
          </span>
        </div>
        <div className="flex items-center gap-[14px]">
          <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#faf4e8] text-[#785910]">
            <CheckCircleFillIcon className="size-[26px]" />
          </span>
          <span className="flex min-w-0 flex-col gap-[2px] font-sans">
            <span className="text-[32px] font-semibold leading-[38px] text-[#1c2a21] playful:font-heading max-sm:text-[26px] max-sm:leading-[30px]">
              {c.title}
            </span>
            <span className="text-[14px] font-medium leading-[17px] text-[#785910]">{c.meta}</span>
          </span>
        </div>
        <p className="m-0 font-sans text-[15px] font-normal leading-[22px] text-[#595959]">
          {c.text}
        </p>
        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRightIcon className="size-[20px]" />}
          onClick={() => {
            log('all done -> dashboard');
            navigate('/home');
          }}
          className="w-full"
        >
          {c.action}
        </Button>
      </section>
    );
  }

  const Glyph = stageIconFor(current.id);
  const copy = STAGE_COPY[current.id];
  const inProgress = Boolean(progress);
  return (
    <section className={classNames(CARD, 'gap-[16px]')} aria-label="Up next">
      <div className="flex items-center gap-[8px]">
        <span
          className={classNames(
            'rounded-full border border-[rgba(28,42,33,0.1)] px-[10px] py-[4px] font-sans text-[11px] font-bold leading-[13px] tracking-[1px] max-lg:text-[12px] max-lg:text-[12px] playful:border-[rgba(28,42,33,0.35)]',
            inProgress ? 'bg-[#faf4e8] text-[#785910]' : 'bg-[#ebf1ec] text-[#387440]'
          )}
        >
          {inProgress ? 'IN PROGRESS' : 'UP NEXT'}
        </span>
        <span className="font-sans text-[13px] font-medium leading-[16px] text-[#595959]">
          Stage {current.n} of {model.total}
        </span>
      </div>
      <div className="flex items-center gap-[14px]">
        <span className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-[#ebf1ec] text-[#387440]">
          <Glyph className="size-[26px]" />
        </span>
        <span className="flex min-w-0 flex-col gap-[2px] font-sans">
          <span className="text-[32px] font-semibold leading-[38px] text-[#1c2a21] playful:font-heading max-sm:text-[26px] max-sm:leading-[30px]">
            {current.label}
          </span>
          <span className="text-[14px] font-medium leading-[17px] text-[#785910]">
            {inProgress
              ? `${progress.picked} of ${progress.of} picked · ~${progress.minutesLeft} min left`
              : `Not started · ~${copy.eta ?? ''} min`}
          </span>
        </span>
      </div>
      {copy.upNext ? (
        <p className="m-0 font-sans text-[15px] font-normal leading-[22px] text-[#595959]">
          {copy.upNext}
        </p>
      ) : null}
      {inProgress ? (
        <span className="h-[8px] w-full rounded-[4px] bg-[#eeeeea]" aria-hidden="true">
          <span
            className="block h-full rounded-[4px] bg-[#387440]"
            style={{ width: `${(progress.picked / progress.of) * 100}%` }}
          />
        </span>
      ) : null}
      <Button
        variant="primary"
        size="md"
        rightIcon={<ArrowRightIcon className="size-[20px]" />}
        onClick={() => {
          log('start/continue', current.id);
          navigate(current.route);
        }}
        className="w-full !h-[52px] !py-0"
      >
        {inProgress ? 'Continue' : 'Start'} {current.label}
      </Button>
      <span className="flex items-center gap-[6px] font-sans text-[14px] font-semibold leading-[17px] text-[#387440]">
        <RepeatIcon className="size-[16px]" />
        {COPY.otherStage}
      </span>
    </section>
  );
};

const CareerBuddyCard = ({ done }) => {
  const navigate = useNavigate();
  return (
    <section
      aria-label={COPY.buddyName}
      className="relative flex flex-col gap-[14px] overflow-hidden rounded-[24px] border border-transparent p-[18px] pb-[36px] shadow-[0_6px_17px_-8px_rgba(0,0,0,0.05),0_1px_4px_-2px_rgba(0,0,0,0.03)] [background:linear-gradient(135deg,#2a5730_0%,#387440_55%,#498b52_100%)_padding-box,linear-gradient(105deg,#c1d4c4,#c8951a)_border-box]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[71px] top-[-55px] size-[179px] rounded-full opacity-[0.18] blur-[50px] [background:linear-gradient(105deg,#c1d4c4,#c8951a)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[-103px] top-[123px] size-[250px] rounded-full opacity-[0.18] blur-[50px] [background:linear-gradient(105deg,#c1d4c4,#c8951a)]"
      />
      <div className="relative flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[12px]">
          <span className="relative block h-[47px] w-[48px] shrink-0 overflow-hidden">
            <img
              src={careerBuddyMark}
              alt=""
              className="absolute max-w-none"
              style={{ width: '121.6%', height: '115.6%', left: '-9.31%', top: '-12.5%' }}
            />
          </span>
          <span className="flex flex-col gap-[2px] font-sans">
            <span className="text-[16px] font-bold leading-[22px] text-white">
              {COPY.buddyName}
            </span>
            <span className="text-[12px] font-medium leading-[16px] tracking-[0.6px] text-white/80">
              {COPY.buddyTag}
            </span>
          </span>
        </div>
        <span className="relative block size-[56px] shrink-0 overflow-hidden rounded-[16px] border border-white/15 bg-white/[0.08] shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
          <img
            src={careerBuddyMascot}
            alt=""
            className="absolute max-w-none"
            style={{ width: '100%', height: '150.6%', left: 0, top: '-12.4%' }}
          />
        </span>
      </div>
      <div className="relative rounded-[18px] border border-white/50 bg-white/90 px-[14px] py-[11px] shadow-[0_5px_13px_-10px_rgba(0,0,0,0.04),0_1px_4px_-2px_rgba(0,0,0,0.03)]">
        <span
          aria-hidden="true"
          className="absolute -bottom-[7px] left-[-1px] size-[25px] rotate-45 rounded-[9px] bg-white/90"
          style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
        />
        <p className="relative m-0 font-sans text-[13px] font-semibold leading-[18px] text-[#111827]">
          {done ? COPY.buddyMsgDone : COPY.buddyMsg}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          log('chat with career buddy');
          navigate('/profile/filling/career-buddy');
        }}
        className="relative flex h-[48px] w-full cursor-pointer items-center justify-center rounded-[14px] border-2 border-[rgba(28,42,33,0.3)] bg-white font-sans text-[14px] font-bold leading-[24px] tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#c8951a]"
      >
        {COPY.buddyBtn}
      </button>
    </section>
  );
};

const MS_TILE_ICON = { 1: EyeIcon, 2: TrophyIcon, 3: DiamondIcon };

const Milestones = ({ model, hoverFrame }) => {
  const { done } = model;
  const allDone = !model.next;
  return (
    <section className={classNames(CARD, 'gap-[14px]')} aria-label={COPY.milestonesTitle}>
      <div className="flex items-center gap-[8px] font-sans">
        <h2 className="m-0 text-[20px] font-semibold leading-[24px] text-[#1c2a21]">
          {COPY.milestonesTitle}
        </h2>
        <span className="text-[13px] font-normal leading-[16px] text-[#595959]">
          {allDone ? COPY.milestonesSubDone : COPY.milestonesSub}
        </span>
      </div>
      {model.nodes
        .filter((n) => n.kind === 'milestone')
        .map((n) => {
          const m = n.milestone;
          const on = n.status === 'unlocked';
          const Glyph = on && m.n === 2 ? TrophyMonoIcon : MS_TILE_ICON[m.n];
          return (
            <div
              key={m.id}
              className={classNames(
                'flex items-center gap-[14px] rounded-[16px] border py-[12px] pl-[12px] pr-[14px]',
                on ? 'border-[#eedeb8] bg-[#faf4e8]' : 'border-[#e7e7e7] bg-[#fafaf7]'
              )}
            >
              <span
                className={classNames(
                  'flex size-[44px] shrink-0 items-center justify-center rounded-[14px] border',
                  on
                    ? 'border-[#c8951a] bg-[#c8951a] text-white'
                    : 'border-[#eedeb8] bg-white text-[#785910]'
                )}
              >
                <Glyph className="size-[22px]" />
              </span>
              <span
                className={classNames(
                  'flex min-w-0 flex-1 flex-col font-sans',
                  hoverFrame ? 'gap-[8px]' : 'gap-[3px]'
                )}
              >
                <span className="flex items-center gap-[8px]">
                  <span className="text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                    {m.label}
                  </span>
                  <span
                    className={classNames(
                      'text-[12px] font-semibold leading-[14px]',
                      on ? 'text-[#387440]' : hoverFrame ? 'text-[#c8951a]' : 'text-[#785910]'
                    )}
                  >
                    {on ? 'Unlocked' : `${m.at - done} stages to go`}
                  </span>
                </span>
                <span className="text-[13px] font-normal leading-[16px] text-[#595959]">
                  {m.blurb}
                </span>
                <span className="h-[5px] w-full rounded-[3px] bg-[#eeeeea]" aria-hidden="true">
                  <span
                    className={classNames(
                      'block h-full rounded-[3px]',
                      on ? 'bg-[#c8951a]' : 'bg-[#387440]'
                    )}
                    style={{ width: `${milestoneBar(m, done)}%` }}
                  />
                </span>
              </span>
            </div>
          );
        })}
    </section>
  );
};

const Reassurance = ({ hoverFrame }) => {
  const navigate = useNavigate();
  return (
    <div
      className={classNames(
        'flex flex-col px-[8px] pt-[4px] font-sans',
        hoverFrame ? 'gap-[16px]' : 'gap-[12px]'
      )}
    >
      <ul className="m-0 flex list-none flex-wrap gap-x-[16px] gap-y-[6px] p-0">
        {COPY.checks.map((c) => (
          <li
            key={c}
            className="flex items-center gap-[5px] text-[13px] font-medium leading-[16px] text-[#595959]"
          >
            <CheckCircleFillIcon className="size-[15px] text-[#387440]" />
            {c}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => {
          log('finish later -> dashboard');
          navigate('/home');
        }}
        className="min-h-[24px] w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]"
      >
        {COPY.finishLater}
      </button>
    </div>
  );
};

/* Right rail of the journey hub: Up next · Career Buddy · Milestones · reassurance. */
const JourneyRail = ({ model, hoverFrame }) => (
  <div className="flex w-full flex-col gap-[20px]">
    <UpNext model={model} />
    <CareerBuddyCard done={!model.current} />
    <Milestones model={model} hoverFrame={hoverFrame} />
    <Reassurance hoverFrame={hoverFrame} />
  </div>
);

export default JourneyRail;
