import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed, safeShare } from '../publicDataFormat.js';

/*
 * StackedBar — the single horizontal composition bar of the Theme 8 cards. Covers both "bar row" variants of the brief:
 *   STACKED  "Who they are" education split: 8487:346195 area (28px high, r6, gap 2, segments #224626 / #6ca271 / #c1d4c4 with the share
 *            printed inside, legend "● Pre-tertiary 100,937 · ● In-tertiary 70,217 · ● Post-tertiary 48,274")
 *   SPLIT    "Talent profile" gender split: 8487:346268 (12px high, r4, gap 2: Female #387440 / Male #2a78d6 / Not shared #e4e4df,
 *            legend "● Female 48%")
 *   and the region page education bars 8493:1913 (24px / 12px, r5) and the mobile card 8507:185 (24px).
 * Props
 *   segments   [{ key, label, count, tone }]  tone: 'dark' #224626 | 'mid' #6ca271 | 'light' #c1d4c4 | 'green' #387440 | 'blue' #2a78d6 | 'neutral' #e4e4df
 *   total      number    denominator for the shares (default: sum of segments)
 *   height     number    px: 28 (default) | 24 | 12 …
 *   radius     number    px, default 6
 *   showShare  boolean   print the whole-percent share inside each segment (needs height >= 20); a suppressed segment prints nothing
 *   gap        number    px between bar and legend (default 24 for bars >= 24px high, 12 for thin ones, as drawn)
 *   legend     'counts' | 'shares' | 'none'   default 'counts'. 'none' keeps a visually-hidden list as the text equivalent.
 *   ariaLabel  string    name of the legend list, e.g. "Education level of 219,428 talents"
 *   className
 * Privacy: every count and share goes through formatCount() / safeShare(); a segment with < 5 people is drawn as a 6px sliver whose
 * width does not reveal the count, and its legend entry reads "<5".
 */

const TONES = {
  dark: { bg: '#224626', fg: '#ffffff' },
  mid: { bg: '#6ca271', fg: '#1c2a21' },
  light: { bg: '#c1d4c4', fg: '#1c2a21' },
  green: { bg: '#387440', fg: '#ffffff' },
  blue: { bg: '#2a78d6', fg: '#ffffff' },
  neutral: { bg: '#e4e4df', fg: '#1c2a21' },
};

const StackedBar = ({
  segments,
  total,
  height = 28,
  radius = 6,
  showShare = true,
  gap,
  legend = 'counts',
  ariaLabel,
  className,
}) => {
  const sum = total ?? segments.reduce((acc, s) => acc + (s.count ?? 0), 0);
  const shares = segments.map((s) => safeShare(s.count, sum));
  return (
    <div
      className={classNames('flex min-w-0 flex-col font-sans', className)}
      style={{ gap: `${gap ?? (height >= 24 ? 24 : 12)}px` }}
    >
      <div
        aria-hidden="true"
        className="flex w-full gap-[2px] overflow-hidden"
        style={{ height: `${height}px`, borderRadius: `${radius}px` }}
      >
        {segments.map((s, i) => {
          const tone = TONES[s.tone] ?? TONES.green;
          const hidden = isSuppressed(s.count);
          return (
            <div
              key={s.key}
              className="flex min-w-0 items-center justify-center text-[12px] leading-[14px] font-bold"
              style={{
                background: tone.bg,
                color: tone.fg,
                flex: hidden ? '0 0 6px' : `${s.count} 1 0`,
              }}
            >
              {showShare && height >= 20 && !hidden && shares[i] !== null ? `${shares[i]}%` : null}
            </div>
          );
        })}
      </div>
      <ul
        aria-label={ariaLabel}
        className={classNames(
          'm-0 flex list-none flex-wrap gap-x-[24px] gap-y-[6px] p-0',
          legend === 'none' && 'sr-only'
        )}
      >
        {segments.map((s, i) => {
          const tone = TONES[s.tone] ?? TONES.green;
          const text =
            legend === 'shares'
              ? shares[i] === null
                ? '<5'
                : `${shares[i]}%`
              : formatCount(s.count);
          return (
            <li key={s.key} className="flex items-center gap-[8px] text-[13px] leading-[16px]">
              <span
                aria-hidden="true"
                className="size-[10px] shrink-0 rounded-full"
                style={{ background: tone.bg }}
              />
              <span className="font-semibold text-[#1c2a21]">{s.label}</span>
              <span className="font-normal text-[#595959]">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default StackedBar;
