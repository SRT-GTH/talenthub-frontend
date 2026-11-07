import {
  MeetingHourglassGlyph,
  MeetingVideoCameraIcon,
  MeetingCompletedCircleIcon,
} from './pipelineBoardIcons.jsx';
import { MEETING_TONES } from './applicationPipelineData.js';
import { classNames } from '../../../utils/classNames.js';

/*
 * PipelineMeetingCard — the Interview column's card (Figma 7249:79175 / 79183, identical in PL-01 10173:11345): name + date, tinted status box, up to two buttons,
 * 24px round state badge top right. Shared by the legacy board and the new one. `labelFor(action)` maps an action key to its button text (default: the key itself).
 */
const STATE_BADGES = {
  hourglass: <MeetingHourglassGlyph className="size-[24px] text-white" />,
  alert: (
    <span className="font-sans text-[10px] max-lg:text-[12px] font-bold leading-[15px] text-white">
      !
    </span>
  ),
  check: <MeetingCompletedCircleIcon className="size-[24px] text-brand-green" />,
};

export const SecondaryButton = ({ card, onAction, labelFor = (a) => a }) =>
  card.secondaryAction ? (
    /* Figma 7249:79181 — white, 1px #e5e5e5, r8, 12/14.32 #111111 */
    <button
      type="button"
      onClick={() => onAction(card, card.secondaryAction)}
      className="inline-flex relative h-[30px] max-lg:h-[36px] items-center justify-center whitespace-nowrap rounded-[8px] max-lg:after:absolute max-lg:after:-inset-x-0 max-lg:after:-inset-y-[4px] border border-[#e5e5e5] bg-white px-[18px] font-sans text-[12px] max-lg:text-[13px] font-medium leading-[14.32px] tracking-[0.1px] text-black transition-colors hover:bg-neutral"
    >
      {labelFor(card.secondaryAction)}
    </button>
  ) : null;

const PipelineMeetingCard = ({ card, onAction, labelFor = (a) => a, secondaryFirst = false }) => {
  const tone = MEETING_TONES[card.tone];
  return (
    <article className="relative flex flex-col gap-[14px] max-lg:gap-[8px] rounded-[10px] border border-[#00522b]/10 bg-white p-[18px] max-lg:p-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]">
      {/* 24px round state badge — Figma 7249:79183 / :79186 / :79216 */}
      <span
        className={classNames(
          'absolute right-[18px] max-lg:right-[12px] top-[18px] max-lg:top-[12px] grid size-[24px] place-items-center rounded-full',
          tone.badge
        )}
      >
        {STATE_BADGES[card.badge]}
      </span>

      <div className="flex flex-col gap-[14px] max-lg:gap-[8px] pr-[32px]">
        <div className="flex flex-col gap-[4px]">
          <h4 className="font-sans text-[16px] max-lg:text-[15px] font-medium leading-[19.09px] text-[#1c1c1a]">
            {card.name}
          </h4>
          <p className="font-sans text-[14px] leading-5 tracking-[0.2px] text-neutral-dark-hover">
            {card.meta}
          </p>
        </div>

        {/* Status box — Figma 7249:79175, r8, 1.21px outline, pad 14/10 */}
        <div
          className={classNames(
            'flex items-center gap-[8px] rounded-[8px] border-[1.21px] px-[14px] py-[10px] max-lg:px-[10px] max-lg:py-[6px]',
            tone.box
          )}
        >
          <MeetingVideoCameraIcon className={classNames('size-[16px] shrink-0', tone.text)} />
          <span className="flex min-w-0 flex-col gap-[4px]">
            <span
              className={classNames(
                'font-sans text-[13px] font-medium leading-[15.51px]',
                tone.text
              )}
            >
              {card.statusLabel}
            </span>
            <span className="font-sans text-[14px] leading-[16.71px] tracking-[0.2px] text-content-helper">
              {card.platform}
            </span>
          </span>
        </div>
      </div>

      <div
        className={classNames('flex gap-[6px]', secondaryFirst ? 'flex-col-reverse' : 'flex-col')}
      >
        {card.primaryAction && (
          <button
            type="button"
            onClick={() => onAction(card, card.primaryAction)}
            className="inline-flex relative h-[30px] max-lg:h-[36px] items-center justify-center whitespace-nowrap rounded-[8px] max-lg:after:absolute max-lg:after:-inset-x-0 max-lg:after:-inset-y-[4px] border-2 border-brand-green-dark bg-brand-green px-[18px] font-sans text-[12px] max-lg:text-[13px] font-medium leading-[14.32px] tracking-[0.1px] text-white shadow-[0_4px_0_0_#224626] max-lg:shadow-none transition-all duration-300 ease-in hover:bg-brand-green-hover active:translate-y-[4px] max-lg:active:translate-y-0 active:shadow-none"
          >
            {labelFor(card.primaryAction)}
          </button>
        )}
        <SecondaryButton card={card} onAction={onAction} labelFor={labelFor} />
      </div>
    </article>
  );
};

export default PipelineMeetingCard;
