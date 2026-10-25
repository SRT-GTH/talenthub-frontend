import { Link } from 'react-router-dom';
import { classNames } from '../../../../utils/classNames.js';
import { MessagesIconMessage, MessagesIconRefresh, MessagesIconSearch } from './messagesIcons.jsx';

/*
 * ThreadList — the left card of Messages (Figma 11.3.3c "Frame 1000002133": 371 wide, white, 1.2px rgba(0,82,43,.1), r24, p 28/22, shadow 0 2 1):
 *   search field (r12, 1.2px #ccc, 13px placeholder "Search messages…") · chips "All (n)" (green when active) + "Drafts (n)" · the refresh icon ·
 *   rows (53px green avatar with initials, title 15/500, day 13 #737373, stat line, a green "01" badge when unread); the open row is a bordered card,
 *   the others are split by 1px #f2f2f2 rules. The empty list (11.3.3g) says "No messages yet · Sent messages and replies show here."
 * Props: threads, activeId, filter ('all' | 'drafts'), counts {all, drafts}, needle, onNeedle, onFilter, onRefresh, onNew, hrefFor(thread).
 * ⚠️ ASSUMPTION: the "New message" icon button beside refresh is not drawn in Figma (only the empty state has a button); without it a school with threads could not start a message.
 */

const Chip = ({ active, children, onClick }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={classNames(
      'inline-flex min-h-[33px] cursor-pointer items-center rounded-full border border-solid border-[#e1eae2] px-[14px] py-[4px] text-[14px] leading-[24px] tracking-[0.24px] shadow-[0_1.2px_3.6px_rgba(0,0,0,0.06)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
      active ? 'bg-[#387440] text-white' : 'bg-white font-medium text-[#737373]'
    )}
  >
    {children}
  </button>
);

const ThreadList = ({
  threads,
  activeId,
  filter,
  counts,
  needle,
  onNeedle,
  onFilter,
  onRefresh,
  onNew,
  hrefFor,
}) => (
  <section
    aria-label="Conversations"
    className="flex min-w-0 flex-col gap-[16px] rounded-[24px] border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[22px] py-[28px] font-sans shadow-[0_2px_1px_rgba(0,0,0,0.04)] xl:h-[845px]"
  >
    <label className="flex h-[45px] shrink-0 items-center gap-[10px] rounded-[12px] border-[1.2px] border-solid border-[#cccccc] bg-white px-[16px] shadow-[0_3px_0_rgba(0,0,0,0.04)] focus-within:border-[#387440]">
      <MessagesIconSearch className="size-[16px] shrink-0 text-[#595959]" />
      <span className="sr-only">Search messages</span>
      <input
        type="search"
        value={needle}
        onChange={(e) => onNeedle(e.target.value)}
        placeholder="Search messages…"
        className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[13px] leading-[24px] tracking-[0.24px] text-[#1c2a21] outline-none placeholder:text-[#999999]"
      />
    </label>
    <div className="flex shrink-0 items-center justify-between gap-[16px]">
      <div role="group" aria-label="Filter messages" className="flex gap-[6px]">
        <Chip active={filter === 'all'} onClick={() => onFilter('all')}>
          <span className="font-semibold">All</span>
          <span className="ml-[4px] font-medium">({counts.all})</span>
        </Chip>
        <Chip active={filter === 'drafts'} onClick={() => onFilter('drafts')}>
          Drafts ({counts.drafts})
        </Chip>
      </div>
      <div className="flex items-center gap-[4px]">
        {onNew ? (
          <button
            type="button"
            aria-label="New message"
            onClick={onNew}
            className="grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
          >
            <MessagesIconMessage className="size-[20px]" />
          </button>
        ) : null}
        <button
          type="button"
          aria-label="Refresh messages"
          onClick={onRefresh}
          className="grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#595959] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]"
        >
          <MessagesIconRefresh className="size-[20px]" />
        </button>
      </div>
    </div>
    {threads.length ? (
      <ul className="m-0 flex min-h-0 list-none flex-col gap-[7px] overflow-y-auto p-0">
        {threads.map((t, i) => {
          const active = t.id === activeId;
          return (
            <li
              key={t.id}
              className={classNames(
                i > 0 && !active && 'border-0 border-t border-solid border-[#f2f2f2]'
              )}
            >
              <Link
                to={hrefFor(t)}
                aria-current={active ? 'true' : undefined}
                className={classNames(
                  'flex items-center gap-[12px] text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#387440]',
                  active
                    ? 'rounded-[12px] border-[1.2px] border-solid border-[#00522b]/10 bg-white px-[10px] py-[14px] shadow-[0_1px_6px_rgba(0,0,0,0.08)]'
                    : 'py-[12px]'
                )}
              >
                <span className="grid size-[53px] shrink-0 place-items-center rounded-full bg-[#387440] text-[18px] leading-[21px] font-semibold text-white">
                  {t.initials}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
                  <span className="flex items-baseline justify-between gap-[10px]">
                    <span className="min-w-0 truncate text-[15px] leading-[18px] font-medium text-[#1c2a21]">
                      {t.title}
                    </span>
                    <span className="shrink-0 text-[13px] leading-[16px] text-[#737373]">
                      {t.when}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-[10px]">
                    <span
                      className={classNames(
                        'flex min-w-0 items-center gap-[6px] truncate text-[14px] leading-[17px] text-[#737373]'
                      )}
                    >
                      {t.draft ? (
                        <span
                          aria-hidden="true"
                          className="size-[6px] shrink-0 rounded-full bg-[#387440]"
                        />
                      ) : null}
                      {t.stat}
                    </span>
                    {t.unread ? (
                      <span className="shrink-0 rounded-full border-[1.2px] border-solid border-[#00522b]/10 bg-[#387440] px-[6px] py-[3px] text-[11px] max-lg:text-[12px] leading-[13px] font-medium text-white">
                        <span className="sr-only">Unread: </span>
                        {t.unread}
                      </span>
                    ) : null}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="flex flex-col items-center gap-[8px] px-[24px] py-[40px] text-center">
        <MessagesIconMessage className="size-[28px] text-[#999999]" />
        <p className="m-0 pt-[8px] text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
          No messages yet
        </p>
        <p className="m-0 text-[13px] leading-[16px] text-[#575755]">
          Sent messages and replies show here.
        </p>
      </div>
    )}
  </section>
);

export default ThreadList;
