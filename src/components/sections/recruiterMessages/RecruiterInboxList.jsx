import { classNames } from '../../../utils/classNames.js';
import {
  ARCHIVE_SEARCH_PLACEHOLDER,
  EMPTY,
  SEARCH_PLACEHOLDER,
  TABS,
} from './recruiterInboxData.js';
import { Avatar, EmptyTile, InboxGlyph, StageChip } from './recruiterInboxParts.jsx';

/*
 * RecruiterInboxList — the left panel of the recruiter inbox (Figma R-MSG-01 10124:24387, 371 wide, white, r24, 1px #1c2a21/10, pad 28/22, gap 24).
 * Inbox mode: search field (274x45, r8) + archive button (45x45, r10) → tabs (All / Unread / Applicants + gold count) → rows.
 * Archived mode (R-MSG-05 / -07): back button + "Archived · N conversations" → "Search archive..." → rows with a restore button.
 * Rows: the open one is a white r16 card with a soft shadow; the others are 100px rows split by 1px #ebf1ec rules.
 * Props: archived, items, counts, tab, onTab, selectedId, onOpen, onArchiveToggle (open archive / back), onRestore(id), emptyKind ('inbox' | 'applicants' | 'archive' | null), onEmptyAction, className.
 */
const Row = ({ item, selected, archived, onOpen, onRestore }) => (
  <li className="flex flex-col">
    <div
      className={classNames(
        'relative flex items-start gap-[12px] text-left',
        selected
          ? 'rounded-[16px] border border-solid border-[#1c2a21]/10 bg-white px-[10px] py-[14px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)]'
          : 'px-0 py-[12px]'
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(item.id)}
        aria-current={selected ? 'true' : undefined}
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-[12px] border-0 bg-transparent p-0 text-left"
      >
        <Avatar conversation={item} />
        <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
          <span className="flex items-center justify-between gap-[10px]">
            <span className="truncate font-sans text-[14px] leading-[17px] font-semibold text-[#1c2a21]">
              {item.name}
            </span>
            <span className="shrink-0 font-sans text-[13px] leading-[16px] text-[#737373]">
              {item.time}
            </span>
          </span>
          <span className="flex items-center justify-between gap-[10px]">
            <span
              className={classNames(
                'truncate font-sans leading-[19px] text-[#595959]',
                selected ? 'text-[13.5px] text-[#737373]' : 'text-[14px]'
              )}
            >
              {item.preview}
            </span>
            {item.unread ? (
              <span className="grid h-[19px] min-w-[19px] shrink-0 place-items-center rounded-full bg-[#387440] px-[5px] font-sans text-[11px] leading-[13px] font-medium text-white">
                {item.unread}
              </span>
            ) : null}
          </span>
          <StageChip stage={item.stage} job={item.job} />
        </span>
      </button>
      {archived ? (
        <button
          type="button"
          aria-label={`Move ${item.name} back to inbox`}
          onClick={() => onRestore(item.id)}
          className="absolute top-[34px] right-[2px] flex size-[28px] cursor-pointer items-center justify-center rounded-[8px] border-0 bg-transparent p-0 hover:bg-[#f6f6f6]"
        >
          <InboxGlyph name="archive-restore" className="size-[14px]" />
        </button>
      ) : null}
    </div>
  </li>
);

const EmptyBlock = ({ kind, onAction }) => {
  const copy = EMPTY[kind];
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[12px] px-[8px] pb-[80px] text-center">
      <EmptyTile name={copy.icon} />
      <h2 className="m-0 font-heading text-[24px] leading-[29px] font-semibold tracking-[-0.48px] text-[#111]">
        {copy.title}
      </h2>
      <p className="m-0 font-sans text-[14px] leading-[21px] text-[#575755]">{copy.body}</p>
      {copy.action ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-[4px] inline-flex h-[36px] cursor-pointer items-center rounded-[10px] border-2 border-solid border-[#2a5730] bg-[#387440] px-[16px] font-sans text-[14px] leading-[20px] font-semibold text-white shadow-[0_3px_0_#2a5730]"
        >
          {copy.action}
        </button>
      ) : null}
    </div>
  );
};

const RecruiterInboxList = ({
  archived,
  items,
  counts,
  tab,
  onTab,
  selectedId,
  onOpen,
  onArchiveToggle,
  onRestore,
  emptyKind,
  onEmptyAction,
  className,
}) => (
  <aside
    className={classNames(
      'flex h-full w-full shrink-0 flex-col gap-[24px] rounded-[24px] border border-solid border-[#1c2a21]/10 bg-white px-[22px] py-[28px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_2px_8px_rgba(28,42,33,0.04)] lg:w-[28%] lg:min-w-[300px] lg:max-w-[371px]',
      className
    )}
  >
    {archived ? (
      <div className="flex items-center gap-[12px]">
        <button
          type="button"
          aria-label="Back to inbox"
          onClick={onArchiveToggle}
          className="flex size-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0"
        >
          <InboxGlyph name="undo-back" className="size-[18px]" />
        </button>
        <div className="flex flex-col">
          <span className="font-heading text-[16px] leading-[20px] font-semibold text-[#111]">
            Archived
          </span>
          <span className="font-sans text-[12px] leading-[16px] text-[#575755]">
            {items.length} conversations
          </span>
        </div>
      </div>
    ) : null}

    <div className="flex items-center gap-[8px]">
      <label className="flex h-[45px] min-w-0 flex-1 items-center gap-[8px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white pr-[12px] pl-[8px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
        <span className="sr-only">
          {archived ? ARCHIVE_SEARCH_PLACEHOLDER : SEARCH_PLACEHOLDER}
        </span>
        <InboxGlyph name="search" className="size-[28px] shrink-0" />
        <input
          type="search"
          placeholder={archived ? ARCHIVE_SEARCH_PLACEHOLDER : SEARCH_PLACEHOLDER}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#111] outline-none placeholder:text-[#bfbfbf]"
        />
      </label>
      {archived ? null : (
        <button
          type="button"
          aria-label="Archived conversations"
          onClick={onArchiveToggle}
          className="flex size-[45px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#dbded9] bg-white p-0"
        >
          <InboxGlyph name="archive" className="size-[18px]" />
        </button>
      )}
    </div>

    {archived ? null : (
      <div
        role="tablist"
        aria-label="Inbox filter"
        className="flex flex-wrap items-center gap-[6px]"
      >
        {TABS.map((item) => {
          const active = item.id === tab;
          const count = counts[item.id];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTab(item.id)}
              className={classNames(
                'inline-flex h-[33px] cursor-pointer items-center gap-[5px] rounded-full border border-solid px-[14px] font-sans text-[14px] leading-[24px] font-semibold tracking-[0.24px] whitespace-nowrap',
                active
                  ? 'border-[#1c2a21]/12 bg-[#1c2a21] text-white'
                  : 'border-[#e1eae2] bg-white text-[#595959]'
              )}
            >
              {item.label}
              {item.id === 'applicants' ? (
                <span className="grid h-[22px] min-w-[21px] place-items-center rounded-full bg-[#c8951a] px-[7px] font-sans text-[11.5px] leading-[19px] font-bold text-white">
                  {count}
                </span>
              ) : (
                <span>{count}</span>
              )}
            </button>
          );
        })}
      </div>
    )}

    {emptyKind ? (
      <EmptyBlock kind={emptyKind} onAction={onEmptyAction} />
    ) : (
      <ul className="m-0 flex min-h-0 flex-1 list-none flex-col overflow-y-auto p-0">
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          const previous = items[index - 1];
          const rule = index > 0 && !selected && previous?.id !== selectedId;
          return (
            <div key={item.id} className="contents">
              {rule ? (
                <li aria-hidden="true" className="h-px w-full shrink-0 bg-[#ebf1ec]" />
              ) : null}
              <Row
                item={item}
                selected={selected}
                archived={archived}
                onOpen={onOpen}
                onRestore={onRestore}
              />
            </div>
          );
        })}
      </ul>
    )}
  </aside>
);

export default RecruiterInboxList;
