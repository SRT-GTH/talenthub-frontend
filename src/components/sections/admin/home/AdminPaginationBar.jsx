import AgencyButton from '../../agency/AgencyButton.jsx';

/*
 * AdminPaginationBar — the "Pagination" strip under the work table (Figma 1329 x 68, white, 1px #e5e5e5, r16, p 16/24; the agency strip):
 * the summary text (16/24 #959592, e.g. "Showing 1 to 8 of 14 items in your queue") and Previous · page numbers · Next (34 high; the
 * current page is the solid green 31 x 32 button). Props: summary, page (1-based), pages, onPage(n), className. With one page the
 * buttons are hidden.
 */

const AdminPaginationBar = ({ summary, page = 1, pages = 1, onPage, className }) => (
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
    {pages > 1 ? (
      <div className="flex items-center gap-[8px]">
        <AgencyButton
          size="xs"
          disabled={page <= 1}
          onClick={() => onPage?.(page - 1)}
          className="!text-[16px] !font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </AgencyButton>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
          p === page ? (
            <span
              key={p}
              aria-current="page"
              aria-label={`Page ${p}`}
              className="inline-flex h-[32px] min-w-[31px] items-center justify-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[12px] text-[13.5px] leading-[24px] font-bold text-white shadow-[0_4px_0_rgba(17,17,17,0.25)]"
            >
              {p}
            </span>
          ) : (
            <AgencyButton
              key={p}
              size="xs"
              aria-label={`Page ${p}`}
              onClick={() => onPage?.(p)}
              className="!h-[32px] !min-w-[33px] !px-[12px] !text-[13.5px]"
            >
              {p}
            </AgencyButton>
          )
        )}
        <AgencyButton
          size="xs"
          disabled={page >= pages}
          onClick={() => onPage?.(page + 1)}
          className="!text-[16px] !font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </AgencyButton>
      </div>
    ) : null}
  </nav>
);

export default AdminPaginationBar;
