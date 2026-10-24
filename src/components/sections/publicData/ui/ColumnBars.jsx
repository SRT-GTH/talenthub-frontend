import { classNames } from '../../../../utils/classNames.js';
import { safeShare } from '../publicDataFormat.js';

/*
 * ColumnBars — "Age distribution" columns of the "Who they are" card (Figma 8487:346214: 4 columns, gap 16, 140px high; per column
 * the share above (13/16 600 #1c2a21), the bar (#387440, 2.2px per percentage point: 18% -> 40, 42% -> 92) and the age band below
 * (13/16 500 #595959)); region page "Age" card 8493:1941.
 * Props
 *   items      [{ key, label, count }]   label = "14–17" (en dash, as drawn)
 *   total      number    denominator (default: sum of counts)
 *   emptyLabel string    printed instead of "<5" for a band that is excluded (e.g. by a filter): pass "—"; a band with count null/undefined uses it
 *   ariaLabel  string    name of the table that is the text equivalent ("Age distribution of 219,428 talents")
 *   className
 * Privacy: shares come from safeShare(); a band with < 5 people prints "<5" and draws no bar.
 * The visible chart is aria-hidden; a visually-hidden table carries the same numbers for screen readers.
 */

const PX_PER_POINT = 2.2;
const PLOT = 96;

const ColumnBars = ({ items, total, ariaLabel, emptyLabel, className }) => {
  const sum = total ?? items.reduce((acc, it) => acc + (it.count ?? 0), 0);
  const shares = items.map((it) => safeShare(it.count, sum));
  const bandText = (it) =>
    emptyLabel && (it.count === null || it.count === undefined) ? emptyLabel : '<5';
  const max = Math.max(1, ...shares.map((s) => s ?? 0));
  const scale = Math.min(PX_PER_POINT, PLOT / max);
  return (
    <div className={classNames('font-sans', className)}>
      <div aria-hidden="true" className="flex h-[140px] items-end gap-[16px]">
        {items.map((it, i) => (
          <div
            key={it.key}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-[6px]"
          >
            <span className="text-[13px] leading-[16px] font-semibold text-[#1c2a21]">
              {shares[i] === null ? bandText(it) : `${shares[i]}%`}
            </span>
            <span
              className="block w-full rounded-t-[4px] bg-[#387440]"
              style={{ height: `${shares[i] === null ? 0 : Math.round(shares[i] * scale)}px` }}
            />
            <span className="text-[13px] leading-[16px] font-medium text-[#595959]">
              {it.label}
            </span>
          </div>
        ))}
      </div>
      <table className="sr-only">
        <caption>{ariaLabel}</caption>
        <thead>
          <tr>
            <th scope="col">Age range</th>
            <th scope="col">Share of talents</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={it.key}>
              <th scope="row">{it.label}</th>
              <td>{shares[i] === null ? bandText(it) : `${shares[i]}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ColumnBars;
