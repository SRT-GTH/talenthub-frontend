import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { labelOf, OPPORTUNITY_TYPES } from './data/directoryData.js';
import TypePill from './TypePill.jsx';

/*
 * OpportunityList — the opportunity directory body.
 *   desktop >= md : Figma "table" 8498:349082 — white card r24 (1px #e7e7e7, shadow), head row #fbfbf8 (12/14 600 caps +0.72 #595959, p 12/24),
 *     rows p 16/24 with a top border: title 16/19 600 + partner 13/16 #595959 · type pill · region 14/17 · eligibility 14/17 ·
 *     deadline 14/17 600 (#785910 when closing soon, as drawn on 15 Nov / 22 Nov) · "View →" 14/17 600 #387440. The first deadline-soon row
 *     is also tinted #fbfbf8 in Figma (a hover state) — reproduced as the row hover.
 *     Tablet (drawn with mismatched headers / overlapping pills): a plain responsive grid with every column, nothing overlaps.
 *   phone  < md  : Figma cards 8508:470 — V gap 6, p 14/16, r24: type pill 11/13 · title 16/19 · "Partner · Region" 13/16 · deadline 13/16 600.
 * Rows are real links ("View →" / the title). Props: items (OPPORTUNITIES), className.
 */

const GRID =
  'grid grid-cols-[minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_56px] items-center gap-x-[16px] px-[24px] xl:grid-cols-[minmax(0,450px)_150px_170px_230px_140px_90px]';

const deadlineClass = (o) => (o.closingSoon ? 'text-[#785910]' : 'text-[#1c2a21]');

const OpportunityList = ({ items, className }) => (
  <div className={className}>
    <div
      role="table"
      aria-label="Open opportunities"
      className="hidden overflow-hidden rounded-[24px] border border-solid border-[#e7e7e7] bg-white shadow-[0_5px_17px_rgba(0,0,0,0.04)] md:block"
    >
      <div role="row" className={classNames(GRID, 'min-h-[38px] bg-[#fbfbf8] py-[12px]')}>
        {['Opportunity', 'Type', 'Region', 'Eligibility', 'Deadline'].map((h) => (
          <span
            key={h}
            role="columnheader"
            className="font-sans text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase"
          >
            {h}
          </span>
        ))}
        <span role="columnheader" className="sr-only">
          Open
        </span>
      </div>
      {items.map((o) => (
        <div
          key={o.id}
          role="row"
          className={classNames(
            GRID,
            'relative min-h-[70px] border-t border-solid border-[#e7e7e7] py-[16px] font-sans hover:bg-[#fbfbf8] focus-within:bg-[#fbfbf8]'
          )}
        >
          <div role="cell" className="flex min-w-0 flex-col gap-[2px]">
            <Link
              to={`/data/opportunities/${o.id}`}
              className="rounded-[4px] text-[16px] leading-[19px] font-semibold text-[#1c2a21] no-underline outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[#387440]"
            >
              {o.title}
            </Link>
            <span className="text-[13px] leading-[16px] text-[#595959]">{o.partnerName}</span>
          </div>
          <div role="cell">
            <TypePill type={o.type} label={labelOf(OPPORTUNITY_TYPES, o.type)} />
          </div>
          <span role="cell" className="text-[14px] leading-[17px] text-[#1c2a21]">
            {o.regionLabel}
          </span>
          <span role="cell" className="text-[14px] leading-[17px] text-[#1c2a21]">
            {o.eligibility}
          </span>
          <span
            role="cell"
            className={classNames('text-[14px] leading-[17px] font-semibold', deadlineClass(o))}
          >
            {o.closes}
          </span>
          <span
            role="cell"
            aria-hidden="true"
            className="text-[14px] leading-[17px] font-semibold text-[#387440]"
          >
            View →
          </span>
        </div>
      ))}
    </div>
    <ul className="m-0 flex list-none flex-col gap-[16px] p-0 md:hidden">
      {items.map((o) => (
        <li
          key={o.id}
          className="relative flex flex-col gap-[6px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white px-[16px] py-[14px] font-sans shadow-[0_5px_17px_rgba(0,0,0,0.04)] focus-within:border-[#387440]"
        >
          <TypePill type={o.type} label={labelOf(OPPORTUNITY_TYPES, o.type)} />
          <h3 className="m-0 text-[16px] leading-[19px] font-semibold text-[#1c2a21]">
            <Link
              to={`/data/opportunities/${o.id}`}
              className="rounded-[4px] no-underline outline-none after:absolute after:inset-0 after:rounded-[24px] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#387440]"
            >
              {o.title}
            </Link>
          </h3>
          <p className="m-0 text-[13px] leading-[16px] text-[#595959]">
            {o.partnerName} · {o.regionLabel}
          </p>
          <p
            className={classNames('m-0 text-[13px] leading-[16px] font-semibold', deadlineClass(o))}
          >
            {o.closes}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

export default OpportunityList;
