import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';
import { DistrictsPagerNextIcon, DistrictsPagerPrevIcon } from './districtsIcons.jsx';

const log = debug('DistrictsPager');

/*
 * DistrictsPager — "pager" (Figma 9394:20053, 1327x64, px28 pt16 pb12, gap 8): "Showing 1–12 of 248" 14/17 500 #595959 on the left; on the right
 * prev chevron · pages · next chevron, each 36x36 r10, 1px #e7e7e7 white, 14/17 600 #1c2a21; the current page is solid #1c2a21 with white text.
 * Pages read "1 2 3 … 21" at the start; elsewhere "1 … 4 5 6 … 21" (⚠️ ASSUMPTION: only the first state is drawn). The "…" is not a button.
 * Props: page, pages, from, to, total, onPage(n). Prev / next are disabled at the ends. Nothing renders when there are no results.
 */

const pageList = (page, pages) => {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, '…', pages];
  if (page >= pages - 2) return [1, '…', pages - 2, pages - 1, pages];
  return [1, '…', page - 1, page, page + 1, '…', pages];
};

const BOX =
  'inline-flex size-[36px] shrink-0 items-center justify-center rounded-[10px] border border-solid font-sans text-[14px] leading-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';

const DistrictsPager = ({ page, pages, from, to, total, onPage }) => {
  if (!total) return null;
  const go = (n) => {
    log('page', n);
    onPage(n);
  };
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-x-[8px] gap-y-[10px] px-[16px] pt-[16px] pb-[12px] font-sans lg:px-[28px]"
    >
      <p
        aria-live="polite"
        className="m-0 text-[14px] leading-[17px] font-medium text-[#595959] max-lg:text-[13px]"
      >
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-[8px]">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
          className={classNames(
            BOX,
            'cursor-pointer border-[#e7e7e7] bg-white text-[#387440] disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <DistrictsPagerPrevIcon className="size-[18px]" />
        </button>
        {pageList(page, pages).map((p, i) =>
          p === '…' ? (
            <span
              key={`gap-${i}`}
              aria-hidden="true"
              className={classNames(BOX, 'border-[#e7e7e7] bg-white text-[#1c2a21]')}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => go(p)}
              className={classNames(
                BOX,
                'cursor-pointer',
                p === page
                  ? 'border-[#1c2a21] bg-[#1c2a21] text-white'
                  : 'border-[#e7e7e7] bg-white text-[#1c2a21] hover:bg-[#f8f8f4]'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => go(page + 1)}
          className={classNames(
            BOX,
            'cursor-pointer border-[#e7e7e7] bg-white text-[#387440] disabled:cursor-not-allowed disabled:opacity-40'
          )}
        >
          <DistrictsPagerNextIcon className="size-[18px]" />
        </button>
      </div>
    </nav>
  );
};

export default DistrictsPager;
