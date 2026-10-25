import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { IhRowDots } from './institutionHomeIcons.jsx';
import { STUDENT_ROWS, STUDENT_TABLE as T } from './data/institutionHomeData.js';

const log = debug('InstitutionStudentTable');

/*
 * InstitutionStudentTable — the four-row student table of the home (Figma "Table" 8585:112, 1329 wide, white, 1px #e5e5e5, r16): header #f1f1f1 (16/24 #959592),
 * rows with a checkbox, a 40 round initials avatar + name 16/22 600 + cohort 16/24 #999, an activity pill (grey / green / red), a readiness bar (48 x 6) with a
 * 13.5/22 600 percentage, "last active" and the "…" action; then the pagination card. Columns follow the Figma cell widths as fractions; below lg every row is a card
 * (avatar and name, then the pill, the bar, the date and the action). The name and the "…" link open the student record
 * (⚠️ ASSUMPTION: no row menu is drawn; the checkboxes only toggle, no selection bar is drawn on the home; only page 1 of the roster is drawn, the pager points at the roster).
 */

const COLS =
  'lg:grid lg:grid-cols-[48px_minmax(0,1.85fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,0.8fr)_88px] xl:grid-cols-[64px_minmax(0,320fr)_minmax(0,198fr)_minmax(0,136fr)_minmax(0,135fr)_104px]';

const PILL = {
  grey: 'border-[#e8e8e4] bg-[#f8f8f4] text-[#737373]',
  green: 'border-[#e1eae2] bg-[#f3f8f4] text-[#2a5730]',
  red: 'border-[#ebc2bd] bg-[#f9ebea] text-[#902b20]',
};

const SHELF_BASE =
  'inline-flex items-center border-2 border-solid font-sans leading-[24px] font-bold tracking-[0.1px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const SHELF =
  'rounded-[14px] border-[#1c2a21]/30 bg-white text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)]';
const SHELF_ON =
  'rounded-[10px] border-[#2a5730] bg-[#387440] text-[#fef1e7] shadow-[0_4px_0_#224626]';

const Check = ({ checked, onChange, label }) => (
  <span className="relative inline-grid size-[16px] shrink-0">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="peer m-0 size-[16px] cursor-pointer appearance-none rounded-[4px] border border-solid border-[#d6d1c2] bg-white checked:border-[#387440] checked:bg-[#387440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
    />
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="pointer-events-none absolute inset-0 hidden size-[16px] peer-checked:block"
    >
      <path
        d="M4 8.5l2.5 2.5L12 5.5"
        fill="none"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const InstitutionStudentTable = ({ students }) => {
  const [picked, setPicked] = useState([]);
  useEffect(() => {
    log('mount', { rows: STUDENT_ROWS.length });
  }, []);
  const all = picked.length === STUDENT_ROWS.length;
  const toggle = (id) => {
    log('toggle', id);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  const toggleAll = () => setPicked(all ? [] : STUDENT_ROWS.map((r) => r.id));
  return (
    <section aria-label="Students" className="flex flex-col gap-[8px]">
      <div
        role="table"
        aria-label="Students"
        className="flex flex-col rounded-[16px] border border-solid border-[#e5e5e5] bg-white"
      >
        <div role="rowgroup" className="hidden lg:block">
          <div
            role="row"
            className={classNames(
              COLS,
              'items-center rounded-t-[16px] border-b border-solid border-[#e5e5e5] bg-[#f1f1f1]'
            )}
          >
            <div role="columnheader" className="flex items-center px-[16px] py-[19px] xl:px-[24px]">
              <Check checked={all} onChange={toggleAll} label="Select all students" />
            </div>
            {T.columns.map((c, i) => (
              <div
                key={c}
                role="columnheader"
                className={classNames(
                  'px-[16px] py-[18px] font-sans text-[16px] leading-[24px] tracking-[0.2px] text-[#959592] max-xl:px-[8px] max-xl:first:pl-[16px]',
                  i === T.columns.length - 1 && 'text-center'
                )}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
        <div role="rowgroup">
          {STUDENT_ROWS.map((r) => (
            <div
              key={r.id}
              role="row"
              className={classNames(
                COLS,
                'flex flex-wrap items-center gap-x-[12px] gap-y-[10px] border-b border-solid border-[#f1f1f1] p-[14px] last:border-b-0 lg:p-0'
              )}
            >
              <div role="cell" className="flex items-center lg:px-[16px] lg:py-[28px] xl:px-[24px]">
                <Check
                  checked={picked.includes(r.id)}
                  onChange={() => toggle(r.id)}
                  label={`Select ${r.name}`}
                />
              </div>
              <div role="cell" className="flex min-w-0 flex-1 items-center gap-[12px] lg:p-[16px]">
                <span
                  aria-hidden="true"
                  style={{ backgroundColor: r.avatar.bg, color: r.avatar.ink }}
                  className="grid size-[40px] shrink-0 place-items-center rounded-full font-sans text-[14px] leading-[20px] font-bold"
                >
                  {r.initials}
                </span>
                <span className="flex min-w-0 flex-col">
                  <Link
                    to={`/institution/students/${r.id}`}
                    className="truncate font-sans text-[16px] leading-[21.6px] font-semibold text-[#1c2a21] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                  >
                    {r.name}
                  </Link>
                  <span className="truncate font-sans text-[clamp(14px,1vw+4px,16px)] leading-[24px] tracking-[0.2px] text-[#999999]">
                    {r.cohort}
                  </span>
                </span>
              </div>
              <div role="cell" className="flex min-w-0 items-center lg:px-[16px] lg:py-[24px]">
                <span
                  className={classNames(
                    'truncate rounded-full border-[1.2px] border-solid px-[10px] py-[6px] font-sans text-[clamp(14px,1vw+4px,16px)] leading-[24px] tracking-[0.2px]',
                    PILL[r.activity.tone]
                  )}
                >
                  {r.activity.label}
                </span>
              </div>
              <div role="cell" className="flex items-center gap-[8px] lg:px-[16px]">
                <span
                  aria-hidden="true"
                  className="h-[6px] w-[48px] shrink-0 overflow-hidden rounded-full bg-[#eae8e2]"
                >
                  <span
                    className="block h-full"
                    style={{ width: `${r.barFill}%`, backgroundColor: r.barColor }}
                  />
                </span>
                <span
                  style={{ color: r.readinessInk }}
                  className="font-sans text-[13.5px] leading-[21.6px] font-semibold"
                >
                  {r.readiness}%
                </span>
              </div>
              <div
                role="cell"
                className="font-sans text-[clamp(14px,1vw+4px,16px)] leading-[24px] tracking-[0.2px] text-[#959592] lg:px-[16px]"
              >
                {r.lastActive}
              </div>
              <div role="cell" className="flex items-center justify-center lg:px-[24px]">
                <Link
                  to={`/institution/students/${r.id}`}
                  aria-label={`More actions for ${r.name}`}
                  className="grid min-h-[24px] min-w-[32px] place-items-center rounded-[8px] p-[8px] text-[#9a988f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                >
                  <IhRowDots className="h-[4px] w-[16px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <nav
        aria-label="Student pages"
        className="flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[12px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white px-[clamp(16px,2vw,25px)] py-[17px]"
      >
        <p className="m-0 font-sans text-[clamp(14px,1vw+4px,16px)] leading-[24px] tracking-[0.2px] text-[#959592]">
          {T.shown.replace('{students}', students)}
        </p>
        <div className="flex flex-wrap items-start gap-[8px]">
          <Link
            to={T.rosterTo}
            aria-disabled="true"
            tabIndex={-1}
            className={classNames(SHELF_BASE, SHELF, 'h-[34px] px-[12px] text-[16px] opacity-60')}
          >
            Previous
          </Link>
          {T.pages.map((n) => (
            <Link
              key={n}
              to={T.rosterTo}
              aria-current={n === 1 ? 'page' : undefined}
              aria-label={`Page ${n}`}
              className={classNames(
                SHELF_BASE,
                n === 1 ? SHELF_ON : SHELF,
                'h-[32px] min-w-[32px] justify-center px-[12px] text-[13.5px]'
              )}
            >
              {n}
            </Link>
          ))}
          <Link
            to={T.rosterTo}
            className={classNames(SHELF_BASE, SHELF, 'h-[34px] px-[12px] text-[16px]')}
          >
            Next
          </Link>
        </div>
      </nav>
    </section>
  );
};

export default InstitutionStudentTable;
