import { Link } from 'react-router-dom';
import { classNames } from '../../../../../utils/classNames.js';
import { COPY_PATHS, copyUrl } from '../copyUrl.js';
import SyncChip from './SyncChip.jsx';
import { ChevronDownIcon, ChevronRightIcon } from './SyncIcons.jsx';
import { SYNC_COPY } from './releaseSyncData.js';

/*
 * SyncPagesTree — the "Pages" card of the Site copy browse after a release (Figma 7.8.8a-c "Pages": 420 wide, white, r20, 1px ink@.10, 16 padding, 6 gap):
 * a head row ("Pages" 13/700 #575755 · "93 pages" 12.5/500), one 54 px row per page (chevron, name 15/600, status chip) and, for the open page (#f8f8f4, r12),
 * its sections (name 14/500, 12.5/400 summary, chip; the selected one white with a 1.5px #387440 border). Removed sections (7.8.8c) sit under
 * "REMOVED FROM THE PLATFORM" in a "Removed sections (2)" group. A page without drawn sections opens the Site copy browse (⚠️ ASSUMPTION).
 * Props: ctx, view (SYNC_VIEWS entry), open (Set of open page ids), onToggle(pageId), selected (section id), onSelect(sectionId), query.
 */
const CHIP_LABEL = {
  edited: 'Edited',
  new: 'New',
  default: 'Default',
  shared: 'Used on every page',
  removed: 'Removed',
  changed: 'Changed',
};

const matches = (q, ...texts) =>
  !q ||
  texts.some((t) =>
    String(t ?? '')
      .toLowerCase()
      .includes(q)
  );

const Section = ({ s, selected, onSelect }) => (
  <li>
    <button
      type="button"
      onClick={() => onSelect(s.id)}
      aria-label={`${s.name}, ${CHIP_LABEL[s.chip]}. ${s.sub}`}
      aria-current={selected ? 'true' : undefined}
      className={classNames(
        'flex w-full cursor-pointer flex-col gap-[2px] rounded-[10px] border-solid px-[10px] py-[8px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
        selected
          ? 'border-[1.5px] border-[#387440] bg-white'
          : 'border-[1.5px] border-transparent bg-transparent hover:bg-white/70'
      )}
    >
      <span className="flex min-h-[32px] items-center gap-[8px]">
        <span
          className={classNames(
            'min-w-0 flex-1 font-sans text-[14px] leading-[17px] text-[#1c2a21]',
            selected ? 'font-semibold' : 'font-medium'
          )}
        >
          {s.name}
        </span>
        <SyncChip tone={s.chip} generated />
      </span>
      <span className="font-sans text-[12.5px] leading-[15px] text-[#575755] max-lg:text-[12.5px]">
        {s.sub}
      </span>
    </button>
  </li>
);

const PageRow = ({ ctx, view, page, open, onToggle, selected, onSelect, query }) => {
  const sections = (page.sections ?? []).filter((s) => matches(query, s.name, s.sub, page.name));
  const expandable = Boolean(page.sections);
  const expanded = expandable && open;
  const head = (
    <>
      {expanded ? (
        <ChevronDownIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
      ) : (
        <ChevronRightIcon className="size-[16px] shrink-0 text-[#1c2a21]" />
      )}
      <span className="min-w-0 flex-1 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {page.name}
      </span>
      <SyncChip tone={page.chip} generated>
        {page.label}
      </SyncChip>
    </>
  );
  const headClass =
    'flex min-h-[54px] w-full cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent px-[12px] py-[11px] text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]';
  return (
    <li className={classNames('rounded-[12px]', expanded && 'bg-[#f8f8f4]')}>
      {expandable ? (
        <button
          type="button"
          onClick={() => onToggle(page.id)}
          aria-label={`${page.name}, ${page.label ?? CHIP_LABEL[page.chip]}`}
          aria-expanded={expanded}
          className={headClass}
        >
          {head}
        </button>
      ) : (
        <Link
          to={copyUrl(ctx, COPY_PATHS.siteCopy, { portal: view.portal, page: page.id })}
          className={headClass}
        >
          {head}
        </Link>
      )}
      {expanded ? (
        <ul className="m-0 flex list-none flex-col gap-[2px] p-0 pr-[8px] pb-[10px] pl-[34px] max-sm:pl-[16px]">
          {sections.map((s) => (
            <Section key={s.id} s={s} selected={s.id === selected} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

const SyncPagesTree = ({ ctx, view, open, onToggle, selected, onSelect, query = '' }) => {
  const q = query.trim().toLowerCase();
  const pages = view.pages.filter((p) =>
    matches(q, p.name, ...(p.sections ?? []).flatMap((s) => [s.name, s.sub]))
  );
  const removed = view.removed;
  return (
    <section
      aria-label="Pages"
      className="flex min-w-0 flex-col gap-[6px] self-start rounded-[20px] border border-solid border-[#1c2a21]/10 bg-white p-[16px] lg:w-[420px] lg:shrink-0 max-lg:w-full"
    >
      <div className="flex items-center justify-between gap-[8px] px-[4px] pt-[4px] pb-[8px]">
        <h2 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
          Pages
        </h2>
        <span className="font-sans text-[12.5px] leading-[15px] font-medium text-[#575755]">
          {view.pageCount}
        </span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-[6px] p-0">
        {pages.map((p) => (
          <PageRow
            key={p.id}
            ctx={ctx}
            view={view}
            page={p}
            open={open.has(p.id) || Boolean(q && p.sections)}
            onToggle={onToggle}
            selected={selected}
            onSelect={onSelect}
            query={q}
          />
        ))}
      </ul>
      {removed ? (
        <>
          <div className="flex items-center justify-between gap-[4px] pt-[8px] pr-[4px] pb-[6px] pl-[4px]">
            <h3 className="m-0 font-sans text-[13px] leading-[16px] font-bold tracking-[0.52px] text-[#575755]">
              {SYNC_COPY.removedHead}
            </h3>
            <SyncChip tone="shared" />
          </div>
          <ul className="m-0 list-none p-0">
            <PageRow
              ctx={ctx}
              view={view}
              page={{
                id: 'removed',
                name: removed.name,
                chip: 'removed',
                sections: removed.sections,
              }}
              open={open.has('removed')}
              onToggle={onToggle}
              selected={selected}
              onSelect={onSelect}
              query={q}
            />
          </ul>
        </>
      ) : null}
    </section>
  );
};

export default SyncPagesTree;
