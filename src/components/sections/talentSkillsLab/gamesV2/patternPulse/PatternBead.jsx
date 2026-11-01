import { classNames } from '../../../../../utils/classNames.js';
import { NwCheckMarkIcon } from '../numbersWords/NumbersWordsIcons.jsx';
import PatternTimerRing from './PatternTimerRing.jsx';

/*
 * PatternBead — one bead of the string (Figma "bead · 5": 104px circle "glass" + "hole" + "shine" + number; 96px when the
 * string holds 7 beads). Everything scales with the board's `--s` (bead size) so it shrinks on phones.
 *   Playful  1.5px ink@.55 ring, hard 0 4 0 ink@.45 shelf, inner shadow 0 -8 10 black@.16, hole ink@.18, white@.45 shine (-18deg)
 *   Focused  no ring / shine, soft 0 3 8 ink@.10, hole ink@.10
 * The "?" bead (`slot`) is a white circle with a dashed ring (2px playful / 1.5px focused, dash 6 6), the countdown ring
 * (`timer` { fraction, urgent, label }) and the seconds text; a revealed answer bead can carry the green check badge (`mark`).
 */
const BeadNumber = ({ children, ink }) => (
  <span
    className="absolute inset-0 flex items-center justify-center font-sans text-[max(12px,calc(var(--s)*0.38))] leading-none font-semibold playful:font-heading"
    style={{ color: ink }}
  >
    {children}
  </span>
);

const PatternBead = ({ value, color, slot, timer, mark, className }) => {
  if (slot) {
    return (
      <div
        className={classNames('relative shrink-0', className)}
        style={{ width: 'var(--s)', height: 'var(--s)' }}
      >
        <span className="absolute inset-0 rounded-full bg-white" />
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 104 104"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            cx="52"
            cy="52"
            r="51"
            fill="none"
            stroke="rgba(28,42,33,0.25)"
            strokeDasharray="6 6"
            className="[stroke-width:1.5] playful:stroke-[rgba(28,42,33,0.35)] playful:[stroke-width:2]"
          />
        </svg>
        {timer ? <PatternTimerRing fraction={timer.fraction} urgent={timer.urgent} /> : null}
        <span className="absolute inset-0 flex -translate-y-[7.7%] items-center justify-center font-sans text-[max(14px,calc(var(--s)*0.38))] leading-none font-semibold text-[#6b706e] playful:text-[max(14px,calc(var(--s)*0.4))] playful:font-heading">
          ?
        </span>
        {timer ? (
          <span
            data-testid="pp-seconds"
            className={classNames(
              'absolute left-1/2 -translate-x-1/2 font-sans text-[12px] leading-[14px] font-bold whitespace-nowrap',
              'top-[calc(var(--s)*0.71)] @max-[420px]:top-[calc(100%+12px)]',
              timer.urgent ? 'text-[#c73326]' : 'text-[#27522e]'
            )}
          >
            {timer.label}
          </span>
        ) : null}
      </div>
    );
  }
  return (
    <div
      className={classNames('relative shrink-0', className)}
      style={{ width: 'var(--s)', height: 'var(--s)' }}
    >
      <span
        className="absolute inset-0 rounded-full shadow-[0_3px_8px_rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-solid playful:border-[rgba(28,42,33,0.55)] playful:shadow-[0_4px_0_rgba(28,42,33,0.45),inset_0_-8px_10px_rgba(0,0,0,0.16)]"
        style={{ backgroundColor: color.fill }}
      />
      <span className="absolute top-[47.1%] left-[19.2%] h-[5.8%] w-[61.5%] rounded-[3px] bg-[rgba(28,42,33,0.1)] playful:bg-[rgba(28,42,33,0.18)]" />
      <span className="absolute top-[1.9%] left-[20.2%] hidden h-[29.8%] w-[38.5%] -rotate-[18deg] rounded-full bg-[rgba(255,255,255,0.45)] playful:block" />
      <BeadNumber ink={color.ink}>{value}</BeadNumber>
      {mark ? (
        <span
          data-testid="pp-bead-mark"
          className="absolute top-[-3.8%] left-[76.9%] inline-flex size-[27.9%] min-h-[20px] min-w-[20px] items-center justify-center rounded-full border-[2.5px] border-solid border-white bg-[#387440] text-white"
        >
          <NwCheckMarkIcon className="size-[14px]" />
        </span>
      ) : null}
    </div>
  );
};

export default PatternBead;
