import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import SiteCopyChip from './SiteCopyChip.jsx';
import { chipLabel, highlightParts } from './siteCopyBrowseData.js';

/*
 * SiteCopySectionRow — one section of an open page (Figma "section · Hero": p 8/10, r10, gap 2): a 32 high line with the name (14/500, 14/600 when selected) and
 * the status chip, then the preview line (12.5/400, #575755; #5f6b63 in search results where the matched words are bold #1c2a21). The selected row is white with a
 * 1.5px #387440 ring. It is a link to the section editor (`to`) or, in the Emails tab, a button (`onSelect`) that only selects it first.
 * Props: label, summary, chip { kind, count }, selected, to, onSelect, highlight (search text), className.
 */
const SiteCopySectionRow = ({
  label,
  summary,
  chip,
  selected,
  to,
  onSelect,
  highlight,
  className,
}) => {
  const classes = classNames(
    'flex w-full flex-col gap-[2px] rounded-[10px] px-[10px] py-[8px] text-left font-sans no-underline',
    selected ? 'bg-white shadow-[0_0_0_1.5px_#387440]' : 'bg-transparent hover:bg-white/70',
    'cursor-pointer border-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#387440]',
    className
  );
  const aria = [label, chip ? chipLabel(chip) : '', summary].filter(Boolean).join(', ');
  const body = (
    <>
      <span className="flex min-h-[32px] items-center gap-[8px]">
        <span
          className={classNames(
            'min-w-0 flex-1 text-[14px] leading-[17px] text-[#1c2a21]',
            selected ? 'font-semibold' : 'font-medium'
          )}
        >
          {label}
        </span>
        {chip ? <SiteCopyChip generated kind={chip.kind} count={chip.count} /> : null}
      </span>
      {summary ? (
        <span
          aria-hidden={highlight ? undefined : 'true'}
          data-summary={highlight ? undefined : summary}
          className={classNames(
            'text-[12.5px] leading-[15px] font-normal',
            highlight ? 'text-[#5f6b63]' : 'text-[#575755] after:content-[attr(data-summary)]'
          )}
        >
          {highlight
            ? highlightParts(summary, highlight).map((p, i) =>
                p.hit ? (
                  <b key={i} className="font-bold text-[#1c2a21] underline">
                    {p.t}
                  </b>
                ) : (
                  <span key={i}>{p.t}</span>
                )
              )
            : null}
        </span>
      ) : null}
    </>
  );
  if (to && !onSelect) {
    return (
      <Link
        to={to}
        className={classes}
        aria-label={aria}
        aria-current={selected ? 'true' : undefined}
      >
        {body}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onSelect}
      className={classes}
      aria-label={aria}
      aria-pressed={selected}
    >
      {body}
    </button>
  );
};

export default SiteCopySectionRow;
