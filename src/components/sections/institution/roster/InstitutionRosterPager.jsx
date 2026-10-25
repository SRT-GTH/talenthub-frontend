import { classNames } from '../../../../utils/classNames.js';

/*
 * InstitutionRosterPager — "Showing 1 to 6 of 11 students" + Previous · 1 · 2 · Next (Figma "Pagination" 8585:269, 1329 x 68, white, 1px #e5e5e5, r16, p 16/24; used by the home table
 * and, ⚠️ ASSUMPTION (not drawn on the roster), under the roster list when more rows match than fit one page). Buttons 34 / 32 high: Previous / Next white shelf (16/24 700),
 * the current page the solid green 31 x 32 button (13.5/24 700 white), the others white shelf.
 * Props: page, pages, from, to, total, noun ('students'), onPage(n), className.
 */
const shelf =
  'inline-flex cursor-pointer items-center justify-center rounded-[14px] border-2 border-solid border-[#1c2a21]/30 bg-white font-sans font-bold tracking-[0.1px] text-[#1c2a21] shadow-[0_4px_0_rgba(17,17,17,0.25)] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440] active:translate-y-[3px] active:shadow-[0_1px_0_rgba(17,17,17,0.25)] disabled:cursor-not-allowed disabled:opacity-50';

const InstitutionRosterPager = ({
  page,
  pages,
  from,
  to,
  total,
  noun = 'students',
  onPage,
  className,
}) => (
  <nav
    aria-label="Pagination"
    className={classNames(
      'flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white px-[24px] py-[16px] font-sans',
      className
    )}
  >
    <p
      aria-live="polite"
      className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]"
    >
      Showing {from} to {to} of {total} {noun}
    </p>
    <div className="flex items-center gap-[8px]">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
        className={classNames(shelf, 'h-[34px] px-[12px] text-[16px] leading-[24px]')}
      >
        Previous
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Page ${n}`}
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onPage(n)}
          className={classNames(
            'h-[32px] min-w-[31px] px-[12px] text-[13.5px] leading-[24px]',
            n === page
              ? 'inline-flex cursor-pointer items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] font-bold text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]'
              : shelf
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
        className={classNames(shelf, 'h-[34px] px-[12px] text-[16px] leading-[24px]')}
      >
        Next
      </button>
    </div>
  </nav>
);

export default InstitutionRosterPager;
