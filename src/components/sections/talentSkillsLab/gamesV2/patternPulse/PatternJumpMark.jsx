import { classNames } from '../../../../../utils/classNames.js';

/*
 * PatternJumpMark — the dashed arc + label pill that joins two beads once the rule is revealed (Figma "arc" 132x26: #8a6100@.6,
 * 1.5px, dash 4 4, ends 8px inside the bead centres; "jump" pill: #fef8ec, 14/17 700 #8a6100, padding 4/10, Playful 1px ink@.30 border).
 * Geometry is in bead units (the board sets `--s`, bead k centre = s·(k·(1 + g) + .5), g = the bead gap in bead sizes). `below` mirrors it under the string
 * (the second pattern of an "Expert · two patterns" round).
 */
const centre = (k) => `(var(--s) * (${k} * (1 + var(--g)) + 0.5))`;

const PatternJumpMark = ({ from, to, label, below = false }) => {
  const mid = `calc((${centre(from)} + ${centre(to)}) / 2)`;
  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 133 27"
        preserveAspectRatio="none"
        className={classNames(
          'pointer-events-none absolute h-[calc(var(--s)*0.25)] overflow-visible',
          below ? 'top-full -scale-y-100' : 'top-[calc(var(--s)*-0.25)]'
        )}
        style={{
          left: `calc(${centre(from)} + var(--s) * 0.077)`,
          width: `calc(${centre(to)} - ${centre(from)} - var(--s) * 0.154)`,
        }}
      >
        <path
          d="M0.5 26.76 Q66.5 -25.26 132.5 26.76"
          fill="none"
          stroke="#8a6100"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        data-testid="pp-jump"
        className={classNames(
          'absolute inline-flex -translate-x-1/2 items-center rounded-full bg-[#fef8ec] px-[10px] py-[4px] max-sm:px-[7px] max-sm:py-[2px] font-sans text-[14px] leading-[17px] font-bold whitespace-nowrap text-[#8a6100] max-lg:text-[12px] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.3)]',
          below ? 'top-[calc(100%+var(--s)*0.25-1px)]' : 'bottom-[calc(100%+var(--s)*0.25-1px)]'
        )}
        style={{ left: mid }}
      >
        {label}
      </span>
    </>
  );
};

export default PatternJumpMark;
