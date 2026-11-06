import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { copyAccess } from '../copyAccess.js';
import FieldChip from '../fields/FieldChip.jsx';
import { CheckIcon } from '../fields/FieldsIcons.jsx';
import { MATRIX_COLUMNS, MATRIX_ROWS, ROLES_CARD, SITE_CONTENT } from './settingsMockData.js';

const log = debug('RolesMatrixCard');

/*
 * RolesMatrixCard — "Roles and permissions" card of Settings → Roles (Figma 7.8.7a): the permission matrix with the new "Content Editor" column (#2a5730 label) and the
 * "SITE CONTENT · NEW" group (chip "Added 1 Nov 2026": Read / Edit / Publish site copy, Rename product names with "Draft only" for the Content Editor).
 * The site content cells are DRIVEN BY `COPY_PERMISSIONS` (siteCopy/copyAccess.js); the seven existing rows are fixed as drawn. Cells are checkboxes (22 px, r6: on = #387440 + white
 * check, off = white with a 10 % ring); toggling is local (⚠️ ASSUMPTION: mock, nothing is stored; "Save changes" lives in the screen). The matrix scrolls inside the card below lg.
 * Props: cells ({ [`${rowId}:${colId}`]: boolean }), onToggle(rowId, colId, next).
 */
const COLS = 'grid-cols-[minmax(240px,1fr)_repeat(5,96px)]';

const Cell = ({ rowTitle, colLabel, on, onToggle }) => (
  <div className="flex h-[22px] items-center justify-center">
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={`${colLabel}: ${rowTitle}`}
      onClick={onToggle}
      className={classNames(
        'relative flex size-[22px] cursor-pointer items-center justify-center rounded-[6px] p-0 before:absolute before:inset-[-1px] before:content-[""] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
        on ? 'border-0 bg-[#387440] text-white' : 'border border-solid border-[#1c2a21]/10 bg-white'
      )}
    >
      {on ? <CheckIcon className="size-[16px]" /> : null}
    </button>
  </div>
);

const RolesMatrixCard = ({ cells, onToggle }) => {
  const copyCols = MATRIX_COLUMNS;
  const rows = MATRIX_ROWS;
  const renderRow = (row, siteContent) => (
    <div
      key={row.id}
      role="row"
      className={classNames(
        'grid items-center border-t border-solid border-[#1c2a21]/8 py-[12px]',
        COLS
      )}
    >
      <div className="flex min-w-0 flex-col gap-[2px] pr-[12px]">
        <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          {row.title}
        </span>
        <span className="font-sans text-[13px] leading-[16px] text-[#595959]">{row.text}</span>
      </div>
      {copyCols.map((col) => {
        const isDraftOnly =
          siteContent &&
          row.id === 'rename' &&
          col.id === 'editor' &&
          copyAccess('editor').renameDraft;
        return (
          <div key={col.id} role="cell" className="flex items-center justify-center">
            {isDraftOnly ? (
              <FieldChip tone="warn">{SITE_CONTENT.draftOnly}</FieldChip>
            ) : (
              <Cell
                rowTitle={row.title}
                colLabel={col.label}
                on={Boolean(cells[`${row.id}:${col.id}`])}
                onToggle={() => {
                  const next = !cells[`${row.id}:${col.id}`];
                  log('toggle', `${row.id}:${col.id}`, next);
                  onToggle(row.id, col.id, next);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section
      aria-label={ROLES_CARD.title}
      className="flex w-full flex-col gap-[8px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[clamp(14px,1.4vw,24px)]"
    >
      <header className="flex flex-col gap-[4px] pb-[8px]">
        <h2 className="m-0 font-sans text-[19px] leading-[24px] font-semibold tracking-[-0.19px] text-[#1c2a21]">
          {ROLES_CARD.title}
        </h2>
        <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">{ROLES_CARD.sub}</p>
      </header>
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <div
          role="table"
          aria-label="Who can do what"
          className="flex min-w-[760px] flex-col gap-[8px]"
        >
          <div role="row" className={classNames('grid items-center py-[10px]', COLS)}>
            <span
              role="columnheader"
              className="font-sans text-[12.5px] leading-[15px] font-semibold text-[#595959]"
            >
              {ROLES_CARD.permission}
            </span>
            {copyCols.map((col) => (
              <span
                key={col.id}
                role="columnheader"
                className={classNames(
                  'text-center font-sans text-[12.5px] leading-[15px] font-semibold',
                  col.accent ? 'text-[#2a5730]' : 'text-[#595959]'
                )}
              >
                {col.label}
              </span>
            ))}
          </div>
          {rows.map((r) => renderRow(r, false))}
          <div className="flex items-center gap-[8px] pt-[18px] pb-[6px]">
            <span className="font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#2a5730]">
              {SITE_CONTENT.label}
            </span>
            <FieldChip tone="good">{SITE_CONTENT.chip}</FieldChip>
          </div>
          {SITE_CONTENT.rows.map((r) => renderRow(r, true))}
        </div>
      </div>
    </section>
  );
};

export default RolesMatrixCard;
