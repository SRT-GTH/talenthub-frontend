import { useEffect, useRef, useState } from 'react';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { AgEllipsis } from '../../agency/home/agencyHomeIcons.jsx';

const log = debug('AdminWorkTable');

/*
 * AdminWorkTable — the work-queue table of the staff home (Figma "Table" 1329 x 412, white, 1px #e5e5e5, r16; the agency saved-queries table).
 * Header 62 high on #f1f1f1 (16/24 #959592); rows 88 high with a #f1f1f1 rule; columns 64 (checkbox) · item (321) · status (198) · priority (136) ·
 * waiting (135) · actions (104), gap 40. Item cell: 40 round initials chip + 16/22 600 title + 16/24 #999 sub line. Status pill: its own fill /
 * border / ink per row. Priority: 48 x 6 bar + label (13.5/22 600). Waiting: 16/24 #959592.
 * Props: rows (HOME[role].rows), onOpen(row). Checkboxes are real (row + select-all).
 * ⚠️ ASSUMPTION: the "…" button opens a small menu (Open · Add a note · Reassign · Escalate: the hidden menu frame of the Figma table); only
 * "Open" has a destination (onOpen), the others log the intent.
 */

const GRID =
  'grid grid-cols-[40px_minmax(0,1fr)_minmax(80px,140px)_minmax(96px,136px)_minmax(64px,100px)_40px] items-center gap-x-[clamp(10px,2.3vw,40px)] px-[clamp(12px,2vw,24px)] xl:grid-cols-[64px_minmax(0,321px)_198px_136px_135px_104px] xl:justify-center';

/* Figma "Input" checkbox: 16 x 16, white, 1px #d6d1c2, r4 (the native box is replaced so the border matches; checked = brand green + tick). */
const CHECKBOX =
  "size-[16px] shrink-0 cursor-pointer appearance-none rounded-[4px] border border-solid border-[#d6d1c2] bg-white bg-center bg-no-repeat checked:border-[#387440] checked:bg-[#387440] checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 8.5l2.6 2.6L12 5.6%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]";

const MENU = ['Open', 'Add a note', 'Reassign', 'Escalate'];

const RowMenu = ({ row, onOpen }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);
  const pick = (label) => {
    log('row action', { label, row: row.title });
    setOpen(false);
    if (label === 'Open') onOpen?.(row);
  };
  return (
    <div ref={ref} className="relative flex justify-center">
      <button
        type="button"
        aria-label={`Actions for ${row.title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[28px] min-w-[32px] cursor-pointer items-center justify-center rounded-[8px] border-0 bg-transparent text-[#9a988f] hover:bg-[#f1f1f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
      >
        <AgEllipsis className="h-[4px] w-[16px]" />
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute top-[34px] right-0 z-20 m-0 flex w-[168px] list-none flex-col gap-[2px] rounded-[12px] border border-solid border-[#e5e5e5] bg-white p-[6px] shadow-[0_2px_4px_rgba(15,15,10,0.06),0_12px_28px_-6px_rgba(15,15,10,0.12)]"
        >
          {MENU.map((label) => (
            <li key={label} role="none">
              <button
                type="button"
                role="menuitem"
                onClick={() => pick(label)}
                className={classNames(
                  'flex h-[36px] w-full cursor-pointer items-center rounded-[8px] border-0 bg-transparent px-[10px] text-left font-sans text-[14px] leading-[20px] hover:bg-[#f3f8f4] focus-visible:outline-2 focus-visible:outline-[#387440]',
                  label === 'Escalate' ? 'text-[#c0392b]' : 'text-[#737373]'
                )}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const AdminWorkTable = ({ rows, label = 'Work queue', onOpen, className }) => {
  const [selected, setSelected] = useState([]);
  const all = selected.length === rows.length && rows.length > 0;
  const toggle = (id) => {
    log('select', { id });
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  return (
    <div
      role="table"
      aria-label={label}
      className={classNames(
        'rounded-[16px] border border-solid border-[#e5e5e5] bg-white font-sans',
        className
      )}
    >
      <div role="rowgroup">
        <div
          role="row"
          className={classNames(
            GRID,
            'h-[62px] rounded-t-[16px] bg-[#f1f1f1] text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]'
          )}
        >
          <div role="columnheader" className="flex justify-center">
            <input
              type="checkbox"
              aria-label="Select all items"
              checked={all}
              onChange={() => setSelected(all ? [] : rows.map((r) => r.title))}
              className={CHECKBOX}
            />
          </div>
          <div role="columnheader" className="xl:pl-[16px]">
            Item
          </div>
          <div role="columnheader" className="xl:pl-[16px]">
            Status
          </div>
          <div role="columnheader" className="xl:pl-[16px]">
            Priority
          </div>
          <div role="columnheader" className="xl:pl-[16px]">
            Waiting
          </div>
          <div role="columnheader" className="text-center">
            Actions
          </div>
        </div>
      </div>
      <div role="rowgroup">
        {rows.map((r) => (
          <div
            key={r.title}
            role="row"
            className={classNames(
              GRID,
              'min-h-[88px] border-t border-solid border-[#f1f1f1] py-[8px]'
            )}
          >
            <div role="cell" className="flex justify-center">
              <input
                type="checkbox"
                aria-label={`Select ${r.title}`}
                checked={selected.includes(r.title)}
                onChange={() => toggle(r.title)}
                className={CHECKBOX}
              />
            </div>
            <div role="cell" className="flex min-w-0 items-center gap-[12px] xl:pl-[16px]">
              <span
                style={{ backgroundColor: r.chipbg, color: r.chipink }}
                className="grid size-[40px] shrink-0 place-items-center rounded-full text-[14px] leading-[20px] font-bold"
              >
                {r.initials}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[16px] leading-[22px] font-semibold text-[#1c2a21]">
                  {r.title}
                </span>
                <span className="truncate text-[16px] leading-[24px] tracking-[0.2px] text-[#999999]">
                  {r.sub}
                </span>
              </span>
            </div>
            <div role="cell" className="xl:pl-[16px]">
              <span
                style={{
                  backgroundColor: r.pillfill,
                  borderColor: r.pillstroke,
                  color: r.pillink,
                }}
                className="inline-flex rounded-full border border-solid px-[12px] py-[5px] text-[16px] leading-[24px] tracking-[0.2px] whitespace-nowrap"
              >
                {r.status}
              </span>
            </div>
            <div role="cell" className="flex items-center gap-[8px] xl:pl-[16px]">
              <span
                aria-hidden="true"
                className="h-[6px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#eae8e2]"
              >
                <span
                  className="block h-full"
                  style={{ width: `${Math.round(r.barw * 100)}%`, backgroundColor: r.barfill }}
                />
              </span>
              <span
                style={{ color: r.prioink }}
                className="text-[13.5px] leading-[22px] font-semibold"
              >
                {r.prio}
              </span>
            </div>
            <div
              role="cell"
              className="text-[16px] leading-[24px] tracking-[0.2px] text-[#959592] xl:pl-[16px]"
            >
              {r.wait}
            </div>
            <RowMenu row={r} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWorkTable;
