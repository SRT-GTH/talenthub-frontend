import { classNames } from '../../../../../utils/classNames.js';
import { GridFeedbackBadIcon, GridFeedbackInfoIcon, GridFeedbackOkIcon } from './GridGlyphs.jsx';

/*
 * GridFeedback — the "feedback slot" under the board (Figma 428x52 slot, "GTH · Game feedback" pill 46px high, 3px from the top):
 *   bad   #fcebe8, message #c73326, cross       info  #f2f5f4, message #6b6b6b, info       ok  #e2f1e4, message #27522e, check
 * Playful: 1.2px ink@.35 border + 0/3 hard shadow ink@.25 (Focused: neither). The message sits in an aria-live region.
 */
const TONES = {
  bad: { box: 'bg-[#fcebe8] text-[#c73326]', Icon: GridFeedbackBadIcon },
  info: { box: 'bg-[#f2f5f4] text-[#6b6b6b]', Icon: GridFeedbackInfoIcon },
  ok: { box: 'bg-[#e2f1e4] text-[#27522e]', Icon: GridFeedbackOkIcon },
};

const GridFeedback = ({ feedback }) => {
  const tone = feedback ? TONES[feedback.tone] : null;
  const Glyph = tone?.Icon;
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[52px] items-start justify-center pt-[3px]"
    >
      {feedback ? (
        <p
          className={classNames(
            'm-0 inline-flex max-w-full items-center gap-[10px] rounded-full py-[10px] pr-[18px] pl-[14px] font-sans text-[14px] leading-[17px] font-semibold max-lg:text-[12px] playful:border-[1.2px] playful:border-solid playful:border-[rgba(28,42,33,0.35)] playful:shadow-[0_3px_0_rgba(28,42,33,0.25)]',
            tone.box
          )}
        >
          <span className="inline-flex size-[24px] shrink-0 items-center justify-center rounded-full bg-white">
            <Glyph className="size-[16px]" />
          </span>
          <span className="min-w-0">{feedback.text}</span>
        </p>
      ) : null}
    </div>
  );
};

export default GridFeedback;
