import { useState } from 'react';
import AgencyButton from '../AgencyButton.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('AgencyPaginationBar');

/*
 * AgencyPaginationBar — "Pagination" strip under the saved-queries table (Figma 8597:398547, 1329 x 68, white, 1px #e5e5e5, r16, p 16/24):
 * "Showing 1 to 4 of 4 saved queries" (16/24 #959592) and Previous · 1 · Next (34 high; the current page is the solid green 31 x 32 button).
 * Props: total, pageSize (default 4), label. Previous / Next are disabled at the ends. Local state only (the mock list has a single page).
 */

const AgencyPaginationBar = ({ total, pageSize = 4, label = 'saved queries', className }) => {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const go = (p) => {
    log('page', { p });
    setPage(p);
  };
  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white px-[24px] py-[16px] font-sans ${className ?? ''}`}
    >
      <p
        className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]"
        aria-live="polite"
      >
        Showing {from} to {to} of {total} {label}
      </p>
      <div className="flex items-center gap-[8px]">
        <AgencyButton
          size="xs"
          disabled={page <= 1}
          onClick={() => go(page - 1)}
          className="!text-[16px] !font-bold"
        >
          Previous
        </AgencyButton>
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-current={page === i + 1 ? 'page' : undefined}
            aria-label={`Page ${i + 1}`}
            onClick={() => go(i + 1)}
            className="inline-flex h-[32px] min-w-[31px] items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[12px] text-[13.5px] leading-[24px] font-bold text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {i + 1}
          </button>
        ))}
        <AgencyButton
          size="xs"
          disabled={page >= pages}
          onClick={() => go(page + 1)}
          className="!text-[16px] !font-bold"
        >
          Next
        </AgencyButton>
      </div>
    </nav>
  );
};

export default AgencyPaginationBar;
