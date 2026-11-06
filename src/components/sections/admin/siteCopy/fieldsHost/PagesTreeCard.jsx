import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { ChevronDownIcon, ChevronRightIcon } from '../fields/FieldsIcons.jsx';
import TreeStatusChip from './TreeStatusChip.jsx';
import { PAGES_COUNT, PAGES_TITLE } from './pagesTreeData.js';

const log = debug('PagesTreeCard');

/*
 * PagesTreeCard — the "Pages" card of the Site copy editor (Figma "Pages" 420 wide, white, r20, ring ink 10 %, 16 padding, 6 gap): head "Pages" 13 / 700 + "46 pages",
 * then one row per page (chevron, name 15 / 600, status chip); the open page sits on #f8f8f4 (r12) and lists its sections as cards (name 14 / 500 + chip, preview line
 * 12.5), the selected section white with a 1.5 px green ring. Sections are links (`hrefFor(sectionId)`); a page head toggles open / closed.
 * Props: pages, openPageId (initially open page), selectedId, outlinedIds (extra green rings, drawn in 7.8.10f / g), statusOverrides ({ [id]: status }), hrefFor(sectionId).
 * Below lg the card is full width above the editor.
 */
const PagesTreeCard = ({
  pages,
  openPageId = 'home',
  selectedId,
  outlinedIds = [],
  statusOverrides = {},
  hrefFor,
}) => {
  const [open, setOpen] = useState(openPageId);
  return (
    <section
      aria-label={PAGES_TITLE}
      className="flex w-[420px] shrink-0 flex-col gap-[6px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] max-lg:w-full"
    >
      <div className="flex items-center gap-[8px] px-[4px] pt-[4px] pb-[8px]">
        <h2 className="m-0 flex-1 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
          {PAGES_TITLE}
        </h2>
        <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
          {PAGES_COUNT}
        </span>
      </div>
      {pages.map((page) => {
        const isOpen = open === page.id;
        const pageStatus = statusOverrides[page.id] ?? page.status;
        return (
          <div
            key={page.id}
            className={classNames('flex flex-col rounded-[12px]', isOpen && 'bg-[#f8f8f4]')}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                log('toggle page', page.id, !isOpen);
                setOpen(isOpen ? null : page.id);
              }}
              className="flex min-h-[54px] w-full cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent px-[12px] py-[11px] text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]"
            >
              {isOpen ? (
                <ChevronDownIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
              ) : (
                <ChevronRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
              )}
              <span className="min-w-0 flex-1 truncate font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
                {page.title}
              </span>
              <TreeStatusChip status={pageStatus} />
            </button>
            {isOpen && page.sections.length ? (
              <ul className="m-0 flex list-none flex-col gap-[2px] pr-[8px] pb-[10px] pl-[34px] max-sm:pl-[12px]">
                {page.sections.map((s) => {
                  const on = s.id === selectedId;
                  const ring = on || outlinedIds.includes(s.id);
                  return (
                    <li key={s.id}>
                      <Link
                        to={hrefFor(s.id)}
                        aria-current={on ? 'page' : undefined}
                        onClick={() => log('section', s.id)}
                        className={classNames(
                          'flex flex-col gap-[2px] rounded-[10px] px-[10px] py-[8px] no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#387440]',
                          ring
                            ? 'border-[1.5px] border-solid border-[#387440] bg-white'
                            : 'border-[1.5px] border-solid border-transparent hover:bg-white/60'
                        )}
                      >
                        <span className="flex min-h-[32px] items-center gap-[8px]">
                          <span
                            className={classNames(
                              'min-w-0 flex-1 truncate font-sans text-[14px] leading-[17px] text-[#1c2a21]',
                              on ? 'font-semibold' : 'font-medium'
                            )}
                          >
                            {s.name}
                          </span>
                          <TreeStatusChip status={statusOverrides[s.id] ?? s.status} />
                        </span>
                        <span className="truncate font-sans text-[12.5px] leading-[15px] text-[#575755]">
                          {s.line}
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

export default PagesTreeCard;
