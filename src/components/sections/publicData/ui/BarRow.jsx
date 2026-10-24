import { classNames } from '../../../../utils/classNames.js';
import { formatCount, isSuppressed } from '../publicDataFormat.js';
import Skeleton from './Skeleton.jsx';

/*
 * BarRow — Figma "T8 · Bar row" (carried detached in the frames: 8500:350646 "Career interests", 8500:350696 "Talent profile",
 * outcomes 8500:351071; mobile rows 8507:150 "bar · Technology"). A list item: label · track+bar · value.
 *   inline  (>= md): grid label 190 | track 1fr | value 64 (right aligned), gap 12, py 5; label 14/17 500 #1c2a21; track h14 r4 #efefea;
 *                    bar #387440 r4; value 14/17 600
 *   stacked (< md) : label + value on one line (13/16), the track (h10) underneath, gap 4
 * Render inside a <BarList> (a <ul>); this component renders the <li>.
 * Props
 *   label      string   "Technology"
 *   count      number   a talent count: printed with formatCount() (<5 -> "<5" and the bar is drawn empty)
 *   valueText  string   pre-formatted value ("41%", "GHS 2.4M"); used when `count` is not given
 *   ratio      number   0..1 fill of the track (the caller computes count/max or share); clamped
 *   layout     'responsive' | 'inline' | 'stacked'   default responsive (stacked below md)
 *   loading    boolean  skeleton row (label block 150x12 + bar block r4); `ratio` sets the skeleton bar width
 * a11y: the bar is decorative (the value text carries the number); the row is a list item.
 */

const WRAP = {
  stacked: 'grid-cols-[minmax(0,1fr)_auto] gap-x-[8px] gap-y-[4px]',
  inline: 'grid-cols-[190px_minmax(0,1fr)_64px] gap-x-[12px] py-[5px]',
  responsive:
    'grid-cols-[minmax(0,1fr)_auto] gap-x-[8px] gap-y-[4px] md:grid-cols-[190px_minmax(0,1fr)_64px] md:gap-x-[12px] md:gap-y-0 md:py-[5px]',
};

const LABEL = {
  stacked: 'col-start-1 row-start-1 text-[13px] leading-[16px]',
  inline: 'col-start-1 row-start-1 text-[14px] leading-[17px]',
  responsive: 'col-start-1 row-start-1 text-[13px] leading-[16px] md:text-[14px] md:leading-[17px]',
};

const TRACK = {
  stacked: 'col-span-2 col-start-1 row-start-2 h-[10px]',
  inline: 'col-start-2 row-start-1 h-[14px]',
  responsive:
    'col-span-2 col-start-1 row-start-2 h-[10px] md:col-span-1 md:col-start-2 md:row-start-1 md:h-[14px]',
};

const VALUE = {
  stacked: 'col-start-2 row-start-1 text-[13px] leading-[16px]',
  inline: 'col-start-3 row-start-1 text-[14px] leading-[17px]',
  responsive:
    'col-start-2 row-start-1 text-[13px] leading-[16px] md:col-start-3 md:text-[14px] md:leading-[17px]',
};

const BarRow = ({
  label,
  count,
  valueText,
  ratio = 0,
  layout = 'responsive',
  loading = false,
  className,
}) => {
  const mode = WRAP[layout] ? layout : 'responsive';
  const suppressed = count !== undefined && isSuppressed(count);
  const printed = count !== undefined ? formatCount(count) : valueText;
  const width = suppressed ? 0 : Math.max(0, Math.min(1, ratio)) * 100;
  if (loading) {
    return (
      <li className={classNames('flex items-center gap-[12px] py-[5px]', className)}>
        <Skeleton width={150} height={12} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <Skeleton
            height={14}
            radius={4}
            width={`${Math.max(20, Math.round(ratio * 100) || 80)}%`}
          />
        </div>
      </li>
    );
  }
  return (
    <li className={classNames('grid min-w-0 items-center font-sans', WRAP[mode], className)}>
      <span className={classNames('min-w-0 font-medium text-[#1c2a21]', LABEL[mode])}>{label}</span>
      <span
        aria-hidden="true"
        className={classNames(
          'block min-w-0 overflow-hidden rounded-[4px] bg-[#efefea]',
          TRACK[mode]
        )}
      >
        <span className="block h-full rounded-[4px] bg-[#387440]" style={{ width: `${width}%` }} />
      </span>
      <span
        className={classNames(
          'text-right font-semibold whitespace-nowrap text-[#1c2a21]',
          VALUE[mode]
        )}
      >
        {printed}
      </span>
    </li>
  );
};

export default BarRow;
