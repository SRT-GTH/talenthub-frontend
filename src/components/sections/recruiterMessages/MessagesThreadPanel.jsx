import { useEffect, useRef } from 'react';
import { MeatballMenuIcon } from '../jobPostings/jobPostingsIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { useIsDesktop } from '../../../hooks/useMediaQuery.js';
import { debug } from '../../../utils/debug.js';
import {
  COMPOSER_PLACEHOLDER,
  RECRUITER_THREAD_MENU_ITEMS,
  TALENT_ICON_THREAD_MENU_ITEMS,
  TALENT_THREAD_MENU_ITEMS,
  THREADS,
} from './recruiterMessagesData.js';
import { CONVERSATION_AVATARS } from './recruiterMessagesAvatars.js';
import { BackToListArrowIcon, SendMessageIcon } from './recruiterMessagesIcons.jsx';
import JobProposalCard from './JobProposalCard.jsx';
import ThreadOptionsMenu from './ThreadOptionsMenu.jsx';

const log = debug('MessagesThreadPanel');

/*
 * MessagesThreadPanel — the open conversation. Figma 7249:84487 (948 / 1076 wide): white, 1.21px #00522b/10, r24,
 * pad 18/22/14, SPACE_BETWEEN. Header pill (r100) → day groups → composer pill (h60).
 *
 * Bubbles (V2.0): the VIEWER's own messages are light (#e5e5e5 at 50 %, #595959) and sit right with the viewer's
 * read receipt; the other person's are #737373 with white text and sit left. Bubbles hug their text up to 537px.
 *
 * Below lg this is a full screen reached from the list (`threadOpen`); at >= lg it always shows.
 *
 * Props: viewpoint (VIEWPOINTS entry), conversation, menuOpen, compareTalentMenu, forcedHoverId,
 * onSetMenuOpen(open), onBack(), className.
 */
const MessagesThreadPanel = ({
  viewpoint,
  conversation,
  menuOpen,
  compareTalentMenu,
  forcedHoverId,
  onSetMenuOpen,
  onBack,
  threadOpen,
  className,
}) => {
  const menuAnchorRef = useRef(null);
  const messagesRef = useRef(null);
  const isDesktop = useIsDesktop();
  const viewerRole = viewpoint.viewerRole;
  const thread = THREADS[conversation.threadId];
  const dayGroups = (thread?.dayGroups ?? []).filter(
    (group) => !group.visibleTo || group.visibleTo.includes(viewerRole)
  );
  const menuItems =
    viewerRole === 'recruiter' ? RECRUITER_THREAD_MENU_ITEMS : TALENT_THREAD_MENU_ITEMS;

  // Dismiss the header menu on any click outside it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDocumentMouseDown = (event) => {
      if (menuAnchorRef.current && !menuAnchorRef.current.contains(event.target)) {
        log('branch', { action: 'menu-dismissed-by-outside-click' });
        onSetMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => document.removeEventListener('mousedown', onDocumentMouseDown);
  }, [menuOpen, onSetMenuOpen]);

  // Chat convention on small screens: land on the latest message.
  useEffect(() => {
    if (!threadOpen || isDesktop) return;
    const messagesElement = messagesRef.current;
    if (!messagesElement) return;
    log('branch: thread opened below lg → scroll to latest message', {
      conversationId: conversation.id,
    });
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [threadOpen, isDesktop, conversation.id]);

  useEffect(() => {
    log('render', {
      viewerRole,
      conversationId: conversation.id,
      dayGroupCount: dayGroups.length,
      menuOpen,
    });
    if (!thread) log.error('no THREADS entry for', conversation.threadId);
  }, [viewerRole, conversation.id, conversation.threadId, dayGroups.length, menuOpen, thread]);

  return (
    <section
      className={classNames(
        'flex h-full min-w-0 flex-1 flex-col rounded-[24px] border-[1.21px] border-[#00522b]/10 bg-white px-[22px] pb-[14px] pt-[18px]',
        // Below lg the thread is a full screen: no card chrome, safe-area aware.
        'max-lg:rounded-none max-lg:border-0 max-lg:px-[12px] max-lg:pb-[calc(8px+env(safe-area-inset-bottom))] max-lg:pt-0',
        className
      )}
    >
      {/* Header pill — Figma 7249:84489, r100, 1.21px #00522b/10. */}
      <header className="flex shrink-0 items-center justify-between gap-[16.88px] rounded-pill border-[1.21px] border-[#00522b]/10 px-[12px] py-[8px] max-lg:gap-[8px] max-lg:rounded-none max-lg:border-0 max-lg:border-b max-lg:border-[#e8e8e4] max-lg:px-0 max-lg:py-[4px]">
        <span className="flex items-center gap-[14px] max-lg:min-w-0 max-lg:flex-1 max-lg:gap-[8px]">
          {/* Below lg only — back to the conversation list. */}
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={() => {
              log('branch', { action: 'back-to-list' });
              onBack();
            }}
            className="relative grid size-[40px] shrink-0 place-items-center rounded-full text-black transition-colors hover:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green max-lg:-ml-[8px] max-lg:after:absolute max-lg:after:-inset-0.5 lg:hidden"
          >
            <BackToListArrowIcon className="size-[24px]" />
          </button>
          <img
            src={CONVERSATION_AVATARS[conversation.avatarId]}
            alt={conversation.name}
            className="size-[53px] rounded-full object-cover max-lg:size-[36px]"
          />
          <span className="flex flex-col gap-[6px] max-lg:min-w-0 max-lg:gap-[2px]">
            <span className="font-sans text-[16px] font-medium leading-[19.09px] text-[#1c2a21] max-lg:truncate">
              {conversation.name}
            </span>
            <span className="font-sans text-[14px] leading-[16.71px] text-[#737373] max-lg:truncate max-lg:text-[12px]">
              {conversation.meta}
            </span>
          </span>
        </span>
        <div ref={menuAnchorRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="Conversation options"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => {
              log('branch', { action: 'thread-menu', open: !menuOpen });
              onSetMenuOpen(!menuOpen);
            }}
            className="flex h-[24.25px] w-[40.75px] items-center justify-center rounded-pill transition-colors hover:bg-neutral max-lg:relative max-lg:after:absolute max-lg:after:-inset-x-[6px] max-lg:after:-inset-y-[10px]"
          >
            <MeatballMenuIcon className="w-[18.75px] text-[#999999]" />
          </button>

          {menuOpen && (
            /* Figma 7249:84533 — right edge on the header's right edge (12px past the button), top 32px under
               the header pill's bottom edge. Below lg it hangs straight under the button. */
            <ThreadOptionsMenu
              items={menuItems}
              forcedHoverId={forcedHoverId}
              onSelect={() => onSetMenuOpen(false)}
              className="absolute top-[34px] right-0 lg:top-[56px] lg:-right-[12px]"
            />
          )}
          {menuOpen && compareTalentMenu && (
            /* Figma 8187:78389 — the iconed talent-side menu drawn 351px left of the recruiter menu (frame
               7249:84379 only; lg and up, there is no room for it below). */
            <ThreadOptionsMenu
              variant="iconed"
              items={TALENT_ICON_THREAD_MENU_ITEMS}
              forcedHoverId={forcedHoverId}
              onSelect={() => onSetMenuOpen(false)}
              className="absolute top-[60px] right-[339px] max-lg:hidden"
            />
          )}
        </div>
      </header>

      {/* Scrolls internally — header above and composer below stay pinned regardless of thread length. */}
      <div
        ref={messagesRef}
        className="mt-[32px] flex min-h-0 flex-1 flex-col items-center gap-[15px] overflow-y-auto max-lg:mt-0 max-lg:py-[10px]"
      >
        {dayGroups.map((group) => (
          <div key={group.day} className="flex w-full flex-col items-center gap-[15px]">
            {/* Day pill — Figma 7249:84502, #e5e5e5 at 50% FILL alpha */}
            <span className="inline-flex items-center rounded-pill bg-[#e5e5e5]/50 px-[14px] py-[6px] font-sans text-[13px] leading-[16px] text-[#595959]">
              {group.day}
            </span>

            <div className="flex w-full flex-col gap-[14px]">
              {group.messages.map((message) => {
                const isOwnMessage = message.from === viewerRole;
                if (message.proposal) {
                  return (
                    <JobProposalCard
                      key={message.id}
                      proposal={message.proposal}
                      viewerRole={viewerRole}
                      className={isOwnMessage ? 'self-end' : 'self-start'}
                    />
                  );
                }
                return (
                  <div
                    key={message.id}
                    className={classNames(
                      'flex w-fit max-w-[537px] flex-col rounded-[12px] px-[16px] pb-[8px] pt-[14px] max-lg:max-w-[88%] max-lg:px-[12px] max-lg:pb-[6px] max-lg:pt-[8px]',
                      isOwnMessage
                        ? 'gap-[2.5px] self-end bg-[#e5e5e5]/50'
                        : 'gap-[6px] self-start bg-[#737373]'
                    )}
                  >
                    <span
                      className={classNames(
                        'font-sans text-[14px] leading-5',
                        isOwnMessage ? 'text-[#595959]' : 'text-white'
                      )}
                    >
                      {message.text}
                    </span>
                    <span className="flex items-center gap-[4px] self-end">
                      <span className="font-sans text-[12px] leading-[14.32px] text-[#babab7]">
                        {message.time}
                      </span>
                      {isOwnMessage && message.receipt && (
                        <span
                          className={classNames(
                            'font-sans text-[12px] font-medium leading-[14.32px]',
                            message.receipt === 'Read' ? 'text-[#349643]' : 'text-[#959592]'
                          )}
                        >
                          {message.receipt}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Composer pill — Figma 7249:84552, r100, 1.21px #00522b/10, h60. `shrink-0` keeps it pinned below the
          scrolling messages. */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          log('branch', { action: 'send-message', wired: false });
        }}
        className="mt-[24px] flex h-[60px] shrink-0 items-center justify-between gap-[16.88px] rounded-pill border-[1.21px] border-[#00522b]/10 py-[12px] pl-[20px] pr-[12px] max-lg:mt-[4px] max-lg:h-[44px] max-lg:gap-[8px] max-lg:border max-lg:py-[4px] max-lg:pl-[14px] max-lg:pr-[4px]"
      >
        <input
          type="text"
          placeholder={COMPOSER_PLACEHOLDER}
          className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[17.6px] text-black outline-none placeholder:text-[#999999] max-lg:text-[16px]"
        />
        <button
          type="submit"
          aria-label="Send message"
          className="grid h-[36px] w-[37px] shrink-0 place-items-center rounded-full bg-[#387440] transition-colors hover:bg-brand-green-hover max-lg:relative max-lg:size-[36px] max-lg:after:absolute max-lg:after:-inset-1"
        >
          <SendMessageIcon className="h-[12px] w-[13px] text-white" />
        </button>
      </form>
    </section>
  );
};

export default MessagesThreadPanel;
