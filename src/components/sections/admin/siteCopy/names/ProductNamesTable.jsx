import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import { CopyEditIcon } from '../siteCopyIcons.jsx';
import NameStatusChip from './NameStatusChip.jsx';
import { NAME_COPY } from './productNamesData.js';

const log = debug('ProductNamesTable');

/*
 * ProductNamesTable — the list of frame 7.8.6a: a white card (r20, 1px ink@.10) with a #f8f8f4 header (NAME · FULL NAME · SHORT NAME · PLURAL ·
 * FORMER NAMES · STATUS) and one 57 px row per name (cells 14/15 px, "—" #575755 when empty), a "Rename" link at the end of each row.
 * A row with a draft is cream #faf4e8 and reads "Career Buddy → Tali" (7.8.6e); a Super Admin sees "Review" and "Draft · drafted by …" (7.8.6g).
 * The table scrolls inside its own card below xl (min 860 px).
 * Props: ctx (screen ctx, for links), rows [{ item, record }], canRename, isSuper, showDraftNames.
 */
const COLUMNS =
  'grid-cols-[minmax(96px,190fr)_minmax(130px,230fr)_minmax(80px,150fr)_minmax(90px,150fr)_minmax(110px,210fr)_minmax(150px,240fr)_minmax(94px,99fr)]';

const Cell = ({ children, className }) => (
  <div role="cell" className={classNames('flex min-w-0 items-center gap-[6px]', className)}>
    {children}
  </div>
);

const Plain = ({ value }) =>
  value ? (
    <span className="font-sans text-[15px] leading-[18px] text-[#1c2a21]">{value}</span>
  ) : (
    <span className="font-sans text-[15px] leading-[18px] text-[#575755]">—</span>
  );

const ProductNamesTable = ({ ctx, rows, canRename, isSuper }) => {
  log('render', { rows: rows.length, canRename, isSuper });
  return (
    <div className="overflow-hidden rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white">
      <div className="overflow-x-auto">
        <div role="table" aria-label={NAME_COPY.title} className="min-w-[860px]">
          <div
            role="row"
            className={classNames('grid gap-x-[0px] bg-[#f8f8f4] px-[20px] py-[14px]', COLUMNS)}
          >
            {NAME_COPY.columns.map((c) => (
              <div
                key={c}
                role="columnheader"
                className="font-sans text-[12px] leading-[14px] font-bold tracking-[0.48px] text-[#575755]"
              >
                {c}
              </div>
            ))}
            <div role="columnheader" aria-label="Actions" />
          </div>
          {rows.map(({ item, record }) => {
            const draft = record?.status === 'draft' ? record.draft : null;
            return (
              <div
                key={item.id}
                role="row"
                className={classNames(
                  'grid items-center gap-x-[0px] border-t border-solid border-[#e7e7e7] px-[20px] py-[16px]',
                  COLUMNS,
                  draft && 'bg-[#faf4e8]'
                )}
              >
                <Cell>
                  <span className="font-sans text-[14px] leading-[17px] font-semibold text-[#575755]">
                    {item.kind}
                  </span>
                </Cell>
                <Cell className="flex-wrap">
                  {draft ? (
                    <>
                      <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#575755]">
                        {item.name}
                      </span>
                      <span className="font-sans text-[15px] leading-[18px] font-semibold whitespace-pre text-[#463409]">
                        {' → '}
                        {draft.name}
                      </span>
                    </>
                  ) : (
                    <span className="font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                      {item.name}
                    </span>
                  )}
                </Cell>
                <Cell>
                  <Plain value={item.short} />
                </Cell>
                <Cell>
                  <Plain value={item.plural} />
                </Cell>
                <Cell>
                  {item.former?.length ? (
                    <span className="font-sans text-[15px] leading-[18px] text-[#1c2a21]">
                      {item.former.join(', ')}
                    </span>
                  ) : (
                    <Plain value="" />
                  )}
                </Cell>
                <Cell>
                  {draft ? (
                    <NameStatusChip tone="draft">
                      {isSuper
                        ? `Draft · drafted by ${record.by}`
                        : 'Draft · waiting for a super admin'}
                    </NameStatusChip>
                  ) : (
                    <NameStatusChip>Live</NameStatusChip>
                  )}
                </Cell>
                <Cell className="justify-end">
                  {canRename ? (
                    <Link
                      to={copyUrl(ctx, `${COPY_PATHS.productNames}/${item.id}`)}
                      aria-label={`${draft && isSuper ? 'Review' : 'Rename'} ${item.name}`}
                      className="inline-flex min-h-[32px] items-center gap-[6px] rounded-[10px] border border-solid border-[#e7e7e7] bg-transparent px-[12px] font-sans text-[13px] leading-[16px] font-semibold text-[#1c2a21] no-underline hover:bg-[#f8f8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
                    >
                      <CopyEditIcon className="size-[14px]" />
                      {draft && isSuper ? 'Review' : 'Rename'}
                    </Link>
                  ) : null}
                </Cell>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductNamesTable;
