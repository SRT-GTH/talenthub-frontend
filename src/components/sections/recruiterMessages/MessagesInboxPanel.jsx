import { useEffect } from 'react';
import { SearchIcon } from '../../shared/assets.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { INBOX_TABS, SEARCH_PLACEHOLDER } from './recruiterMessagesData.js';
import { CONVERSATION_AVATARS } from './recruiterMessagesAvatars.js';
import { InboxRefreshIcon } from './recruiterMessagesIcons.jsx';

const log = debug('MessagesInboxPanel');

// Figma draws the text on green (active tab label, unread badge number) with a #fef1e7 → #e8f2ed gradient fill.
const ON_GREEN_TEXT_STYLE = {
  backgroundImage: 'linear-gradient(225deg, #fef1e7 0%, #e8f2ed 20.19%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
};

/*
 * MessagesInboxPanel — the conversation list panel. Figma 7249:84417 (collapsed sidebar, 420 wide) /
 * 7249:84031 (expanded sidebar, 371 wide): the panel is 27.9% of the row either way. White, 1.2px #00522b/10,
 * r24, pad 28/22, gap 16, shadow 0 2px 1px.
 *
 * Rows (V2.0): the SELECTED row is a white r12 card with a 1.2px #00522b/10 outline and a 0 1px 6px
 * rgba(0,82,43,.12) shadow; the others are plain 77px rows split by 1px #f2f2f2 rules.
 *
 * Props: viewpoint (VIEWPOINTS entry), tabId, conversationId, forcedHoverId, onSelectTab(id),
 * onOpenConversation(id), className (visibility below lg).
 */
const MessagesInboxPanel = ({
  viewpoint,
  tabId,
  conversationId,
  forcedHoverId,
  onSelectTab,
  onOpenConversation,
  className,
}) => {
  const visibleConversations =
    tabId === 'unread'
      ? viewpoint.conversations.filter((conversation) => conversation.unread)
      : viewpoint.conversations;

  useEffect(() => {
    log('render', {
      viewpoint: viewpoint.id,
      tabId,
      visibleCount: visibleConversations.length,
      conversationId,
    });
  }, [viewpoint.id, tabId, visibleConversations.length, conversationId]);

  return (
    <aside
      className={classNames(
        'flex h-full w-full shrink-0 flex-col gap-[16px] rounded-[24px] border-[1.21px] border-[#00522b]/10 bg-white px-[22px] py-[28px] shadow-[0_2px_1px_0_#8d8a8a] lg:w-[27.9%] lg:min-w-[300px]',
        'max-lg:gap-[10px] max-lg:rounded-none max-lg:border-0 max-lg:bg-transparent max-lg:p-0 max-lg:shadow-none',
        className
      )}
    >
      <label className="flex h-[45px] items-center gap-[9.73px] rounded-[12px] border-[1.22px] border-[#cccccc] bg-white px-[16px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green max-lg:h-[44px] max-lg:rounded-[10px] max-lg:border max-lg:px-[12px] max-lg:shadow-none">
        <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
        <SearchIcon className="size-[16px] shrink-0 text-[#595959]" />
        <input
          type="search"
          placeholder={SEARCH_PLACEHOLDER}
          onChange={(event) => log('search', { length: event.target.value.length })}
          className="min-w-0 flex-1 bg-transparent font-sans text-[13px] leading-[24.31px] tracking-[0.24px] text-black outline-none placeholder:text-[#999999] max-lg:text-[16px]"
        />
      </label>

      <div className="flex items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[6px]" role="tablist" aria-label="Inbox filter">
          {INBOX_TABS.map((tab) => {
            const isActive = tab.id === tabId;
            const countText = viewpoint.tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={countText ? `${tab.label} ${countText}` : tab.label}
                onClick={() => {
                  log('branch', { inboxTab: tab.id });
                  onSelectTab(tab.id);
                }}
                className={classNames(
                  'relative inline-flex h-[33px] items-center gap-[4.86px] whitespace-nowrap rounded-pill border-[1.22px] border-[#e1eae2] px-[14px] font-sans shadow-[0_1.22px_3.65px_0_rgba(0,0,0,0.08)] transition-colors duration-300 ease-in',
                  'max-lg:h-[30px] max-lg:px-[12px] max-lg:shadow-none max-lg:after:absolute max-lg:after:-inset-x-[2px] max-lg:after:-inset-y-[7px]',
                  isActive
                    ? 'bg-[#387440] text-[14.59px] leading-[24.31px] tracking-[0.24px]'
                    : 'bg-white text-[14px] font-medium leading-[24.31px] tracking-[0.24px] text-[#737373] hover:bg-neutral'
                )}
              >
                <span
                  className={isActive ? 'font-semibold' : undefined}
                  style={isActive ? ON_GREEN_TEXT_STYLE : undefined}
                >
                  {tab.label}
                </span>
                {countText && (
                  <span
                    className={isActive ? 'font-medium' : undefined}
                    style={isActive ? ON_GREEN_TEXT_STYLE : undefined}
                  >
                    {countText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="Refresh conversations"
          onClick={() => log('branch', { action: 'refresh-inbox', wired: false })}
          className={classNames(
            'group relative flex size-[33px] shrink-0 items-center justify-end rounded-[6px] text-[#595959] transition-colors hover:justify-center hover:bg-[#f1f1f1] hover:p-[8px] max-lg:size-[36px] max-lg:justify-center max-lg:after:absolute max-lg:after:-inset-1',
            forcedHoverId === 'refresh' && 'justify-center bg-[#f1f1f1] p-[8px]'
          )}
        >
          <InboxRefreshIcon
            className={classNames(
              'size-[20px] shrink-0 group-hover:size-full',
              forcedHoverId === 'refresh' && 'size-full'
            )}
          />
        </button>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col gap-[7.23px] overflow-y-auto max-lg:gap-0">
        {visibleConversations.map((conversation, index) => {
          const isSelected = conversation.id === conversationId;
          const previous = visibleConversations[index - 1];
          const showRule = Boolean(previous) && !isSelected && previous.id !== conversationId;
          return (
            <li key={conversation.id} className="flex flex-col gap-[7.23px] max-lg:gap-0">
              {showRule && (
                <div className="h-px w-full bg-[#f2f2f2] max-lg:h-0 max-lg:border-t max-lg:border-[#e8e8e4]" />
              )}
              <button
                type="button"
                onClick={() => {
                  log('branch', { openConversation: conversation.id });
                  onOpenConversation(conversation.id);
                }}
                aria-current={isSelected ? 'true' : undefined}
                className={classNames(
                  'flex w-full items-center gap-[12px] px-[10px] text-left transition-all duration-300 ease-in max-lg:rounded-none max-lg:border-0 max-lg:px-0 max-lg:py-[10px] max-lg:shadow-none',
                  isSelected
                    ? 'rounded-[12px] border-[1.21px] border-[#00522b]/10 bg-white py-[14px] shadow-[0_1px_6px_0_rgba(0,82,43,0.12)]'
                    : 'rounded-[12px] px-0 py-[12.05px] hover:bg-neutral'
                )}
              >
                <img
                  src={CONVERSATION_AVATARS[conversation.avatarId]}
                  alt={conversation.name}
                  className="size-[53px] shrink-0 rounded-full object-cover max-lg:size-[44px]"
                />
                <span className="flex min-w-0 flex-1 flex-col gap-[7px] max-lg:gap-[3px]">
                  <span className="flex items-center justify-between gap-[10px]">
                    <span className="truncate font-sans text-[15px] font-medium leading-[18px] text-[#1c2a21]">
                      {conversation.name}
                    </span>
                    <span className="shrink-0 font-sans text-[13px] leading-[16px] text-[#737373] max-lg:text-[12px]">
                      {conversation.time}
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-[10px]">
                    <span className="flex min-w-0 items-center gap-[6px]">
                      {conversation.previewDotTone && (
                        <span
                          aria-hidden="true"
                          data-preview-dot={conversation.previewDotTone}
                          className={classNames(
                            'size-[6px] shrink-0 rounded-full',
                            conversation.previewDotTone === 'green'
                              ? 'bg-[#387440]'
                              : 'bg-[#e6e6e6]'
                          )}
                        />
                      )}
                      <span
                        className={classNames(
                          'truncate font-sans leading-[17px] text-[#737373] max-lg:text-[13px]',
                          isSelected ? 'text-[13.5px]' : 'text-[14px]'
                        )}
                      >
                        {conversation.preview}
                      </span>
                    </span>
                    {conversation.unread && (
                      <span className="grid h-[19px] min-w-[24px] shrink-0 place-items-center rounded-full border-[1.21px] border-[#00522b]/10 bg-[#387440] px-[6px] font-sans text-[11px] font-medium leading-[13px] max-lg:h-[20px] max-lg:text-[12px] max-lg:tabular-nums">
                        <span style={ON_GREEN_TEXT_STYLE}>{conversation.unread}</span>
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default MessagesInboxPanel;
