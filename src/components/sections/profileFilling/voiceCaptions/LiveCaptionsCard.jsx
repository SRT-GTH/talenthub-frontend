import { classNames } from '../../../../utils/classNames.js';
import CareerBuddyAvatar from '../../../shared/CareerBuddyAvatar.jsx';
import { CaptionInfoIcon } from './VoiceCaptionIcons.jsx';
import { VOICE_COPY } from './voiceCaptionData.js';

/*
 * Live captions card - Figma 9149:83471 (VC-01 You), 9149:83928 (VC-02 Buddy), 9152:205 (VC-06 Buddy paused).
 * Card: white, radius 22 (Focused 18), padding 18/22/20/22, 10px between rows.
 *   Playful: border 1.5 #1c2a21@55%, hard 4px shadow, "LIVE CAPTIONS" sticker (rotated -3deg).
 *   Focused: border 1 #e7e7e7, soft shadow, plain "Live captions" label (12/500 #737373).
 * Speaker row: 28px avatar, name 14/600, state pill (Listening red, Speaking green, Paused grey), the label.
 * `children` is the caption text (see CaptionWords); `note` is the grey helper line with the info icon.
 * The label is a button when `onToggleCaptions` is given: tapping it hides the captions (the CC pill brings them back).
 *
 * ⚠️ ASSUMPTION: Figma draws no control to hide captions while they are showing; the label/sticker doubles as
 * the toggle (aria-label "Live captions. Tap to hide") so the call can reach the "Captions off" frame.
 */
const STATES = {
  listening: {
    label: VOICE_COPY.listening,
    pill: 'bg-[#fdecea] text-[#d93025]',
    dot: 'bg-[#d93025]',
  },
  speaking: {
    label: VOICE_COPY.speaking,
    pill: 'bg-[#ebf1ec] text-[#387440]',
    dot: 'bg-[#387440]',
  },
  paused: { label: VOICE_COPY.paused, pill: 'bg-[#f8f8f4] text-[#737373]', dot: 'bg-[#a3a7a1]' },
};

const LABEL_BASE =
  'shrink-0 border-0 bg-transparent p-0 font-sans text-[12px] font-medium leading-[14px] text-[#737373]';
const LABEL_PLAYFUL =
  'playful:inline-flex playful:rounded-[8px] playful:border-[1.2px] playful:border-solid playful:border-[#1c2a21] playful:bg-[#ffd86b] playful:px-[9px] playful:py-[3px] playful:text-[11px] playful:max-lg:text-[12px] playful:font-bold playful:leading-[13px] playful:text-[#1c2a21] playful:shadow-[2px_2px_0_#1c2a21] playful:-rotate-3';

const CaptionsLabel = ({ onToggleCaptions }) => {
  const inner = (
    <>
      <span className="playful:hidden">{VOICE_COPY.labelFocused}</span>
      <span className="hidden playful:inline">{VOICE_COPY.stickerPlayful}</span>
    </>
  );
  if (!onToggleCaptions)
    return <span className={classNames(LABEL_BASE, LABEL_PLAYFUL)}>{inner}</span>;
  return (
    <button
      type="button"
      onClick={onToggleCaptions}
      aria-label={`${VOICE_COPY.labelFocused}. Tap to hide`}
      className={classNames(
        LABEL_BASE,
        LABEL_PLAYFUL,
        'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2a21]'
      )}
    >
      {inner}
    </button>
  );
};

const LiveCaptionsCard = ({
  speaker = 'you',
  state = 'listening',
  note = null,
  dimmed = false,
  onToggleCaptions,
  className,
  children,
}) => {
  const st = STATES[state] ?? STATES.listening;
  const isBuddy = speaker === 'buddy';
  return (
    <section
      aria-label={isBuddy ? VOICE_COPY.buddyLabel : VOICE_COPY.you}
      className={classNames(
        'flex w-[min(720px,100%)] flex-col gap-[10px] rounded-[18px] border border-solid border-[#e7e7e7] bg-white px-[clamp(16px,2vw,22px)] pb-[20px] pt-[18px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_6px_20px_rgba(28,42,33,0.06)]',
        'playful:rounded-[22px] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]',
        dimmed && 'opacity-75',
        className
      )}
    >
      <div className="flex items-center gap-[10px]">
        {isBuddy ? (
          <CareerBuddyAvatar size={28} />
        ) : (
          <span className="size-[28px] shrink-0 rounded-full bg-[#c9e2cc]" aria-hidden="true" />
        )}
        <span className="font-sans text-[14px] font-semibold leading-[17px] text-[#1c2a21]">
          {isBuddy ? VOICE_COPY.buddyLabel : VOICE_COPY.you}
        </span>
        <span
          className={classNames(
            'inline-flex items-center gap-[6px] rounded-full py-[3px] pl-[8px] pr-[9px] font-sans text-[12px] font-semibold leading-[14px]',
            st.pill
          )}
        >
          <span
            className={classNames('size-[7px] shrink-0 rounded-full', st.dot)}
            aria-hidden="true"
          />
          {st.label}
        </span>
        <span className="h-px min-w-0 flex-1" aria-hidden="true" />
        <CaptionsLabel onToggleCaptions={onToggleCaptions} />
      </div>
      {children}
      {note ? (
        <p className="m-0 flex items-center gap-[6px] font-sans text-[12px] leading-[14px] text-[#737373]">
          <CaptionInfoIcon className="size-[14px] shrink-0" />
          <span>{note}</span>
        </p>
      ) : null}
    </section>
  );
};

export default LiveCaptionsCard;
