import AgencyButton from '../../agency/AgencyButton.jsx';
import { debug } from '../../../../utils/debug.js';

const log = debug('AdminPaginationBar');

/*
 * AdminPaginationBar — the "Pagination" strip under the work table (Figma 1329 x 68, white, 1px #e5e5e5, r16, p 16/24; the agency strip):
 * the summary text (16/24 #959592, e.g. "Showing 1 to 4 of 14 items in your queue") and Previous · 1 · 2 · 3 · Next (34 high; the current page
 * is the solid green 31 x 32 button). ⚠️ ASSUMPTION: Figma always draws three pages whatever the total, and the mock queue has one page of
 * rows, so the buttons only log the intent. Props: summary (string), className.
 */

const PAGES = [1, 2, 3];

const AdminPaginationBar = ({ summary, className }) => (
  <nav
    aria-label="Pagination"
    className={`flex flex-wrap items-center justify-between gap-[12px] rounded-[16px] border border-solid border-[#e5e5e5] bg-white px-[24px] py-[16px] font-sans ${className ?? ''}`}
  >
    <p
      className="m-0 text-[16px] leading-[24px] tracking-[0.2px] text-[#959592]"
      aria-live="polite"
    >
      {summary}
    </p>
    <div className="flex items-center gap-[8px]">
      <AgencyButton size="xs" onClick={() => log('previous')} className="!text-[16px] !font-bold">
        Previous
      </AgencyButton>
      {PAGES.map((p) =>
        p === 1 ? (
          <button
            key={p}
            type="button"
            aria-current="page"
            aria-label={`Page ${p}`}
            className="inline-flex h-[32px] min-w-[31px] items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[12px] text-[13.5px] leading-[24px] font-bold text-white shadow-[0_4px_0_rgba(17,17,17,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            {p}
          </button>
        ) : (
          <AgencyButton
            key={p}
            size="xs"
            aria-label={`Page ${p}`}
            onClick={() => log('page', p)}
            className="!h-[32px] !min-w-[33px] !px-[12px] !text-[13.5px]"
          >
            {p}
          </AgencyButton>
        )
      )}
      <AgencyButton size="xs" onClick={() => log('next')} className="!text-[16px] !font-bold">
        Next
      </AgencyButton>
    </div>
  </nav>
);

export default AdminPaginationBar;
