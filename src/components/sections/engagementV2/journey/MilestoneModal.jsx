import { useEffect } from 'react';
import { debug } from '../../../../utils/debug.js';
import Button from '../../../ui/Button.jsx';
import { CONFETTI } from './journeyConfetti.js';
import { MILESTONE_MODALS } from './journeyData.js';
import {
  ArrowRightIcon,
  ChartBarIcon,
  CompanyIcon,
  DiamondIcon,
  GthEyeIcon,
  MessageIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  TrendUpIcon,
  TrophyIcon,
  UsersIcon,
} from './JourneyIcons.jsx';
import JourneyDialogShell from './JourneyDialogShell.jsx';

const log = debug('MilestoneModal');

const BENEFIT_ICONS = {
  search: SearchIcon,
  message: MessageIcon,
  shield: ShieldIcon,
  star: StarIcon,
  trendUp: TrendUpIcon,
  chartBar: ChartBarIcon,
  company: CompanyIcon,
  users: UsersIcon,
};

const Stat = ({ value, label, gold, playful }) => (
  <div
    className={
      gold
        ? 'flex flex-1 flex-col items-center gap-[2px] rounded-[16px] border border-[#eedeb8] bg-[#faf4e8] px-[8px] py-[12px] font-sans'
        : 'flex flex-1 flex-col items-center gap-[2px] rounded-[16px] border border-[#e7e7e7] bg-[#f7f8f4] px-[8px] py-[12px] font-sans'
    }
  >
    <span
      className={
        gold
          ? 'text-[25px] font-semibold leading-[30px] text-[#785910] playful:font-heading'
          : 'text-[25px] font-semibold leading-[30px] text-[#1c2a21] playful:font-heading'
      }
    >
      {value}
      {playful}
    </span>
    <span className="text-[10px] font-semibold uppercase leading-[12px] tracking-[1px] text-[#595959] max-lg:text-[12px]">
      {label}
    </span>
  </div>
);

/*
 * MilestoneModal — the celebration dialog (Figma J-04 / J-06 / J-07). Props: n (1|2|3), copy, onClose, onShare (inert: Figma draws
 * no share flow), onPrimary. Confetti positions are the Figma ones (journeyConfetti.js); Playful swaps "pts" for "XP" and the
 * heading font.
 */
const MilestoneModal = ({ n, copy, onClose, onShare, onPrimary }) => {
  // `copy` (journeyModel milestoneModalFor) adapts counts and parent wording to the talent; Figma copy otherwise.
  const m = copy ?? MILESTONE_MODALS[n];
  useEffect(() => {
    log('mount', { n });
  }, [n]);
  const medal =
    n === 2
      ? {
          cls: 'border-4 border-[#c8951a] bg-[#faf4e8]',
          glyph: <TrophyIcon className="size-[60px]" />,
        }
      : {
          cls: 'border-[6px] border-white bg-[#c8951a] shadow-[0_6px_17px_rgba(0,0,0,0.1)]',
          glyph:
            n === 1 ? (
              <GthEyeIcon className="h-[48px] w-[50px] text-white" />
            ) : (
              <DiamondIcon className="size-[50px] text-white" />
            ),
        };
  return (
    <JourneyDialogShell
      labelId={`milestone-${n}-title`}
      onClose={onClose}
      className="max-w-[560px] overflow-hidden rounded-[28px] bg-white pb-[32px] shadow-[0_14px_42px_rgba(0,0,0,0.11)]"
      closeClass="right-[20px] top-[20px] size-[36px] bg-[#f3f3ef]"
    >
      <div
        className="relative h-[196px] overflow-hidden bg-[radial-gradient(circle_at_50%_50%,#f7efdd_0%,#ffffff_100%)] max-sm:h-[170px]"
        aria-hidden="true"
      >
        {CONFETTI[n].map(([x, y, w, h, c, o], i) => (
          <span
            key={i}
            className="absolute rounded-[2px] max-sm:hidden"
            style={{ left: x, top: y, width: w, height: h, background: c, opacity: o }}
          />
        ))}
        <span className="absolute left-1/2 top-[28px] size-[150px] -translate-x-1/2 rounded-full bg-[#c8951a]/[0.14]" />
        <span
          className={`absolute left-1/2 top-[48px] flex size-[112px] -translate-x-1/2 items-center justify-center rounded-full ${medal.cls}`}
        >
          {medal.glyph}
        </span>
      </div>
      <div className="flex flex-col gap-[20px] px-[36px] max-sm:px-[16px]">
        <div className="flex flex-col items-center gap-[8px] text-center font-sans">
          <span className="text-[12px] font-bold leading-[14px] tracking-[1.4px] text-[#785910]">
            {m.eyebrow}
          </span>
          <h2
            id={`milestone-${n}-title`}
            className="m-0 text-[44px] font-semibold leading-[53px] text-[#111111] playful:font-heading max-sm:text-[32px] max-sm:leading-[38px]"
          >
            {m.lead ? <span className="text-[#1c2a21]">{m.lead}</span> : null}
            <span className="text-[#387440]">{m.accent}</span>
            {m.tail ? <span className="text-[#1c2a21]">{m.tail}</span> : null}
          </h2>
          <p className="m-0 text-[15px] font-normal leading-[22px] text-[#595959]">{m.body}</p>
        </div>
        <div className="flex gap-[10px] max-sm:gap-[6px]">
          <Stat value={m.stats.done} label="Stages done" />
          <Stat value={m.stats.profile} label="Profile" />
          <span className="contents playful:hidden">
            <Stat gold value={`${m.stats.bonus} pts`} label="Bonus" />
          </span>
          <span className="hidden flex-1 playful:contents">
            <Stat gold value={m.stats.bonusPlayful} label="Bonus" />
          </span>
        </div>
        <div className="flex flex-col gap-[4px] font-sans">
          <span className="text-[11px] font-bold uppercase leading-[13px] tracking-[1.2px] text-[#595959] max-lg:text-[12px]">
            What’s new for you
          </span>
          {m.benefits.map((b) => {
            const Glyph = BENEFIT_ICONS[b.icon];
            return (
              <div key={b.title} className="flex items-start gap-[14px] py-[12px]">
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#ebf1ec] text-[#387440]">
                  <Glyph className="size-[20px]" />
                </span>
                <span className="flex min-w-0 flex-col gap-[2px]">
                  <span className="text-[15px] font-semibold leading-[18px] text-[#1c2a21]">
                    {b.title}
                  </span>
                  <span className="text-[13px] font-normal leading-[18px] text-[#595959]">
                    {b.text}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        {m.next ? (
          <div className="flex items-center gap-[12px] rounded-[14px] bg-[#f7f8f4] px-[14px] py-[12px] font-sans">
            {m.next.icon === 'trophy' ? (
              <TrophyIcon className="size-[18px] shrink-0" />
            ) : (
              <DiamondIcon className="size-[18px] shrink-0 text-[#785910]" />
            )}
            <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="text-[13px] font-semibold leading-[16px] text-[#1c2a21]">
                {m.next.label}
              </span>
              <span className="h-[6px] w-full rounded-[3px] bg-[#e7e7e3]" aria-hidden="true">
                <span
                  className="block h-full rounded-[3px] bg-[#c8951a]"
                  style={{ width: `${(m.next.bar / 430) * 100}%` }}
                />
              </span>
            </span>
          </div>
        ) : null}
        <div className="flex gap-[12px] max-sm:flex-col">
          <button
            type="button"
            onClick={() => {
              log('share (no flow drawn)', n);
              onShare?.();
            }}
            className="flex h-[56px] flex-1 cursor-pointer items-center justify-center rounded-[14px] border-2 border-[#c1d4c4] bg-[#e1eae2] font-sans text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#165d3a] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {m.share}
          </button>
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRightIcon className="size-[20px]" />}
            onClick={() => onPrimary?.(m.primary.to)}
            className="flex-1"
          >
            {m.primary.label}
          </Button>
        </div>
      </div>
    </JourneyDialogShell>
  );
};

export default MilestoneModal;
