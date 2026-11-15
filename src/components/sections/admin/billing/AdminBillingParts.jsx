import { classNames } from '../../../../utils/classNames.js';
import { INVOICE_STATUS } from '../../../../services/billing.api.js';

/*
 * AdminBillingParts — small pieces shared by the staff Billing and AI usage pages (/admin/billing, /admin/ai-usage).
 *   BillingTable  a read-only table inside a PublicCard from md up; below md each row is a stacked card (first cell as its
 *                 title, the other cells as label / value pairs), so amounts never hide behind a sideways scroll.
 *                 Rows with onOpen are buttons (Enter / Space / click) and show as selected.
 *                 Props: label (accessible name), columns [string], numeric [column indexes, right aligned],
 *                        rows [{ id, cells [node], onOpen?, selected? }]
 *   StatusChip    invoice status in words and colour (Due · Paid · Cancelled · Written off).
 *   Tabs          pill tabs (aria-pressed buttons). Props: label, value, options [{ id, label }], onChange(id).
 */

const openKeys = (r) => (e) => {
  if (r.onOpen && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    r.onOpen();
  }
};

export const BillingTable = (props) => (
  <>
    <BillingCards {...props} />
    <BillingWideTable {...props} />
  </>
);

const BillingCards = ({ label, columns, rows }) => (
  <ul aria-label={label} className="m-0 flex list-none flex-col gap-[8px] p-0 md:hidden">
    {rows.map((r) => (
      <li
        key={r.id}
        role={r.onOpen ? 'button' : undefined}
        tabIndex={r.onOpen ? 0 : undefined}
        aria-pressed={r.onOpen ? Boolean(r.selected) : undefined}
        onClick={r.onOpen}
        onKeyDown={openKeys(r)}
        className={classNames(
          'flex flex-col gap-[6px] rounded-[14px] border border-solid border-[#e7e7e7] px-[12px] py-[10px] font-sans text-[13.5px]',
          r.onOpen && 'cursor-pointer focus-visible:outline-2 focus-visible:outline-[#387440]',
          r.selected ? 'bg-[#eef5ef]' : 'bg-white'
        )}
      >
        <div className="min-w-0 break-words text-[#1c2a21]">{r.cells[0]}</div>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-[12px] gap-y-[3px]">
          {r.cells.slice(1).map((cell, i) => (
            <div key={columns[i + 1]} className="contents">
              <dt className="text-[12px] font-semibold tracking-[0.3px] text-[#737373] uppercase">
                {columns[i + 1]}
              </dt>
              <dd className="m-0 min-w-0 text-right text-[#1c2a21]">{cell}</dd>
            </div>
          ))}
        </dl>
      </li>
    ))}
  </ul>
);

const BillingWideTable = ({ label, columns, numeric = [], rows }) => (
  <div className="-mx-[4px] hidden max-w-full overflow-x-auto px-[4px] md:block">
    <table
      aria-label={label}
      className="w-full min-w-[560px] border-collapse font-sans text-[13.5px]"
    >
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th
              key={c}
              scope="col"
              className={classNames(
                'border-b border-solid border-[#e7e7e7] px-[8px] py-[8px] text-[12px] font-semibold tracking-[0.4px] whitespace-nowrap text-[#595959] uppercase',
                numeric.includes(i) ? 'text-right' : 'text-left'
              )}
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={r.id}
            tabIndex={r.onOpen ? 0 : undefined}
            aria-selected={r.onOpen ? Boolean(r.selected) : undefined}
            onClick={r.onOpen}
            onKeyDown={openKeys(r)}
            className={classNames(
              r.onOpen &&
                'cursor-pointer hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-[#387440]',
              r.selected && 'bg-[#eef5ef]'
            )}
          >
            {r.cells.map((cell, i) => (
              <td
                key={i}
                className={classNames(
                  'max-w-[320px] border-b border-solid border-[#f2f2f2] px-[8px] py-[9px] align-middle text-[#1c2a21]',
                  numeric.includes(i) ? 'text-right whitespace-nowrap' : 'text-left'
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const StatusChip = ({ status }) => {
  const s = INVOICE_STATUS[status] || { label: status || 'Unknown', color: '#575755' };
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-full border border-solid border-[#e7e7e7] bg-white px-[8px] py-[2px] text-[12px] font-semibold whitespace-nowrap"
      style={{ color: s.color }}
    >
      <span
        aria-hidden="true"
        className="h-[7px] w-[7px] rounded-full"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
};

export const Tabs = ({ label, value, options, onChange }) => (
  <div role="group" aria-label={label} className="flex flex-wrap gap-[8px]">
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        aria-pressed={o.id === value}
        onClick={() => onChange(o.id)}
        className={classNames(
          'h-[34px] cursor-pointer rounded-full border border-solid px-[14px] font-sans text-[13px] font-semibold',
          o.id === value
            ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
            : 'border-[#e1eae2] bg-white text-[#595959]'
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);
