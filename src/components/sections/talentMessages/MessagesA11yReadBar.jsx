import { useEffect } from 'react';
import { debug } from '../../../utils/debug.js';
import { excerpt, useReadAloud } from './MessagesA11yPrefs.js';
import { CloseIcon, PauseIcon, SkipIcon } from './dIcons.jsx';

const log = debug('MessagesA11yReadBar');

/*
 * MessagesA11yReadBar — Figma "read-aloud player" 7491:6635 (frame A-03 7491:6150 / 8110:454403, ?read=playing).
 * Dark pill (#1c2a21) with a pause disc, "Reading Owura’s message" + the quoted start of the message, a waveform,
 * the 1× speed chip, skip and close. Absolutely positioned at the bottom of the conversation panel (the thread's
 * relative container hosts it, above the composer: Figma x 747, y 926, 902x65).
 *
 * Props: speaker ("Owura"), text (full message), onStop() (pause / close / speech ended -> lead sets read to 'on'),
 * onSkip() optional (next message). Speech via window.speechSynthesis when present; silent otherwise.
 * Pause only stops the speech (no play glyph is drawn); the speed chip shows 1× as drawn and does not cycle.
 */
const RATES = [1];
const BARS = [8, 14, 20, 12, 18, 24, 10, 16, 22, 12, 8, 14, 18, 10, 6, 12, 16, 8];
const DONE_BARS = 9;

const MessagesA11yReadBar = ({ speaker = 'Owura', text = '', onStop, onSkip }) => {
  const rateIdx = 0;
  const { speak, stop } = useReadAloud({ onEnd: () => onStop?.() });

  useEffect(() => {
    log('mount', { speaker, chars: text.length });
    speak(text, RATES[0]);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const rateLabel = `${RATES[rateIdx]}×`;
  return (
    <div
      role="region"
      aria-label="Read aloud"
      className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-[12px] rounded-full bg-[#1c2a21] py-[8px] pr-[16px] pl-[8px] shadow-[0_10px_24px_rgba(28,42,33,0.06),0_4px_16px_rgba(28,42,33,0.2)] playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <button
        type="button"
        aria-label="Pause reading"
        onClick={() => {
          log('pause -> stop speech (bar stays)');
          stop();
        }}
        className="flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(28,42,33,0.12)] bg-[#eedeb8] text-[#1c2a21] playful:border-[1.2px] playful:border-[#1c2a21]"
      >
        <PauseIcon className="size-[16px]" />
      </button>
      <span className="flex min-w-0 flex-col gap-[2px]">
        <span className="truncate text-[13.5px] leading-[16px] font-semibold text-white">
          Reading {speaker}’s message
        </span>
        <span className="truncate text-[12px] leading-[14px] text-[#c1d4c4]">
          “{excerpt(text)}”
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-[24px] shrink-0 items-center gap-[3px] max-sm:hidden"
      >
        {BARS.map((h, i) => (
          <span
            key={i}
            style={{ height: h }}
            className={`w-[3px] rounded-[2px] ${i % 3 === 0 && i < DONE_BARS ? 'bg-[#387440]' : i < DONE_BARS ? 'bg-[#ebf1ec]' : 'bg-[#595959]'}`}
          />
        ))}
      </span>
      <span className="min-w-0 flex-1" />
      <button
        type="button"
        aria-label={`Speed ${rateLabel}`}
        onClick={() => log('speed chip: only 1x is drawn')}
        className="min-h-[25px] shrink-0 cursor-pointer rounded-full border border-[rgba(255,255,255,0.4)] px-[10px] py-[4px] text-[12.5px] leading-[15px] font-bold text-white"
      >
        {rateLabel}
      </button>
      <button
        type="button"
        aria-label="Skip to next message"
        onClick={() => {
          log('skip');
          onSkip?.();
        }}
        className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center text-white"
      >
        <SkipIcon className="size-[16px]" />
      </button>
      <button
        type="button"
        aria-label="Close reader"
        onClick={() => {
          log('close');
          stop();
          onStop?.();
        }}
        className="flex size-[24px] shrink-0 cursor-pointer items-center justify-center text-white"
      >
        <CloseIcon className="size-[16px]" />
      </button>
    </div>
  );
};

export default MessagesA11yReadBar;
