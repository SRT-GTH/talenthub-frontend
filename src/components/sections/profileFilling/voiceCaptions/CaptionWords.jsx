import { classNames } from '../../../../utils/classNames.js';

/*
 * Caption text of a card: settled words solid #1c2a21, the word being spoken green + bold (Buddy only),
 * words that may still change (You) or are not spoken yet (Buddy) grey. Figma 9149:83481 / 9149:83938:
 * SF Pro Rounded 22/500, line height 31. `small` = the paused Buddy line (16/23 #737373, 9152:215).
 * Grey is #8e928c on the You card and #b9bdb6 on the Buddy card.
 */
const GREY = { you: 'text-[#8e928c]', buddy: 'text-[#b9bdb6]' };

const CaptionWords = ({ solid = '', current = '', grey = '', tone = 'you', small = false }) => (
  <p
    className={classNames(
      'm-0 font-sans font-medium',
      small
        ? 'text-[16px] leading-[23px] text-[#737373]'
        : 'text-[clamp(18px,calc(16px+0.35vw),22px)] leading-[1.41] text-[#1c2a21]'
    )}
  >
    {solid}
    {current ? <span className="font-bold text-[#387440]">{current}</span> : null}
    {grey ? <span className={GREY[tone]}>{grey}</span> : null}
  </p>
);

export default CaptionWords;
