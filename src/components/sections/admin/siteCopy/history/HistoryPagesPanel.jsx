import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import CopyChip from '../preview/CopyChip.jsx';
import { PreviewChevronDownIcon, PreviewChevronRightIcon } from '../preview/PreviewIcons.jsx';

const log = debug('HistoryPagesPanel');

/*
 * HistoryPagesPanel — the "Pages" card at the left of the History screen (Figma 7.8.5a: 420 wide, white, r20, p16, gap6): "Pages" / "46 pages", then the pages of the
 * portal, the open one (Home) on #f8f8f4 with its sections (the current one white with a 1.5 px #387440 outline, "Edited" / "Default" / "Used on every page" chips and a
 * summary line). A section opens that section's history; a page without modelled sections searches it in the Site copy browser (⚠️ ASSUMPTION: not drawn).
 * Props: ctx, pages, total, currentId, currentStatus (live status of the current section), query (the toolbar search text).
 */
const CHIP = {
  edited: <CopyChip tone="edited">Edited</CopyChip>,
  default: <CopyChip tone="default">Default</CopyChip>,
  shared: <CopyChip tone="shared">Used on every page</CopyChip>,
};

const HistoryPagesPanel = ({ ctx, pages, total, currentId, currentStatus, query }) => {
  const currentPage = pages.find((p) => p.sections.some((s) => s.id === currentId))?.id;
  const [openPages, setOpenPages] = useState(() => ({ [currentPage]: true }));
  const needle = query.trim().toLowerCase();
  const matches = (s) => !needle || `${s.label} ${s.summary}`.toLowerCase().includes(needle);
  const shown = pages
    .map((p) => ({
      ...p,
      visible: p.sections.filter(matches),
      pageHit: needle && p.label.toLowerCase().includes(needle),
    }))
    .filter((p) => !needle || p.pageHit || p.visible.length);

  return (
    <section
      aria-label="Pages"
      className="flex min-w-0 flex-col gap-[6px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px]"
    >
      <div className="flex items-center justify-between gap-[8px] px-[4px] pt-[4px] pb-[8px]">
        <h2 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
          Pages
        </h2>
        <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">{`${total} pages`}</span>
      </div>
      {shown.length === 0 ? (
        <p
          role="status"
          className="m-0 px-[4px] font-sans text-[14px] leading-[20px] text-[#575755]"
        >
          {`No pages or sections match “${query.trim()}”.`}
        </p>
      ) : null}
      {shown.map((p) => {
        const expandable = p.sections.length > 0;
        const expanded = expandable && (Boolean(needle) || Boolean(openPages[p.id]));
        const head = (
          <>
            {expanded ? (
              <PreviewChevronDownIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
            ) : (
              <PreviewChevronRightIcon className="size-[16px] shrink-0 rotate-180 text-[#1c2a21]" />
            )}
            <span className="min-w-0 flex-1 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {p.label}
            </span>
            {CHIP[p.status]}
          </>
        );
        const headClass =
          'flex min-h-[54px] w-full cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent px-[12px] py-[11px] text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
        return (
          <div key={p.id} className={classNames('rounded-[12px]', expanded ? 'bg-[#f8f8f4]' : '')}>
            {expandable ? (
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => {
                  log('toggle page', p.id);
                  setOpenPages((cur) => ({ ...cur, [p.id]: !cur[p.id] }));
                }}
                className={headClass}
              >
                {head}
              </button>
            ) : (
              <Link
                to={copyUrl(ctx, COPY_PATHS.siteCopy, { portal: 'public', q: p.label })}
                className={headClass}
              >
                {head}
              </Link>
            )}
            {expanded ? (
              <ul className="m-0 flex list-none flex-col gap-[2px] p-0 pr-[8px] pb-[10px] pl-[34px]">
                {p.visible.map((s) => {
                  const current = s.id === currentId;
                  const status = current ? currentStatus : s.status;
                  return (
                    <li key={s.id}>
                      <Link
                        to={copyUrl(ctx, COPY_PATHS.history(s.id))}
                        aria-current={current ? 'page' : undefined}
                        className={classNames(
                          'flex flex-col gap-[2px] rounded-[10px] px-[10px] py-[8px] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                          current
                            ? 'border-[1.5px] border-solid border-[#387440] bg-white'
                            : 'border-[1.5px] border-solid border-transparent'
                        )}
                      >
                        <span className="flex min-h-[32px] items-center gap-[8px]">
                          <span
                            className={classNames(
                              'min-w-0 flex-1 font-sans text-[14px] leading-[17px] text-[#1c2a21]',
                              current ? 'font-semibold' : 'font-medium'
                            )}
                          >
                            {s.label}
                          </span>
                          {CHIP[status]}
                        </span>
                        <span className="font-sans text-[12.5px] leading-[15px] text-[#575755]">
                          {s.summary}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </section>
  );
};

export default HistoryPagesPanel;
