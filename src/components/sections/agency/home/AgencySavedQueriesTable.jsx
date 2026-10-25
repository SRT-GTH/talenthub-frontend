import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { formatCount, formatDate } from '../agencyFormat.js';
import { AgEllipsis } from './agencyHomeIcons.jsx';

const log = debug('AgencySavedQueriesTable');

/*
 * AgencySavedQueriesTable — the saved-queries table of the home (Figma "Table" 8597:398390, 1329 x 412, white, 1px #e5e5e5, r16).
 * Header 62 high on #f1f1f1 (16/24 #959592); rows 88 high with a #f1f1f1 rule; columns 64 (checkbox) · name (321) · status (198) · result (136) ·
 * last run (135) · actions (104), gap 40, centred. Name cell: 40 round initials chip + 16/22 600 title + 16/24 #999 dimensions.
 * Status pill: Monthly #f8f8f4 / Weekly #f3f8f4 / Paused #f9ebea with its border. Result: 48 x 6 bar + count (13.5/22 600); a count under 5 reads "<5" (formatCount).
 * Props: rows (SAVED_QUERIES shape). Checkboxes are real (row + select-all).
 * ⚠️ ASSUMPTION: the "…" actions button opens the Queries page (no menu is drawn).
 */

const CADENCE = {
  Monthly: 'border-[#e8e8e4] bg-[#f8f8f4] text-[#737373]',
  Weekly: 'border-[#e1eae2] bg-[#f3f8f4] text-[#2a5730]',
  Paused: 'border-[#ebc2bd] bg-[#f9ebea] text-[#902b20]',
};

const GRID =
  'grid grid-cols-[40px_minmax(0,1fr)_minmax(80px,120px)_minmax(96px,136px)_minmax(96px,135px)_40px] items-center gap-x-[clamp(10px,2.3vw,40px)] px-[clamp(12px,2vw,24px)] xl:grid-cols-[64px_minmax(0,321px)_198px_136px_135px_104px] xl:justify-center';

const AgencySavedQueriesTable = ({ rows, className }) => {
  const [selected, setSelected] = useState([]);
  const all = selected.length === rows.length && rows.length > 0;
  const toggle = (id) => {
    log('select', { id });
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  return (
    <div
      role="table"
      aria-label="Saved queries"
      className={classNames(
        'overflow-hidden rounded-[16px] border border-solid border-[#e5e5e5] bg-white font-sans',
        className
      )}
    >
      <div role="rowgroup">
        <div
          role="row"
          className={classNames(
            GRID,
            'h-[62px] bg-[#f1f1f1] text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]'
          )}
        >
          <div role="columnheader" className="flex justify-center">
            <input
              type="checkbox"
              aria-label="Select all saved queries"
              checked={all}
              onChange={() => setSelected(all ? [] : rows.map((r) => r.id))}
              className="size-[16px] cursor-pointer accent-[#387440]"
            />
          </div>
          <div role="columnheader">Saved query</div>
          <div role="columnheader">Status</div>
          <div role="columnheader">Result</div>
          <div role="columnheader">Last run</div>
          <div role="columnheader" className="text-center">
            Actions
          </div>
        </div>
      </div>
      <div role="rowgroup">
        {rows.map((r) => (
          <div
            key={r.id}
            role="row"
            className={classNames(
              GRID,
              'min-h-[88px] border-t border-solid border-[#f1f1f1] py-[8px]'
            )}
          >
            <div role="cell" className="flex justify-center">
              <input
                type="checkbox"
                aria-label={`Select ${r.name}`}
                checked={selected.includes(r.id)}
                onChange={() => toggle(r.id)}
                className="size-[16px] cursor-pointer accent-[#387440]"
              />
            </div>
            <div role="cell" className="flex min-w-0 items-center gap-[12px]">
              <span
                style={{ backgroundColor: r.chip.bg, color: r.chip.ink }}
                className="grid size-[40px] shrink-0 place-items-center rounded-full text-[14px] leading-[20px] font-bold"
              >
                {r.initials}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[16px] leading-[22px] font-semibold text-[#1c2a21]">
                  {r.name}
                </span>
                <span className="truncate text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {r.dims}
                </span>
              </span>
            </div>
            <div role="cell">
              <span
                className={classNames(
                  'inline-flex rounded-full border border-solid px-[12px] py-[5px] text-[16px] leading-[24px] tracking-[0.2px]',
                  CADENCE[r.cadence]
                )}
              >
                {r.cadence}
              </span>
            </div>
            <div role="cell" className="flex items-center gap-[8px]">
              <span
                aria-hidden="true"
                className="h-[6px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#eae8e2]"
              >
                <span
                  className="block h-full"
                  style={{ width: `${r.bar}%`, backgroundColor: r.barFill }}
                />
              </span>
              <span
                style={{ color: r.resultInk }}
                className="text-[13.5px] leading-[22px] font-semibold"
              >
                {formatCount(r.result)}
              </span>
            </div>
            <div role="cell" className="text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]">
              {formatDate(r.lastRun)}
            </div>
            <div role="cell" className="flex justify-center">
              <Link
                to="/agency/queries"
                aria-label={`Actions for ${r.name}`}
                className="inline-flex min-h-[28px] min-w-[32px] items-center justify-center rounded-[8px] text-[#9a988f] hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
              >
                <AgEllipsis className="h-[4px] w-[16px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgencySavedQueriesTable;
