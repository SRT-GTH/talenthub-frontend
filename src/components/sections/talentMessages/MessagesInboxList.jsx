import Button from '../../ui/Button.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import spotChats from '../../../assets/talent-messages/spot/spot-chats.svg';
import { MsgInfoIcon, MsgLockIcon, MsgSearchIcon } from './aIcons.jsx';
import { AVATARS, MESSAGES_COPY, UNDRAWN_CONVERSATIONS } from './messagesData.js';
import { FOCUS_RING, PANE_LIST, ROW_ACTIVE, TAB_BASE, TAB_OFF, TAB_ON } from './messagesStyles.js';

const log = debug('MessagesInboxList');

const BADGE_TEXT = {
  backgroundImage: 'linear-gradient(237.7deg, rgb(254, 241, 231) 0%, rgb(232, 242, 237) 20.192%)',
};

/*
 * Inbox list pane (Figma "Frame 1000002133", 371 wide): search, All / Unread / Requests tabs with counts, the
 * Requests notice, conversation rows (unread badge, red "Not sent:" preview), the empty and loading bodies.
 * Props: messages (useMessagesState()), view (buildInbox()), loading (T-MSG-14), empty (T-MSG-13), onSelect(id).
 * Hidden below `lg` while a conversation is open (the phone layout shows list OR conversation).
 */
export const InboxSearch = ({ value, onChange }) => (
  <label className="flex h-[45px] shrink-0 cursor-text items-center gap-[12px] rounded-[8px] border border-solid border-[#dfdfdc] bg-white py-[10px] pl-[14px] pr-[12px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#387440]">
    <span className="flex size-[28px] shrink-0 items-center justify-center text-[#387440]">
      <MsgSearchIcon className="size-[20px]" />
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={MESSAGES_COPY.searchPlaceholder}
      aria-label="Search conversations"
      className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#1c2a21] outline-none placeholder:text-[#bfbfbf]"
    />
  </label>
);

const Tab = ({ on, label, count, badge, onClick, ariaLabel }) => (
  <button
    type="button"
    aria-pressed={on}
    aria-label={ariaLabel}
    onClick={onClick}
    className={classNames(TAB_BASE, on ? TAB_ON : TAB_OFF, FOCUS_RING)}
  >
    <span
      aria-hidden="true"
      data-count={badge ? undefined : `(${count})`}
      className={classNames(!badge && 'after:ml-[4.86px] after:content-[attr(data-count)]')}
    >
      {label}
    </span>
    {badge ? (
      <span
        aria-hidden="true"
        data-count={count}
        className="inline-flex h-[22px] min-w-[21px] items-center justify-center rounded-full border border-solid border-transparent bg-[#c8951a] px-[7px] py-px font-sans text-[11.5px] max-lg:text-[12px] font-bold leading-[19.45px] tracking-[0.12px] text-white after:content-[attr(data-count)] playful:border-[rgba(28,42,33,0.35)]"
      />
    ) : null}
  </button>
);

export const InboxTabs = ({ tab, counts, onTab }) => (
  <div className="flex shrink-0 flex-wrap items-center gap-[6px]">
    <Tab
      on={tab === 'all'}
      label={MESSAGES_COPY.tabs.all}
      count={counts.all}
      ariaLabel={`${MESSAGES_COPY.tabs.all} (${counts.all})`}
      onClick={() => onTab('all')}
    />
    <Tab
      on={tab === 'unread'}
      label={`${MESSAGES_COPY.tabs.unread}`}
      count={counts.unread}
      ariaLabel={`${MESSAGES_COPY.tabs.unread} (${counts.unread})`}
      onClick={() => onTab('unread')}
    />
    <Tab
      on={tab === 'requests'}
      label={MESSAGES_COPY.tabs.requests}
      count={counts.requests}
      badge
      ariaLabel={`${MESSAGES_COPY.tabs.requests} (${counts.requests})`}
      onClick={() => onTab('requests')}
    />
  </div>
);

const Avatar = ({ row }) => (
  <span
    className={classNames(
      'relative flex size-[53px] shrink-0 items-center justify-center overflow-hidden rounded-full',
      row.confidential ? 'bg-[#eaeffb] text-[#244a9f]' : 'bg-[#dfdfdc]'
    )}
  >
    {row.confidential ? (
      <MsgLockIcon className="size-[22px]" />
    ) : (
      <img src={AVATARS[row.avatar]} alt="" className="size-full object-cover" />
    )}
  </span>
);

const Row = ({ row, active, onSelect }) => {
  const unreadLabel = row.unread ? `, ${row.unread} unread` : '';
  return (
    <li className="list-none">
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        aria-label={`${row.name}, ${row.time}, ${row.preview}${unreadLabel}`}
        onClick={() => {
          if (UNDRAWN_CONVERSATIONS.includes(row.id)) {
            log('row not selectable: conversation not drawn in Figma', row.id);
            return;
          }
          onSelect(row.id);
        }}
        className={classNames(
          'flex w-full cursor-pointer items-center gap-[12px] border-0 bg-transparent text-left',
          active ? `${ROW_ACTIVE} px-[10px] py-[14px]` : 'py-[12px]',
          FOCUS_RING
        )}
      >
        <Avatar row={row} />
        <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
          <span className="flex items-center justify-between gap-[10px]">
            <span
              className={classNames(
                'min-w-0 truncate font-sans text-[15px] leading-[18px] text-[#1c2a21]',
                row.unread ? 'font-semibold' : 'font-medium'
              )}
            >
              {row.name}
            </span>
            <span className="shrink-0 font-sans text-[13px] leading-[16px] text-[#737373]">
              {row.time}
            </span>
          </span>
          <span className="flex items-center justify-between gap-[10px]">
            <span
              className={classNames(
                'min-w-0 flex-1 truncate font-sans',
                row.previewTone === 'error'
                  ? 'text-[14px] leading-[17px] text-[#c0392b]'
                  : active
                    ? 'text-[13.5px] leading-[16px] text-[#737373]'
                    : 'text-[14px] leading-[17px] text-[#999]'
              )}
            >
              {row.preview}
            </span>
            {row.unread ? (
              <span
                aria-hidden="true"
                className="inline-flex min-h-[19px] min-w-[18px] shrink-0 items-center justify-center rounded-full border-[1.2px] border-solid border-[rgba(0,82,43,0.1)] bg-[#387440] px-[6px] py-[3px]"
              >
                <span
                  className="bg-clip-text font-sans text-[11px] max-lg:text-[12px] font-medium leading-normal text-transparent max-lg:text-[12px]"
                  style={BADGE_TEXT}
                >
                  {row.unread}
                </span>
              </span>
            ) : null}
          </span>
        </span>
      </button>
    </li>
  );
};

const Skeleton = () => (
  <ul aria-hidden="true" className="m-0 flex list-none flex-col gap-[18px] p-0" data-msg-deco>
    {[
      [150, 110, 230],
      [130, 90, 210],
      [160, 100, 190],
      [120, 80, 220],
    ].map(([a, b, c]) => (
      <li key={a} className="flex items-center gap-[12px] py-[10px]">
        <span className="size-[53px] shrink-0 animate-pulse rounded-full bg-[#dfdfdc]" />
        <span className="flex min-w-0 flex-col gap-[8px]">
          <span
            className="h-[12px] animate-pulse rounded-[6px] bg-[#dfdfdc]"
            style={{ width: a, maxWidth: '100%' }}
          />
          <span
            className="h-[10px] animate-pulse rounded-[6px] bg-[#dfdfdc]"
            style={{ width: b, maxWidth: '100%' }}
          />
          <span
            className="h-[10px] animate-pulse rounded-[6px] bg-[#dfdfdc]"
            style={{ width: c, maxWidth: '100%' }}
          />
        </span>
      </li>
    ))}
  </ul>
);

const EmptyList = () => {
  const copy = MESSAGES_COPY.empty;
  return (
    <div className="mx-auto flex w-full max-w-[260px] flex-col items-center gap-[12px] pt-[121px] max-lg:pt-[24px]">
      <img src={spotChats} alt="" aria-hidden="true" className="size-[132px]" />
      <p className="m-0 font-sans text-[18px] font-semibold leading-normal tracking-[0.2px] text-[#1c2a21]">
        {copy.listTitle}
      </p>
      <p className="m-0 text-center font-sans text-[14px] leading-[20px] tracking-[0.2px] text-[#999]">
        {copy.listText}
      </p>
      <Button
        onClick={() => {
          // Figma draws the button but no destination.
          log('check my visibility: no destination drawn');
        }}
      >
        {copy.cta}
      </Button>
      <button
        type="button"
        onClick={() => log('browse your matches: no destination drawn')}
        className={classNames(
          'cursor-pointer border-0 bg-transparent font-sans text-[13px] font-semibold leading-[16px] tracking-[0.2px] text-[#387440] no-underline max-lg:py-[4px]',
          FOCUS_RING
        )}
      >
        {copy.link}
      </button>
    </div>
  );
};

const MessagesInboxList = ({ messages, view, loading, empty, onSelect, hidden }) => {
  const { rows, counts, tab, activeListId, requestsNotice } = view;
  log('render', { tab, rows: rows.length, loading, empty });
  return (
    <section
      aria-label="Conversations"
      className={classNames(
        PANE_LIST,
        'flex min-h-0 flex-col gap-[24px] overflow-hidden px-[clamp(14px,1.27vw,22px)] py-[clamp(16px,1.62vw,28px)] lg:w-[clamp(300px,21.47vw,371px)] lg:shrink-0',
        hidden && 'max-lg:hidden',
        'max-lg:flex-1'
      )}
    >
      <InboxSearch value={messages.q} onChange={(q) => messages.update({ q })} />
      <InboxTabs
        tab={tab}
        counts={counts}
        onTab={(next) => messages.update({ tab: next === 'all' ? null : next })}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <Skeleton />
        ) : empty ? (
          <EmptyList />
        ) : (
          <>
            {requestsNotice ? (
              <p
                className={classNames(
                  'mb-[7px] mt-0 flex items-start gap-[10px] rounded-[16px] bg-[rgba(250,244,232,0.6)] px-[16px] py-[12px] font-sans text-[13px] leading-[19px] tracking-[0.2px] text-[#a07715]'
                )}
              >
                <MsgInfoIcon className="mt-[0px] size-[18px] text-[#c8951a]" />
                <span>{MESSAGES_COPY.requestsNotice}</span>
              </p>
            ) : null}
            <ul className="m-0 flex list-none flex-col gap-[7.23px] p-0">
              {rows.flatMap((row) => [
                <Row key={row.id} row={row} active={row.id === activeListId} onSelect={onSelect} />,
                row.separator && tab === 'all' ? (
                  <li
                    key={`${row.id}-sep`}
                    aria-hidden="true"
                    className="h-[1.2px] w-full list-none rounded-[16px] bg-[#ebf1ec]"
                  />
                ) : null,
              ])}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default MessagesInboxList;
