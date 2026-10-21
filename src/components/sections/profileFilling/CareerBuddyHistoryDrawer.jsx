import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import Button from '../../ui/Button.jsx';
import {
  BuddyIconBook,
  BuddyIconBriefcase,
  BuddyIconCash,
  BuddyIconClose,
  BuddyIconCompass,
  BuddyIconEdit,
  BuddyIconLink,
  BuddyIconLock,
  BuddyIconMic,
  BuddyIconMore,
  BuddyIconMortarboard,
  BuddyIconPin,
  BuddyIconPlus,
  BuddyIconSearch,
  BuddyIconSparkle,
  BuddyIconTrash,
} from '../../shared/assets.jsx';
import spotNoChatsMatch from '../../../assets/career-buddy/spot-no-chats-match.svg';
import spotNoChatsYet from '../../../assets/career-buddy/spot-no-chats-yet.svg';
import { FOCUS_RING, HelpModal } from '../talentSettings/helpUi.jsx';
import { FILTERS, GROUPS, filterChats, highlightParts, resultSnippet } from './chatHistoryModel.js';

const log = debug('CareerBuddyHistoryDrawer');

/*
 * CareerBuddyHistoryDrawer — the "Your chats" panel of Career Buddy (Figma "CHAT HISTORY & NEW CHAT", Playful 9086:71498 /
 * Focused 9086:77035, 21 Oct 2026; replaces the old right-hand "History" drawer 5132:45345).
 * 340px wide, left edge of the chat pane, over a scrim. Header + close, "New chat", search, filter chips, the chats grouped
 * (Pinned / Today / Yesterday / Previous 7 days / Older), footer note. A row's "..." opens Rename / Pin to top / Delete; Rename edits in
 * place (Enter saves, Esc cancels); Delete asks first (modal). Search swaps the list for matches (highlighted) or "No chats match".
 * Also drawn: the empty history (first time) and the loading skeleton.
 * Focused is the default, Playful via `playful:` variants. Controlled by `open`; chat data comes in as `chats` (see chatHistoryModel.js).
 *
 * Props: open, onClose, chats, loading, onSelect(chat), onNewChat(), onRename(id, title), onTogglePin(id), onDelete(id),
 *        onAskBuddy(query) (the "Ask Buddy about ..." button of the no-results state).
 */

const TOPIC_ICONS = {
  edit: BuddyIconEdit,
  mic: BuddyIconMic,
  compass: BuddyIconCompass,
  link: BuddyIconLink,
  cash: BuddyIconCash,
  sparkle: BuddyIconSparkle,
  book: BuddyIconBook,
  briefcase: BuddyIconBriefcase,
  mortarboard: BuddyIconMortarboard,
};

const HEADING = 'font-sans font-semibold playful:font-heading';

const Highlight = ({ text, query, hitClass }) =>
  highlightParts(text, query).map((p, i) =>
    p.hit ? (
      <span key={i} className={hitClass}>
        {p.text}
      </span>
    ) : (
      <span key={i}>{p.text}</span>
    )
  );

const TopicTile = ({ chat }) => {
  const Icon = TOPIC_ICONS[chat.icon] ?? BuddyIconSparkle;
  return (
    <span
      className={classNames(
        'flex size-[36px] shrink-0 items-center justify-center rounded-[10px] playful:border playful:border-solid playful:border-[#1c2a21]/35',
        chat.pinned ? 'bg-[#fff4d6] text-[#8a6a10]' : 'bg-[#ebf1ec] text-[#387440]',
        chat.active && !chat.pinned && 'bg-white'
      )}
    >
      <Icon className="size-[18px]" />
    </span>
  );
};

const GroupHead = ({ id, label, count }) => (
  <div className="flex items-center gap-[8px] px-[6px] pb-[4px] pt-[12px]">
    {id === 'pinned' ? (
      <>
        <span className="font-sans text-[12px] font-semibold leading-[14px] text-[#737373] playful:hidden">
          {label}
        </span>
        <span className="hidden whitespace-nowrap rounded-[8px] border-[1.2px] border-solid border-[#1c2a21] bg-[#ffd86b] px-[9px] py-[3px] font-sans text-[11px] font-bold uppercase leading-[13px] text-[#1c2a21] shadow-[2px_2px_0_#1c2a21] playful:inline-block">
          {label}
        </span>
      </>
    ) : (
      <span className="font-sans text-[12px] font-semibold leading-[14px] text-[#737373]">
        {label}
      </span>
    )}
    <span className="h-px min-w-0 flex-1 bg-[#e7e7e7]" aria-hidden="true" />
    <span className="font-sans text-[11px] leading-[13px] text-[#9a9a98] max-lg:text-[12px]">
      {count}
    </span>
  </div>
);

const ChatRow = ({ chat, menuOpen, onSelect, onMore }) => (
  <div
    data-chat-id={chat.id}
    className={classNames(
      'group relative flex items-center gap-[10px] rounded-[12px] p-[10px] hover:bg-[#f8f8f4]',
      chat.active &&
        'bg-[#ebf1ec] hover:bg-[#ebf1ec] playful:border playful:border-solid playful:border-[#1c2a21]/35 playful:p-[9px]',
      menuOpen && 'bg-[#f8f8f4]'
    )}
  >
    {chat.active ? (
      <span
        className="absolute left-0 top-[14px] h-[28px] w-[3px] rounded-[2px] bg-[#387440] playful:hidden"
        aria-hidden="true"
      />
    ) : null}
    <button
      type="button"
      onClick={() => onSelect(chat)}
      aria-current={chat.active ? 'true' : undefined}
      className={classNames(
        'flex min-w-0 flex-1 cursor-pointer items-center gap-[10px] rounded-[12px] border-0 bg-transparent p-0 text-left',
        FOCUS_RING
      )}
    >
      <TopicTile chat={chat} />
      <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span
          className={classNames(
            'truncate font-sans text-[14px] leading-[17px] text-[#1c2a21]',
            chat.active ? 'font-semibold' : 'font-medium'
          )}
        >
          {chat.title}
        </span>
        <span className="truncate font-sans text-[12px] leading-[14px] text-[#737373]">
          {chat.preview}
        </span>
      </span>
    </button>
    <span className="flex w-[46px] shrink-0 flex-col items-end gap-[6px] self-start pt-[0px]">
      <span
        className={classNames(
          'whitespace-nowrap font-sans text-[11px] leading-[13px] max-lg:text-[12px]',
          chat.active ? 'font-semibold text-[#387440]' : 'text-[#9a9a98]'
        )}
      >
        {chat.meta}
      </span>
      {chat.active ? (
        <span className="size-[8px] rounded-full bg-[#387440]" aria-hidden="true" />
      ) : null}
      {chat.pinned ? (
        <BuddyIconPin className="size-[14px] text-[#8a6a10] group-hover:hidden" />
      ) : null}
    </span>
    <button
      type="button"
      onClick={(e) => onMore(chat, e.currentTarget)}
      aria-label={`More actions for ${chat.title}`}
      aria-haspopup="menu"
      aria-expanded={menuOpen}
      className={classNames(
        'absolute bottom-[10px] right-[10px] hidden size-[24px] cursor-pointer items-center justify-center rounded-[8px] border border-solid border-[#e7e7e7] bg-white p-[4px] text-[#1c2a21] group-focus-within:flex group-hover:flex playful:border-[#1c2a21]/35',
        menuOpen && 'flex',
        FOCUS_RING
      )}
    >
      <BuddyIconMore className="size-[14px]" />
    </button>
  </div>
);

const ResultRow = ({ chat, query, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(chat)}
    className={classNames(
      'flex w-full cursor-pointer flex-col gap-[2px] rounded-[12px] border border-solid border-transparent bg-transparent py-[10px] pl-[12px] pr-[10px] text-left hover:bg-[#f8f8f4]',
      chat.active && 'bg-[#ebf1ec] hover:bg-[#ebf1ec] playful:border-[#1c2a21]/35',
      FOCUS_RING
    )}
  >
    <span
      className={classNames(
        'font-sans text-[14px] leading-[17px] text-[#1c2a21]',
        chat.active ? 'font-semibold' : 'font-medium'
      )}
    >
      <Highlight text={chat.title} query={query} hitClass="font-bold text-[#387440]" />
    </span>
    <span className="font-sans text-[12px] leading-[14px] text-[#595959]">
      <Highlight
        text={resultSnippet(chat, query)}
        query={query}
        hitClass="font-semibold text-[#387440]"
      />
    </span>
    <span className="font-sans text-[12px] leading-[14px] text-[#737373]">{chat.dateLabel}</span>
  </button>
);

const RenameRow = ({ chat, initialDraft, onSave, onCancel }) => {
  const [draft, setDraft] = useState(initialDraft ?? chat.title);
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  const save = () => {
    const next = draft.trim();
    if (next && next !== chat.title) onSave(next);
    else onCancel();
  };
  return (
    <div className="flex flex-col gap-[6px] rounded-[12px] border-[1.5px] border-solid border-[#387440] bg-white p-[8px]">
      <input
        ref={ref}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            save();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }
        }}
        onBlur={save}
        aria-label="Chat name"
        className="m-0 w-full border-0 bg-transparent p-[2px] font-sans text-[14px] font-medium leading-[17px] text-[#1c2a21] caret-[#387440] outline-none"
      />
      <span className="px-[2px] font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
        Enter to save · Esc to cancel
      </span>
    </div>
  );
};

const MENU_ITEM =
  'flex h-[37px] w-full cursor-pointer items-center gap-[10px] rounded-[10px] border-0 p-[10px] text-left font-sans text-[14px] leading-[17px] hover:bg-[#f8f8f4] font-normal text-[#70706e] playful:font-medium playful:text-[#1c2a21]';

const ActionsMenu = ({ top, chat, onRename, onPin, onDelete }) => (
  <div
    role="menu"
    aria-label={`Actions for ${chat.title}`}
    className="absolute left-[282px] z-30 flex w-[210px] flex-col gap-[8px] rounded-[14px] border border-solid border-[#e7e7e7] bg-white p-[6px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_8px_24px_rgba(28,42,33,0.08)] playful:gap-[2px] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[3px_3px_0_rgba(28,42,33,0.45)] max-lg:left-auto max-lg:right-[16px]"
    style={{ top }}
  >
    <button
      type="button"
      role="menuitem"
      onClick={onRename}
      className={classNames(MENU_ITEM, 'bg-[#f8f8f4]', FOCUS_RING)}
    >
      <BuddyIconEdit className="size-[16px]" />
      Rename
    </button>
    <button
      type="button"
      role="menuitem"
      onClick={onPin}
      className={classNames(MENU_ITEM, FOCUS_RING)}
    >
      <BuddyIconPin className="size-[16px]" />
      Pin to top
    </button>
    <span className="mx-[2px] h-px bg-[#e7e7e7]" aria-hidden="true" />
    <button
      type="button"
      role="menuitem"
      onClick={onDelete}
      className={classNames(MENU_ITEM, 'font-medium !text-[#c0392b]', FOCUS_RING)}
    >
      <BuddyIconTrash className="size-[16px]" />
      Delete
    </button>
  </div>
);

const SKELETON_GROUPS = [
  [210, 170],
  [170, 240, 190],
  [240, 190, 150],
];

const LoadingList = () => (
  <div className="flex flex-col gap-[8px]" role="status" aria-label="Loading your chats">
    {SKELETON_GROUPS.map((rows, g) => (
      <div key={g} className="flex flex-col gap-[8px]">
        <div className="px-[12px] pb-[6px] pt-[12px]">
          <span className="block h-[10px] w-[70px] rounded-[6px] bg-[#eceee9] motion-safe:animate-pulse" />
        </div>
        {rows.map((w, i) => (
          <div key={i} className="flex flex-col gap-[6px] px-[12px] py-[10px]">
            <span
              className="block h-[12px] rounded-[6px] bg-[#eceee9] motion-safe:animate-pulse"
              style={{ width: w }}
            />
            <span className="block h-[9px] w-[110px] rounded-[5px] bg-[#f3f4f1] motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-[8px] text-center">
    <img src={spotNoChatsYet} alt="" className="size-[120px]" draggable="false" />
    <p className={classNames(HEADING, 'm-0 text-[18px] leading-[22px] text-[#1c2a21]')}>
      No chats yet
    </p>
    <p className="m-0 max-w-[250px] font-sans text-[13px] leading-[19px] text-[#595959]">
      Your conversations with Buddy will show up here, so you can pick up where you left off.
    </p>
  </div>
);

const NoResults = ({ query, onAsk }) => (
  <div className="flex min-h-[420px] flex-1 flex-col items-center justify-center gap-[8px] text-center">
    <img src={spotNoChatsMatch} alt="" className="size-[110px]" draggable="false" />
    <p className="m-0 font-sans text-[16px] font-semibold leading-[19px] text-[#1c2a21]">
      No chats match “{query}”
    </p>
    <p className="m-0 max-w-[240px] font-sans text-[13px] leading-[19px] text-[#595959]">
      Try another word, or start a new chat about it.
    </p>
    <Button
      type="button"
      variant="tertiary-subtle"
      size="lg"
      onClick={() => onAsk(query)}
      className="mt-[8px] max-w-full"
    >
      Ask Buddy about “{query}”
    </Button>
  </div>
);

/* Delete-this-chat confirmation (Figma 9086:73789 / 9086:79262): a viewport-centred modal on a 35% black scrim. */
export const DeleteChatModal = ({ chat, onCancel, onConfirm }) => {
  const uid = useId();
  return (
    <HelpModal
      onClose={onCancel}
      labelledBy={`${uid}-t`}
      describedBy={`${uid}-d`}
      scrim="rgba(0,0,0,0.35)"
      cardClassName="max-w-[460px] flex flex-col gap-[16px] rounded-[24px] border border-solid border-[#e7e7e7] bg-white p-[clamp(20px,1.62vw,28px)] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_12px_32px_rgba(28,42,33,0.10)] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)]"
    >
      <span className="flex size-[46px items-center justify-center rounded-[14px] bg-[#fdecea] text-[#c0392b]">
        <BuddyIconTrash className="size-[22px]" />
      </span>
      <h2
        id={`${uid}-t`}
        className={classNames(HEADING, 'm-0 text-[24px] leading-[1.2] text-[#1c2a21]')}
      >
        Delete this chat?
      </h2>
      <p id={`${uid}-d`} className="m-0 font-sans text-[15px] leading-[1.46] text-[#595959]">
        “{chat.title}” will be deleted for good. Buddy will also forget what you discussed in it.
      </p>
      <div className="flex flex-wrap justify-end gap-[10px]">
        <Button type="button" variant="tertiary-subtle" size="lg" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="danger" size="md" onClick={onConfirm}>
          Delete chat
        </Button>
      </div>
    </HelpModal>
  );
};

const CareerBuddyHistoryDrawer = ({
  open,
  onClose,
  chats = [],
  loading = false,
  onSelect,
  onNewChat,
  onRename,
  onTogglePin,
  onDelete,
  onAskBuddy,
  initial = {},
}) => {
  const [query, setQuery] = useState(initial.query ?? '');
  const [filter, setFilter] = useState('all');
  const [menu, setMenu] = useState(null); // { id, top }
  const [renamingId, setRenamingId] = useState(initial.renamingId ?? null);
  const [deleting, setDeleting] = useState(() =>
    initial.deletingId ? (chats.find((c) => c.id === initial.deletingId) ?? null) : null
  );
  const listRef = useRef(null);
  const wrapRef = useRef(null);
  log('render', { open, chats: chats.length, loading, query, filter });

  useEffect(() => {
    if (!open) {
      setMenu(null);
      setRenamingId(null);
    }
  }, [open]);
  // A demo frame can start with a row's menu open (?chat=history-menu).
  useEffect(() => {
    if (!open || !initial.menuId) return;
    const row = wrapRef.current?.querySelector(`[data-chat-id="${initial.menuId}"]`);
    const btn = row?.querySelector('[aria-haspopup="menu"]');
    const chat = chats.find((c) => c.id === initial.menuId);
    if (btn && chat) openMenu(chat, btn);
    // once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape' || deleting || renamingId) return;
      if (menu) setMenu(null);
      else onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, menu, deleting, renamingId, onClose]);

  const searching = query.trim().length > 0;
  const shown = useMemo(() => filterChats(chats, { query, filter }), [chats, query, filter]);
  const grouped = useMemo(
    () =>
      GROUPS.map((g) => ({ ...g, items: shown.filter((c) => c.group === g.id) })).filter(
        (g) => g.items.length
      ),
    [shown]
  );
  const menuChat = menu ? chats.find((c) => c.id === menu.id) : null;

  const openMenu = (chat, button) => {
    const wrap = wrapRef.current?.getBoundingClientRect();
    const b = button.getBoundingClientRect();
    if (!wrap) return;
    // Figma 9086:72064: the menu's top sits 18px above the "..." button, its left edge 282px in from the drawer edge.
    setMenu((m) =>
      m?.id === chat.id ? null : { id: chat.id, top: Math.round(b.top - wrap.top - 18) }
    );
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={classNames(
          'absolute inset-y-0 left-0 right-[148px] z-20 bg-[#1c2a21]/[0.14] transition-opacity duration-200 motion-reduce:transition-none playful:right-0 playful:bg-[#1c2a21]/[0.22] max-lg:right-0',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <div
        ref={wrapRef}
        role="dialog"
        aria-label="Your chats"
        aria-hidden={!open}
        inert={!open}
        className={classNames(
          'absolute inset-y-0 left-0 z-20 flex w-[340px] flex-col gap-[14px] border border-solid border-[#e7e7e7] bg-white px-[16px] pb-[16px] pt-[20px] shadow-[0_1px_2px_rgba(28,42,33,0.04),0_8px_24px_rgba(28,42,33,0.08)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] max-lg:inset-0 max-lg:w-auto max-lg:border-0',
          open ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex h-[34px] shrink-0 items-center justify-between playful:h-[41px]">
          <h3
            className={classNames(
              HEADING,
              'm-0 text-[20px] leading-[24px] text-[#1c2a21] playful:text-[22px] playful:leading-[26px]'
            )}
          >
            Your chats
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close history"
            className={classNames(
              'flex size-[34px] cursor-pointer items-center justify-center rounded-full border border-solid border-[#e7e7e7] bg-[#f8f8f4] p-[8px] text-[#1c2a21] playful:size-[35px] playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:bg-white playful:shadow-[3px_3px_0_rgba(28,42,33,0.45)] max-lg:size-11',
              FOCUS_RING
            )}
          >
            <BuddyIconClose className="size-[16px]" />
          </button>
        </div>

        {/* New chat */}
        <button
          type="button"
          onClick={() => {
            log('branch', { newChatFromDrawer: true });
            onNewChat?.();
          }}
          className={classNames(
            'flex h-[42px] shrink-0 cursor-pointer items-center justify-center gap-[8px] rounded-[10px] border border-solid border-[#e7e7e7] bg-white px-[14px] py-[11px] font-sans text-[15px] font-medium leading-[18px] text-[#1c2a21] shadow-[0_1px_2px_rgba(28,42,33,0.04)] playful:h-[43px] playful:rounded-full playful:border-[1.5px] playful:border-[#1c2a21]/55 playful:shadow-[4px_4px_0_rgba(28,42,33,0.45),0_10px_24px_rgba(28,42,33,0.06)] playful:hover:bg-[#ebf1ec]',
            FOCUS_RING
          )}
        >
          <BuddyIconPlus className="size-[18px]" />
          New chat
        </button>

        {/* Search */}
        <label
          className={classNames(
            'flex h-[39px] shrink-0 items-center gap-[8px] rounded-[12px] border border-solid border-[#e7e7e7] bg-[#f8f8f4] px-[12px] py-[10px] focus-within:border-[1.5px] focus-within:border-[#387440] playful:focus-within:h-[40px]',
            searching && 'border-[1.5px] border-[#387440]'
          )}
        >
          <BuddyIconSearch className="size-[16px] shrink-0 text-[#737373]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            aria-label="Search chats"
            className={classNames(
              'm-0 min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[17px] text-[#1c2a21] caret-[#387440] outline-none placeholder:text-[#999]',
              searching && 'font-medium'
            )}
          />
          {searching ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className={classNames(
                'flex size-[14px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#737373]',
                FOCUS_RING
              )}
            >
              <BuddyIconClose className="size-[14px]" />
            </button>
          ) : null}
        </label>

        {/* Filter chips */}
        {searching ? null : (
          <div
            className="flex shrink-0 flex-wrap items-center gap-[6px]"
            role="group"
            aria-label="Filter chats"
          >
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={classNames(
                    'cursor-pointer whitespace-nowrap rounded-full border border-solid px-[11px] py-[5px] font-sans text-[12px] leading-[14px]',
                    on
                      ? 'border-transparent bg-[#ebf1ec] font-semibold text-[#387440] playful:border-[#1c2a21] playful:bg-[#387440] playful:text-white playful:shadow-[2px_2px_0_#1c2a21]'
                      : 'border-[#e7e7e7] bg-white font-medium text-[#595959] hover:bg-[#f8f8f4] playful:border-[#1c2a21]/35',
                    FOCUS_RING
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        )}

        {/* List */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={listRef}
            className="no-scrollbar flex h-full flex-col gap-[8px] overflow-y-auto"
            onScroll={() => setMenu(null)}
          >
            {loading ? (
              <LoadingList />
            ) : chats.length === 0 ? (
              <EmptyState />
            ) : shown.length === 0 ? (
              <NoResults query={query.trim()} onAsk={onAskBuddy} />
            ) : searching ? (
              <>
                <p className="m-0 px-[12px] pb-[2px] pt-[8px] font-sans text-[12px] font-semibold leading-[14px] text-[#737373]">
                  {shown.length} {shown.length === 1 ? 'chat matches' : 'chats match'} “
                  {query.trim()}”
                </p>
                {shown.map((c) =>
                  renamingId === c.id ? (
                    <RenameRow
                      key={c.id}
                      chat={c}
                      onSave={(t) => {
                        onRename?.(c.id, t);
                        setRenamingId(null);
                      }}
                      onCancel={() => setRenamingId(null)}
                    />
                  ) : (
                    <ResultRow
                      key={c.id}
                      chat={c}
                      query={query.trim()}
                      onSelect={(x) => onSelect?.(x)}
                    />
                  )
                )}
              </>
            ) : (
              grouped.map((g) => (
                <div key={g.id} className="flex flex-col gap-[8px]">
                  <GroupHead id={g.id} label={g.label} count={g.items.length} />
                  {g.items.map((c) =>
                    renamingId === c.id ? (
                      <RenameRow
                        key={c.id}
                        chat={c}
                        initialDraft={initial.renamingId === c.id ? initial.renameDraft : undefined}
                        onSave={(t) => {
                          onRename?.(c.id, t);
                          setRenamingId(null);
                        }}
                        onCancel={() => setRenamingId(null)}
                      />
                    ) : (
                      <ChatRow
                        key={c.id}
                        chat={c}
                        menuOpen={menu?.id === c.id}
                        onSelect={(x) => onSelect?.(x)}
                        onMore={openMenu}
                      />
                    )
                  )}
                </div>
              ))
            )}
          </div>
          {loading || chats.length === 0 || shown.length === 0 ? null : (
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[48px] bg-gradient-to-b from-white/0 to-white"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-[6px] border-t border-solid border-[#e7e7e7] px-[4px] pt-[10px]">
          <BuddyIconLock className="size-[14px] shrink-0 text-[#737373]" />
          <span className="font-sans text-[11px] leading-[13px] text-[#737373] max-lg:text-[12px]">
            Only you can see your chats. Kept for 12 months.
          </span>
        </div>

        {menuChat ? (
          <ActionsMenu
            top={menu.top}
            chat={menuChat}
            onRename={() => {
              setRenamingId(menuChat.id);
              setMenu(null);
            }}
            onPin={() => {
              onTogglePin?.(menuChat.id);
              setMenu(null);
            }}
            onDelete={() => {
              setDeleting(menuChat);
              setMenu(null);
            }}
          />
        ) : null}
      </div>

      {deleting ? (
        <DeleteChatModal
          chat={deleting}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            onDelete?.(deleting.id);
            setDeleting(null);
          }}
        />
      ) : null}
    </>
  );
};

export default CareerBuddyHistoryDrawer;
