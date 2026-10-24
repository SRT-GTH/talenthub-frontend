import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount } from '../publicDataFormat.js';
import PublicCard from '../ui/PublicCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';
import { spokenChange, tableChange } from './regionsFormat.js';

const log = debug('DistrictTable');

/*
 * DistrictTable — "District breakdown" (Figma 8493:1843, 636x512) and, on the district page, "Sub-metros & communities" (8494:2009).
 * A real <table>: header row 12/14 600 +0.72 caps #595959 (# · District · Talents · 30-day change, the last two right-aligned), rows 39px with a
 * 1px #e7e7e7 rule: rank 14/17 500 #595959, name 15/18 500 #1c2a21 (a link to the district), talents 15/18 600, change 14/17 600 (#387440 up,
 * #902b20 down — Figma 8494:2009 draws "▼ −1%" in #902b20). Shows the top 10; "View all N districts" (14/17 600 #387440) shows every listed row.
 * ⚠️ ASSUMPTION: Figma draws no "all districts" screen, so the link expands the table in place and turns into "Show top 10" (invented label).
 * Counts go through formatCount (a district under 5 reads "<5"). Loading (8494:8): the rows are skeleton bars; the header and the link stay.
 * Props: table { title, aside, firstCol, rows, viewAll, emptyText }, loading.
 */

const COLS =
  'grid grid-cols-[32px_minmax(0,1fr)_72px_104px] gap-x-[8px] md:grid-cols-[32px_minmax(0,1fr)_90px_130px]';

const DistrictTable = ({ table, loading = false }) => {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? table.rows : table.rows.slice(0, 10);
  const toggle = () => {
    log('toggle', { expanded: !expanded });
    setExpanded((v) => !v);
  };
  return (
    <PublicCard
      id={`table-${table.firstCol.toLowerCase()}`}
      title={table.title}
      hint={table.aside}
      loading={loading}
      className="flex min-w-0 flex-col"
      bodyClassName="flex flex-1 flex-col px-[24px] pb-[16px]"
    >
      {table.rows.length === 0 && !loading ? (
        <p className="m-0 py-[24px] font-sans text-[14px] leading-[20px] text-[#595959]">
          {table.emptyText}
        </p>
      ) : (
        <table role="table" className="w-full border-collapse font-sans">
          <caption className="sr-only">{`${table.title}, ${table.aside}`}</caption>
          <thead>
            <tr role="row" className={classNames(COLS, 'items-center py-[8px]')}>
              <th
                scope="col"
                role="columnheader"
                className="text-left text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959]"
              >
                #
              </th>
              <th
                scope="col"
                role="columnheader"
                className="text-left text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase"
              >
                {table.firstCol}
              </th>
              <th
                scope="col"
                role="columnheader"
                className="text-right text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase"
              >
                Talents
              </th>
              <th
                scope="col"
                role="columnheader"
                className="text-right text-[12px] leading-[14px] font-semibold tracking-[0.72px] text-[#595959] uppercase"
              >
                30-day change
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }, (_, i) => (
                  <tr
                    role="row"
                    key={i}
                    className={classNames(
                      COLS,
                      'items-center border-t border-solid border-[#e7e7e7] py-[10px]'
                    )}
                  >
                    <td role="cell">
                      <Skeleton width={12} height={14} />
                    </td>
                    <td role="cell">
                      <Skeleton width={`${70 - (i % 4) * 8}%`} height={16} />
                    </td>
                    <td role="cell" className="flex justify-end">
                      <Skeleton width={44} height={16} />
                    </td>
                    <td role="cell" className="flex justify-end">
                      <Skeleton width={48} height={14} />
                    </td>
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    role="row"
                    key={row.id}
                    className={classNames(
                      COLS,
                      'items-center border-t border-solid border-[#e7e7e7] py-[10px]'
                    )}
                  >
                    <td
                      role="cell"
                      className="text-[14px] leading-[17px] font-medium text-[#595959]"
                    >
                      {row.rank}
                    </td>
                    <th
                      scope="row"
                      role="rowheader"
                      className="min-w-0 text-left text-[15px] leading-[18px] font-medium text-[#1c2a21]"
                    >
                      {row.to ? (
                        <Link
                          to={row.to}
                          className="block truncate text-[#1c2a21] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                        >
                          {row.name}
                        </Link>
                      ) : (
                        <span className="block truncate">{row.name}</span>
                      )}
                    </th>
                    <td
                      role="cell"
                      className="text-right text-[15px] leading-[18px] font-semibold text-[#1c2a21]"
                    >
                      {formatCount(row.talents)}
                    </td>
                    <td
                      role="cell"
                      className={classNames(
                        'text-right text-[14px] leading-[17px] font-semibold',
                        row.trendPct >= 0 ? 'text-[#387440]' : 'text-[#902b20]'
                      )}
                    >
                      <span aria-hidden="true">{tableChange(row.trendPct)}</span>
                      <span className="sr-only">{spokenChange(row.trendPct)}</span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      )}
      {table.viewAll && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="mt-[10px] w-fit cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-[14px] leading-[17px] font-semibold text-[#387440] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          {expanded ? 'Show top 10' : table.viewAll}
        </button>
      )}
    </PublicCard>
  );
};

export default DistrictTable;
