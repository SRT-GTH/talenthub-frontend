import { classNames } from '../../../utils/classNames.js';

/*
 * ParentDefRows — phone-only compact definition rows (label left, value right,
 * hairline dividers, ~36px each). Replaces boxed PreviewField mini-tiles below
 * `md`; the tiles themselves stay (wrapped in `max-md:hidden`) from `md` up, so
 * tablet/desktop output is unchanged.
 *
 *   <ParentDefRows rows={[{ label: 'School', value: 'Achimota', valueColor: '#111' }]} />
 */
const ParentDefRows = ({ rows, className }) => (
  <dl
    className={classNames(
      'm-0 divide-y divide-[#ECECE8] border-y border-[#ECECE8] md:hidden',
      className
    )}
  >
    {rows.map(({ label, value, valueColor = '#111', trailing }) => (
      <div key={label} className="flex min-h-9 items-center justify-between gap-3 py-1.5">
        <dt className="shrink-0 font-sans text-[12px] leading-4 text-[#737373]">{label}</dt>
        <dd
          className="m-0 flex min-w-0 flex-wrap items-center justify-end gap-x-2 gap-y-1 break-words text-right font-sans text-[13px] font-semibold leading-[18px]"
          style={{ color: valueColor }}
        >
          {value}
          {trailing}
        </dd>
      </div>
    ))}
  </dl>
);

export default ParentDefRows;
