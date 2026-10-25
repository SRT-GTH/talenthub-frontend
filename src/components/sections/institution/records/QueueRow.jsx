import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { RecordsIconArrow } from './recordsIcons.jsx';

/*
 * QueueRow — one row of the records / credentials lists (Figma "result" 8602:396606, 1327x70: p14/20/14/18 gap 14): 42px monogram, name 16/600 + sticker, sub-line 13 #737373,
 * the pills, the action pill and the arrow. `muted` draws the dimmed last row (op .5: monogram and text), `action` is the right-hand button, `href` the row target.
 * Props: initials, name, badge, sub, pills (node), action (node), href, muted, select ({ checked, onChange, label }).
 */
const QueueRow = ({ initials, name, badge, sub, pills, action, href, muted, select }) => (
  <li className="m-0 flex list-none flex-wrap items-center gap-x-[14px] gap-y-[8px] py-[14px] pr-[20px] pl-[18px] font-sans">
    {select ? (
      <input
        type="checkbox"
        checked={select.checked}
        onChange={select.onChange}
        aria-label={select.label}
        className="size-[20px] shrink-0 cursor-pointer accent-[#387440]"
      />
    ) : null}
    <span
      aria-hidden="true"
      className={classNames(
        'flex size-[42px] shrink-0 items-center justify-center rounded-full text-[15px] leading-[18px] font-semibold text-white',
        muted ? 'bg-[#f8f8f4] opacity-50' : 'bg-[#387440]'
      )}
    >
      {initials}
    </span>
    <div
      className={classNames('flex min-w-[200px] flex-1 flex-col gap-[2px]', muted && 'opacity-50')}
    >
      <div className="flex flex-wrap items-center gap-[8px]">
        <span className="text-[16px] leading-[19px] font-semibold text-[#1c2a21]">{name}</span>
        <span
          className={classNames(
            'inline-flex items-center rounded-full bg-[#ebf1ec] px-[10px] py-[4px] font-bold text-[#1f4d26]',
            muted
              ? 'text-[11.5px] max-lg:text-[12px] leading-[14px]'
              : 'text-[11px] max-lg:text-[12px] leading-[13px]'
          )}
        >
          {badge}
        </span>
      </div>
      <span className="text-[13px] leading-[16px] text-[#737373]">{sub}</span>
    </div>
    <div className="flex flex-wrap items-center gap-[6px]">{pills}</div>
    {action}
    {href ? (
      <Link
        to={href}
        tabIndex={-1}
        aria-hidden="true"
        className="flex size-[16px] items-center justify-center text-[#2d5d33]"
      >
        <RecordsIconArrow className="size-[16px]" />
      </Link>
    ) : null}
  </li>
);

export default QueueRow;
