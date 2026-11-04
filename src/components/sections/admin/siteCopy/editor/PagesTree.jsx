import { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { debug } from '../../../../../utils/debug.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import CopyStatusChip from './CopyStatusChip.jsx';
import { EditorChevronDownIcon, EditorChevronRightIcon } from './EditorIcons.jsx';
import { PAGES, PAGES_TOTAL } from './sectionEditorData.js';
import { isCopyLive } from '../live/copyLive.js';
import { copyPagesOf } from '../../../../../copy/copyRegistry.js';

/** Live mode: the pages of the current section's portal as the pages declare them; mock: the drawn Public site tree. */
const treeFor = (activeId) => {
  if (!isCopyLive()) return { pages: PAGES, total: PAGES_TOTAL };
  const { pages, shared } = copyPagesOf(String(activeId).split('.')[0]);
  const all = [
    ...pages,
    ...shared.map((p) => ({ ...p, sections: p.sections.map((s) => ({ ...s, status: 'shared' })) })),
  ];
  return { pages: all, total: all.length };
};

const log = debug('PagesTree');

/*
 * PagesTree — the "Pages" card left of the section editor (frame 7.8.2a): 420 wide, white, r20, p16, gap 6, border #1c2a21 at 10 %; header "Pages" 13/700
 * + "46 pages"; each page is a #f8f8f4 r12 group (head: chevron, name 15/600, status chip) and Home is open with its sections (name 14/500 or 14/600
 * when current, status chip, summary 12.5 #575755; the current one white with a 1.5 px #387440 border). A section's chip is "Draft changes (n)" while a
 * draft exists, else "Edited" / "Default"; the shared Footer says "Used on every page". Pages other than Home are drawn collapsed and have no
 * sections drawn (⚠️ ASSUMPTION: their header opens the Site copy list filtered on that page).
 * Props: ctx, activeId (current section id), summaries ({ [sectionId]: the line under a section's name when it is not the default, e.g. the Hero headline draft }), draftCounts ({ [sectionId]: n }), published ({ [sectionId]: {…} }), query (the search box text).
 */
const statusOf = (section, draftCounts, published) => {
  if (section.status === 'shared') return { kind: 'shared' };
  const n = draftCounts[section.id] ?? 0;
  if (n > 0) return { kind: 'draft', count: n };
  if (published[section.id] || section.status === 'edited') return { kind: 'edited' };
  return { kind: 'default' };
};

const PagesTree = ({ ctx, activeId, draftCounts, published, summaries = {}, query = '' }) => {
  const tree = treeFor(activeId);
  const [open, setOpen] = useState(() =>
    Object.fromEntries(
      tree.pages.map((p) => [p.id, p.id === 'home' || p.sections.some((s) => s.id === activeId)])
    )
  );
  const q = query.trim().toLowerCase();

  const pages = tree.pages
    .map((p) => {
      const sections = q
        ? p.sections.filter((s) => `${s.label} ${s.summary}`.toLowerCase().includes(q))
        : p.sections;
      const pageMatch = q && p.label.toLowerCase().includes(q);
      return {
        ...p,
        shown: pageMatch ? p.sections : sections,
        hit: !q || pageMatch || sections.length > 0,
      };
    })
    .filter((p) => p.hit);

  return (
    <section
      aria-label="Pages"
      className="flex min-w-0 flex-col gap-[6px] rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px]"
    >
      <div className="flex items-center gap-[8px] px-[4px] pt-[4px] pb-[8px]">
        <h2 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
          Pages
        </h2>
        <span className="grow" />
        <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755] max-lg:text-[12px]">
          {`${tree.total} ${tree.total === 1 ? 'page' : 'pages'}`}
        </span>
      </div>
      {pages.length === 0 ? (
        <p className="m-0 px-[4px] font-sans text-[13px] leading-[18px] text-[#575755]">
          {`No pages match “${query.trim()}”.`}
        </p>
      ) : null}
      {pages.map((p) => {
        const sum = p.sections.reduce((n, s) => n + (draftCounts[s.id] ?? 0), 0);
        const pageStatus =
          sum > 0
            ? { kind: 'draft', count: sum }
            : { kind: p.status === 'edited' ? 'edited' : 'default' };
        const expandable = p.sections.length > 0;
        const isOpen = expandable && (q ? true : (open[p.id] ?? false));
        const head = (
          <>
            {isOpen ? (
              <EditorChevronDownIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
            ) : (
              <EditorChevronRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
            )}
            <span className="min-w-0 grow truncate text-left font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
              {p.label}
            </span>
            <CopyStatusChip kind={pageStatus.kind} count={pageStatus.count} />
          </>
        );
        return (
          <div
            key={p.id}
            className={classNames('rounded-[12px]', isOpen ? 'bg-[#f8f8f4]' : 'bg-transparent')}
          >
            {expandable ? (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  log('toggle page', p.id);
                  setOpen((o) => ({ ...o, [p.id]: !isOpen }));
                }}
                className="flex min-h-[54px] w-full cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent px-[12px] py-[11px] focus-visible:outline-2 focus-visible:outline-[#387440]"
              >
                {head}
              </button>
            ) : (
              <Link
                to={copyUrl(ctx, COPY_PATHS.siteCopy, { portal: 'public', q: p.label })}
                className="flex min-h-[54px] w-full items-center gap-[10px] rounded-[12px] px-[12px] py-[11px] no-underline focus-visible:outline-2 focus-visible:outline-[#387440]"
              >
                {head}
              </Link>
            )}
            {isOpen ? (
              <ul className="m-0 flex list-none flex-col gap-[2px] p-0 pr-[8px] pb-[10px] pl-[34px] max-sm:pl-[16px]">
                {p.shown.map((s) => {
                  const st = statusOf(s, draftCounts, published);
                  const current = s.id === activeId;
                  return (
                    <li key={s.id}>
                      <Link
                        to={copyUrl(ctx, COPY_PATHS.section(s.id))}
                        aria-current={current ? 'page' : undefined}
                        className={classNames(
                          'flex flex-col gap-[2px] rounded-[10px] border-solid px-[10px] py-[8px] no-underline focus-visible:outline-2 focus-visible:outline-[#387440]',
                          current
                            ? 'border-[1.5px] border-[#387440] bg-white'
                            : 'border-[1.5px] border-transparent hover:bg-white/70'
                        )}
                      >
                        <span className="flex min-h-[32px] items-center gap-[8px]">
                          <span
                            className={classNames(
                              'min-w-0 grow truncate font-sans text-[14px] leading-[17px] text-[#1c2a21]',
                              current ? 'font-semibold' : 'font-medium'
                            )}
                          >
                            {s.label}
                          </span>
                          <CopyStatusChip kind={st.kind} count={st.count} />
                        </span>
                        <span className="font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12px]">
                          {summaries[s.id] ?? s.summary}
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

export default PagesTree;
