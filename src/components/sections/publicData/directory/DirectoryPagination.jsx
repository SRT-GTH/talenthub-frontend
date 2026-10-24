import { classNames } from '../../../../utils/classNames.js';
import { debug } from '../../../../utils/debug.js';

const log = debug('DirectoryPagination');

/*
 * DirectoryPagination — Figma "pagination" (8498:297): ‹ 1 2 3 … 21 ›; boxes p 8/12, r10, 1px #e7e7e7, 14/17 600 #1c2a21, gap 8;
 * the current page is #387440 with white text. Hidden when there is a single page (Figma 8.6.1c keeps it under 3 results: left out on
 * purpose, reported as a Figma inconsistency). The "…" box is not a control. Desktop and tablet only: phones use "Load more".
 * Props: page, pages, onPage(n), label (nav name), className.
 */

const windowOf = (page, pages) => {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, '…', pages];
  if (page >= pages - 2) return [1, '…', pages - 2, pages - 1, pages];
  return [1, '…', page, '…', pages];
};

const BOX =
  'inline-flex min-h-[35px] min-w-[32px] items-center justify-center rounded-[10px] border border-solid px-[12px] py-[8px] font-sans text-[14px] leading-[17px] font-semibold';
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
const IDLE = 'cursor-pointer border-[#e7e7e7] bg-white text-[#1c2a21]';

const DirectoryPagination = ({ page, pages, onPage, label = 'Pagination', className }) => {
  if (!pages || pages <= 1) return null;
  const go = (n) => {
    log('page', n);
    onPage?.(n);
  };
  return (
    <nav aria-label={label} className={classNames('hidden md:block', className)}>
      <ul className="m-0 flex list-none flex-wrap items-center gap-[8px] p-0">
        <li>
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => go(page - 1)}
            className={classNames(
              BOX,
              FOCUS,
              IDLE,
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            ‹
          </button>
        </li>
        {windowOf(page, pages).map((item, i) => (
          <li key={`${item}-${i}`}>
            {item === '…' ? (
              <span
                aria-hidden="true"
                className={classNames(BOX, 'border-[#e7e7e7] bg-white text-[#1c2a21]')}
              >
                …
              </span>
            ) : (
              <button
                type="button"
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => go(item)}
                className={classNames(
                  BOX,
                  FOCUS,
                  item === page
                    ? 'cursor-pointer border-[#387440] bg-[#387440] text-white'
                    : classNames(IDLE, 'hover:border-[#c1d4c4]')
                )}
              >
                {item}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label="Next page"
            disabled={page >= pages}
            onClick={() => go(page + 1)}
            className={classNames(
              BOX,
              FOCUS,
              IDLE,
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DirectoryPagination;
