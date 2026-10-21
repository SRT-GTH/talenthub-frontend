import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { useReadAloud } from './MessagesA11yPrefs.js';
import { CloseIcon } from './dIcons.jsx';
import CareerBuddyAvatar from '../../shared/CareerBuddyAvatar.jsx';

const log = debug('MessagesA11yExplainCard');

/*
 * MessagesA11yExplainCard — Figma "Explain simply card" 7491:7152 (frame A-04 7491:6669 / 8110:454847,
 * ?explain=open). White card 560px, ink border + hard shadow (Playful), Buddy avatar, "In simple words" +
 * "Career Buddy" tag, the plain-words text, chips Listen · Say it in Twi · Hide and the footnote
 * "Buddy explains. It never replies for you." Copy verbatim from the node `characters`.
 *
 * Props: text (the plain-words version; mock API POST /messages/explain), onHide(), onTwi() ("Say it in Twi" ->
 * lead opens ?lang=twi), onClose() optional (X, defaults to onHide).
 */
export const EXPLAIN_DEMO_TEXT =
  'There are two steps next:\n1. You do a short skills task.\n2. You have a 30-minute video call with the team.';

const Chip = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex min-h-[32px] cursor-pointer items-center rounded-full border border-[#e1eae2] bg-white px-[14px] text-[13px] leading-[16px] font-semibold text-[#595959]"
  >
    {children}
  </button>
);

const MessagesA11yExplainCard = ({ text = EXPLAIN_DEMO_TEXT, onHide, onTwi, onClose }) => {
  const { speak, stop } = useReadAloud();
  useEffect(() => {
    log('mount', { chars: text.length });
    return stop;
  }, [text, stop]);

  return (
    <section
      aria-label="In simple words"
      className="flex w-[560px] max-w-full flex-col gap-[10px] rounded-[12px] border border-[rgba(28,42,33,0.1)] bg-white px-[16px] py-[14px] shadow-[0_4px_16px_rgba(28,42,33,0.06),0_1px_2px_rgba(28,42,33,0.04)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.55)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <div className="flex items-center gap-[8px]">
        <CareerBuddyAvatar size={26} className="shrink-0" />
        <h3 className="text-[15px] leading-[18px] font-semibold text-[#1c2a21]">In simple words</h3>
        <span className="rounded-full bg-[#ebf1ec] px-[8px] py-[2px] text-[11px] leading-[13px] font-semibold text-[#2d5d33] max-lg:text-[12px]">
          Career Buddy
        </span>
        <span className="min-w-0 flex-1" />
        <button
          type="button"
          aria-label="Close"
          onClick={() => (onClose ?? onHide)?.()}
          className="flex size-[24px] cursor-pointer items-center justify-center text-[#737373]"
        >
          <CloseIcon className="size-[16px]" />
        </button>
      </div>
      <p
        className="m-0 text-[17px] leading-[24px] whitespace-pre-line text-[#1c2a21]"
        data-msg-text
      >
        {text}
      </p>
      <div className="flex flex-wrap items-center gap-[8px]">
        <Chip
          onClick={() => {
            log('listen');
            speak(text, 1);
          }}
        >
          Listen
        </Chip>
        <Chip
          onClick={() => {
            log('say it in twi');
            onTwi?.();
          }}
        >
          Say it in Twi
        </Chip>
        <Chip
          onClick={() => {
            log('hide');
            stop();
            onHide?.();
          }}
        >
          Hide
        </Chip>
      </div>
      <p className="m-0 text-[12px] leading-[14px] text-[#737373]">
        Buddy explains. It never replies for you.
      </p>
    </section>
  );
};

export default MessagesA11yExplainCard;
