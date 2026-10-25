import { classNames } from '../../../../utils/classNames.js';
import { AgencyChevronDownIcon } from '../agencyIcons.jsx';

/*
 * DemandTable — the plain table of the Demand & outcomes cards (Figma "table" 8702:741 / 8706:…: header row 12/14 500 #575755 on a 1px #e7e7e7 rule, rows p 11/0 with a
 * 1px #f1f1f1 rule, cells 14/17 400 #1c2a21, the first column 500). Columns: { key, label, align 'left'|'right', width, sortable }. The sorted column header is 600 #1c2a21
 * with the 14px chevron. Rows are rendered by the caller through `renderRow` so every cell goes through formatCount / SuppressedValue.
 * Props: caption (sr-only), columns, sortKey, sortDir, onSort(key), children (the <tr>s). Scrolls horizontally INSIDE the card on narrow widths.
 */

const DemandTable = ({
  caption,
  columns,
  sortKey,
  sortDir = 'desc',
  onSort,
  minWidth = 560,
  children,
}) => (
  <div className="-mx-[2px] overflow-x-auto px-[2px] pb-[2px]">
    <table className="w-full border-collapse font-sans" style={{ minWidth }}>
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr className="border-b border-solid border-[#e7e7e7]">
          {columns.map((c) => {
            const on = c.key === sortKey;
            return (
              <th
                key={c.key}
                scope="col"
                aria-sort={on ? (sortDir === 'desc' ? 'descending' : 'ascending') : undefined}
                style={c.width ? { width: c.width } : undefined}
                className={classNames(
                  'pb-[10px] text-[12px] leading-[14px]',
                  c.align === 'right' ? 'text-right' : 'text-left',
                  on ? 'font-semibold text-[#1c2a21]' : 'font-medium text-[#575755]'
                )}
              >
                {c.sortable && onSort ? (
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className={classNames(
                      'inline-flex min-h-[24px] cursor-pointer items-center gap-[4px] bg-transparent p-0 text-[length:inherit] leading-[inherit] font-[inherit] text-inherit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                      c.align === 'right' && 'flex-row-reverse'
                    )}
                  >
                    <span>{c.label}</span>
                    {on ? (
                      <AgencyChevronDownIcon
                        className={classNames(
                          'size-[14px] text-[#1c2a21]',
                          sortDir === 'asc' && 'rotate-180'
                        )}
                      />
                    ) : null}
                  </button>
                ) : (
                  c.label
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default DemandTable;
