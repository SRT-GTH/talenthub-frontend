import { useEffect, useRef, useState } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import { SearchIcon } from '../../shared/assets.jsx';
import { MeatballMenuIcon } from '../jobPostings/jobPostingsIcons.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import {
  PAGE_HEADING,
  PAGE_SUBHEADING,
  SEARCH_PLACEHOLDER,
  COMPOSER_PLACEHOLDER,
  INBOX_TABS,
  CONVERSATIONS,
  THREADS,
  THREAD_MENU_ITEMS,
} from './recruiterMessagesData.js';
// Three correspondents already have committed portraits under the same names;
// Kofi Agyekum has none, so an existing portrait stands in until
// src/assets/recruiterMessages/avatar-kofi-agyekum.png lands.
import avatarKofi from '../../../assets/community/avatar-kingsley-smith.png';
import avatarAkosua from '../../../assets/community/avatar-akosua-quansah.png';
import avatarRoselyn from '../../../assets/community/avatar-roselyn-awinnor.png';
import avatarAbigail from '../../../assets/community/avatar-abigail-mensah.png';

const log = debug('RecruiterMessagesSection');

const AVATARS = {
  'kofi-agyekum': avatarKofi,
  'akosua-quansah': avatarAkosua,
  'roselyn-awinnor': avatarRoselyn,
  'abigail-mensah': avatarAbigail,
};

/*
 * RecruiterMessagesSection — the recruiter inbox. Figma 7249:83993, canvas
 * 7249:84024 (VERTICAL gap 24, py 32).
 *
 * Two panes 10px apart, both white with a 1.21px #00522b stroke at OPACITY
 * 0.10 (every #00522b outline on this screen is 10% — the list panel, the
 * selected row, the thread pane, the header pill, the proposal card and the
 * composer) and r24:
 *   list   371 wide, pad 22/28, shadow 0 2px 1px #8d8a8a
 *   thread 948 wide, pad 22 / 18 top / 14 bottom, SPACE_BETWEEN
 *
 * Verified details that are easy to get wrong:
 *  • The SELECTED conversation is a white row with a 1.21px #00522b outline,
 *    r12 and a soft green glow — not a filled highlight. Unselected rows carry
 *    no background at all.
 *  • The thread header and the composer are both PILLS (r100) outlined in
 *    #00522b, not rectangles.
 *  • Bubble colours are the reverse of the usual convention: the TALENT's
 *    messages are #737373 with white text and sit LEFT, while the RECRUITER's
 *    are #e5e5e5 at 50% with #595959 text and sit RIGHT. Reproduced as drawn
 *    (corrected 2026-10-03 — an earlier pass had the talent bubble as brand
 *    green #32683a; re-measured against 7249:84859, it's #737373 grey).
 *  • "Read" receipts are #349643; timestamps are #babab7 on both sides.
 *  • "JOB PROPOSAL" carries Figma textCase SMALL_CAPS_FORCED.
 */
const SendIcon = ({ className = '' }) => (
  // Figma 7249:84150 — 13x12. Path and its #FEF1E7 -> #E8F2ED gradient are the
  // node's own, supplied verbatim; the gradient is why this is not a flat fill.
  <svg viewBox="0 0 13 12" fill="none" aria-hidden="true" className={className}>
    <path
      d="M0.969725 0.0653414C0.448101 -0.174616 -0.124982 0.284433 0.023976 0.822251L1.11598 4.75182C1.14334 4.85058 1.20023 4.93942 1.27959 5.0073C1.35894 5.07519 1.45725 5.11913 1.56231 5.13366L6.91614 5.87023C7.07106 5.89109 7.07106 6.10706 6.91614 6.12844L1.56285 6.86449C1.45779 6.87902 1.35948 6.92296 1.28013 6.99085C1.20078 7.05873 1.14388 7.14757 1.11652 7.24633L0.023976 11.178C-0.124982 11.7153 0.448101 12.1743 0.969725 11.9349L12.6145 6.58854C13.1285 6.35275 13.1285 5.64749 12.6145 5.41118L0.969725 0.0653414Z"
      fill="url(#gthSendGradient)"
    />
    <defs>
      <linearGradient
        id="gthSendGradient"
        x1="13"
        y1="0"
        x2="3.37754"
        y2="14.2765"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FEF1E7" />
        <stop offset="0.201923" stopColor="#E8F2ED" />
      </linearGradient>
    </defs>
  </svg>
);

// Figma 7249:84133 "ep:opportunity" — the proposal card's watermark. 72.5x72.5
// at NODE opacity 0.59, overhanging the card's top-right corner (left 253.8,
// top -14.8 of a 299x151 card) so the card's overflow clips it. Path, its
// #142916 -> #2A5730 gradient and the 0.59 are the node's own.
const ProposalWatermark = ({ className = '' }) => (
  <svg viewBox="0 0 46 58" fill="none" aria-hidden="true" className={className}>
    <g opacity="0.59" clipPath="url(#gthProposalClip)">
      <path
        d="M23.4244 46.3567L24.1778 42.5782L35.5132 44.8382L34.7599 48.6167L23.4244 46.3567ZM56.2773 19.5129C55.6671 22.5778 54.3847 25.4692 52.5224 27.9788C50.6602 30.4883 48.2645 32.5536 45.5079 34.0258C42.8689 35.4395 40.8478 37.7866 40.2628 40.7209L40.0451 41.8131L21.1526 38.0464L21.3209 37.2021C21.8859 34.3683 21.2985 31.3415 19.4152 29.149C16.8716 26.1874 15.1956 22.5807 14.572 18.7269C13.9484 14.873 14.4016 10.9219 15.8815 7.30926C17.4432 3.48272 20.0927 0.198158 23.5022 -2.13783C26.9117 -4.47382 30.9314 -5.75867 35.0637 -5.83333C38.2339 -5.89397 41.3774 -5.24319 44.263 -3.92886C47.1486 -2.61454 49.7029 -0.670087 51.738 1.76148C53.7731 4.19304 55.2373 7.04987 56.0228 10.1219C56.8084 13.1938 56.8953 16.4028 56.2773 19.5129ZM23.7834 14.9987C25.3407 7.18787 30.9011 2.66741 37.7555 4.03401L38.5089 0.255511C29.3933 -1.56191 21.9494 4.49215 20.0049 14.2454L23.7834 14.9987Z"
        fill="url(#gthProposalGradient)"
      />
    </g>
    <defs>
      <linearGradient
        id="gthProposalGradient"
        x1="18.8494"
        y1="-9.56836"
        x2="62.2039"
        y2="41.0745"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#142916" />
        <stop offset="1" stopColor="#2A5730" />
      </linearGradient>
      <clipPath id="gthProposalClip">
        <rect
          width="61.6458"
          height="61.6458"
          fill="white"
          transform="translate(12.0535 -14.8398) rotate(11.2755)"
        />
      </clipPath>
    </defs>
  </svg>
);

const RefreshIcon = ({ className = '' }) => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
    <path
      d="M16.5 8.3A6.7 6.7 0 0 0 4.4 6M3.5 11.7A6.7 6.7 0 0 0 15.6 14"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M16.8 3.6v4.7h-4.7M3.2 16.4v-4.7h4.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RecruiterMessagesSection = () => {
  const [activeTabId, setActiveTabId] = useState(INBOX_TABS[0].id);
  const [activeConversationId, setActiveConversationId] = useState(CONVERSATIONS[0].id);
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);
  const threadMenuRef = useRef(null);

  // The tabs only ever toggled their own highlight before — the list below
  // always rendered all of CONVERSATIONS regardless of activeTabId. This is
  // the actual filter.
  const visibleConversations =
    activeTabId === 'unread'
      ? CONVERSATIONS.filter((conversation) => conversation.unread)
      : CONVERSATIONS;

  const activeConversation =
    CONVERSATIONS.find((conversation) => conversation.id === activeConversationId) ??
    CONVERSATIONS[0];
  const activeThread = THREADS[activeConversationId];

  // Dismiss the header menu on any click outside it.
  useEffect(() => {
    if (!threadMenuOpen) return undefined;
    const onDocClick = (event) => {
      if (threadMenuRef.current && !threadMenuRef.current.contains(event.target)) {
        setThreadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [threadMenuOpen]);

  useEffect(() => {
    log('active conversation changed', {
      activeConversationId,
      name: activeConversation.name,
      dayGroupCount: activeThread?.dayGroups.length ?? 0,
    });
    if (!activeThread) {
      log.error('no THREADS entry for conversation', activeConversationId);
    }
  }, [activeConversationId, activeConversation, activeThread]);

  return (
    <DashboardShell>
      {/* `h-full` so this fills DashboardShell's `<main>` box exactly instead of
          growing past it — the list and thread panels below then scroll
          INTERNALLY (each own `overflow-y-auto`) instead of the whole page
          scrolling, so the conversation list and the thread's header/composer
          stay fully visible at all times. */}
      <div className="flex h-full w-full flex-col gap-[24px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)]">
        <RecruiterPageHeading lead={PAGE_HEADING.lead} subtitle={PAGE_SUBHEADING} />

        <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:flex-row">
          {/* ── Conversation list — Figma 7249:84031 ── */}
          <aside className="flex h-full w-full shrink-0 flex-col gap-[16px] rounded-[24px] border-[1.21px] border-[#00522b]/10 bg-white px-[22px] py-[28px] shadow-[0_2px_1px_0_#8d8a8a] lg:w-[371px]">
            <label className="flex h-[45px] items-center gap-[9.73px] rounded-[12px] border-[1.22px] border-[#cccccc] bg-white px-[16px] shadow-[0_3.04px_0_0_#bfbfbf] focus-within:border-brand-green">
              <span className="sr-only">{SEARCH_PLACEHOLDER}</span>
              <SearchIcon className="size-[16px] shrink-0 text-[#595959]" />
              <input
                type="search"
                placeholder={SEARCH_PLACEHOLDER}
                onChange={(event) => log('search', { length: event.target.value.length })}
                className="min-w-0 flex-1 bg-transparent font-sans text-[13px] leading-[24.31px] tracking-[0.24px] text-black outline-none placeholder:text-[#999999]"
              />
            </label>

            <div className="flex items-center justify-between gap-[16px]">
              <div className="flex items-center gap-[6px]">
                {INBOX_TABS.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        log('branch', { inboxTab: tab.id });
                        setActiveTabId(tab.id);
                        // If the currently open thread isn't in the new
                        // filter (e.g. switching to Unread while a read
                        // conversation is open), fall back to the first
                        // conversation the filter still shows instead of
                        // leaving the thread pane on a now-hidden row.
                        const nextVisible =
                          tab.id === 'unread'
                            ? CONVERSATIONS.filter((c) => c.unread)
                            : CONVERSATIONS;
                        if (!nextVisible.some((c) => c.id === activeConversationId)) {
                          const fallbackId = nextVisible[0]?.id ?? null;
                          log('branch', { autoSelectAfterFilter: fallbackId });
                          setActiveConversationId(fallbackId);
                        }
                      }}
                      className={classNames(
                        'inline-flex h-[33px] items-center gap-[4.86px] rounded-pill border-[1.22px] border-brand-green-light-hover px-[14px]',
                        'font-sans text-[14px] shadow-[0_1.22px_3.65px_0_rgba(0,0,0,0.08)] transition-all duration-300 ease-in',
                        isActive
                          ? 'bg-brand-green font-semibold text-white'
                          : 'bg-white font-medium text-content-helper hover:bg-neutral'
                      )}
                    >
                      {tab.label}
                      {tab.count && <span className="font-medium">{tab.count}</span>}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                aria-label="Refresh conversations"
                onClick={() => log('branch', { action: 'refresh-inbox', wired: false })}
                className="shrink-0 text-[#595959] transition-opacity hover:opacity-70"
              >
                <RefreshIcon className="size-[20px]" />
              </button>
            </div>

            <ul className="flex min-h-0 flex-1 flex-col gap-[7.23px] overflow-y-auto">
              {visibleConversations.map((conversation) => {
                const isActive = conversation.id === activeConversationId;
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => {
                        log('branch', { openConversation: conversation.id });
                        setActiveConversationId(conversation.id);
                      }}
                      className={classNames(
                        'flex w-full items-center gap-[12px] px-[10px] text-left transition-all duration-300 ease-in',
                        isActive
                          ? 'rounded-[12px] border-[1.21px] border-[#00522b]/10 bg-white py-[14px] shadow-[0_1px_6px_0_rgba(0,82,43,0.25)]'
                          : 'rounded-[12px] py-[12px] hover:bg-neutral'
                      )}
                    >
                      <img
                        src={AVATARS[conversation.id]}
                        alt={conversation.name}
                        className="size-[53px] shrink-0 rounded-full object-cover"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-[7px]">
                        <span className="flex items-center justify-between gap-[10px]">
                          <span className="truncate font-sans text-[15px] font-medium leading-[17.9px] text-black">
                            {conversation.name}
                          </span>
                          <span className="shrink-0 font-sans text-[13px] leading-[15.51px] text-content-helper">
                            {conversation.time}
                          </span>
                        </span>
                        <span className="flex items-center justify-between gap-[10px]">
                          <span className="truncate font-sans text-[13.5px] leading-[16.11px] text-content-helper">
                            {conversation.preview}
                          </span>
                          {conversation.unread && (
                            <span className="grid size-[18px] shrink-0 place-items-center rounded-full bg-brand-green font-sans text-[10px] font-bold text-white">
                              {conversation.unread}
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

          {/* ── Thread — Figma 7249:84101 ── */}
          <section className="flex h-full min-w-0 flex-1 flex-col rounded-[24px] border-[1.21px] border-[#00522b]/10 bg-white px-[22px] pb-[14px] pt-[18px]">
            {/* Header pill — Figma 7249:84103, r100, 1.21px #00522b. `shrink-0`
                so it stays pinned above the scrolling messages below it. */}
            <header className="flex shrink-0 items-center justify-between gap-[16.88px] rounded-pill border-[1.21px] border-[#00522b]/10 px-[12px] py-[8px]">
              <span className="flex items-center gap-[14px]">
                <img
                  src={AVATARS[activeConversation.id]}
                  alt={activeConversation.name}
                  className="size-[53px] rounded-full object-cover"
                />
                <span className="flex flex-col gap-[6px]">
                  <span className="font-sans text-[16px] font-medium leading-[19.09px] text-black">
                    {activeConversation.name}
                  </span>
                  <span className="font-sans text-[14px] leading-[16.71px] text-content-helper">
                    {activeConversation.meta}
                  </span>
                </span>
              </span>
              <div ref={threadMenuRef} className="relative shrink-0">
                <button
                  type="button"
                  aria-label="Conversation options"
                  aria-haspopup="menu"
                  aria-expanded={threadMenuOpen}
                  onClick={() => {
                    log('branch', { action: 'thread-menu', open: !threadMenuOpen });
                    setThreadMenuOpen((prev) => !prev);
                  }}
                  className="flex h-[24.25px] w-[40.75px] items-center justify-center rounded-pill transition-colors hover:bg-neutral"
                >
                  <MeatballMenuIcon className="w-[18.75px] text-[#999999]" />
                </button>

                {threadMenuOpen && (
                  /* Figma 7249:84533 — 265 wide, r24, 0.7px #e5e5e5, 49px rows */
                  <div
                    role="menu"
                    className="absolute right-0 top-[34px] z-30 w-[265px] overflow-hidden rounded-[24px] border-[0.7px] border-[#e5e5e5] bg-white py-[4px] shadow-[0_1.5px_6.1px_0_rgba(64,64,64,0.25)]"
                  >
                    {THREAD_MENU_ITEMS.map((item, index) => (
                      <div key={item.id}>
                        {index > 0 && <div className="h-[0.6px] w-full bg-[#e5e5e5]" />}
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            log('branch', { threadMenuItem: item.id, wired: false });
                            setThreadMenuOpen(false);
                          }}
                          className={classNames(
                            'flex h-[49px] w-full items-center px-[16px] text-left font-sans text-[14px] leading-[24.31px] transition-colors',
                            'hover:bg-[#f6f6f6] active:bg-[#ededed]',
                            item.destructive ? 'text-[#902b20]' : 'text-content-helper'
                          )}
                        >
                          {item.label}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </header>

            {/* Scrolls internally — header above and composer below stay
                  pinned in place regardless of thread length. */}
            <div className="mt-[32px] flex min-h-0 flex-1 flex-col items-center gap-[15px] overflow-y-auto">
              {activeThread?.dayGroups.map((group) => (
                <div key={group.day} className="flex w-full flex-col items-center gap-[15px]">
                  {/* Day pill — Figma 7249:84116, #e5e5e5 at 50% FILL alpha */}
                  <span className="inline-flex items-center rounded-pill bg-[#e5e5e5]/50 px-[14px] py-[6px] font-sans text-[13px] leading-[15.51px] text-[#595959]">
                    {group.day}
                  </span>

                  <div className="flex w-full flex-col gap-[14px]">
                    {group.messages.map((message) => {
                      if (message.proposal) {
                        return (
                          /* Figma 7249:84124 — 299 wide, #faf5f1→#f1f7f4 gradient,
                               1px #00522b, r10, pad 19/25/19, right-aligned */
                          <div
                            key={message.id}
                            className="relative w-full max-w-[299px] self-end overflow-hidden rounded-[10px] border border-[#00522b]/10 px-[19px] pb-[19px] pt-[25px] shadow-[0_1px_2px_0_rgba(0,0,0,0.08)]"
                            style={{
                              // Figma 7249:84882's own style attribute, verbatim.
                              backgroundImage:
                                'linear-gradient(200.2415deg, #faf5f1 6.74%, #f1f7f4 17.33%)',
                            }}
                          >
                            {/* Figma 7249:84133 — 72.5x72.5 at left 253.8 / top -14.8 of a
                                  299x151 card, i.e. 27.3px past the RIGHT edge and 14.8px
                                  above the top. Anchored from the right so it stays put if
                                  the card renders narrower than 299. */}
                            <ProposalWatermark className="pointer-events-none absolute -top-[14.8px] -right-[27.3px] size-[72.5px]" />
                            <div className="relative flex flex-col gap-[2px]">
                              <span className="font-sans text-[12px] font-medium uppercase leading-[14.32px] tracking-[0.5px] text-brand-green">
                                {message.proposal.label}
                              </span>
                              <div className="flex flex-col gap-[6px]">
                                <div className="flex flex-col gap-[2px]">
                                  <span className="font-sans text-[16px] font-medium leading-[19.09px] text-black">
                                    {message.proposal.title}
                                  </span>
                                  <span className="font-sans text-[14px] leading-5 tracking-[0.2px] text-[#999999]">
                                    {message.proposal.company}
                                  </span>
                                </div>
                                <span className="font-sans text-[14px] leading-5 tracking-[0.2px] text-success">
                                  {message.proposal.match}
                                </span>
                              </div>
                            </div>
                            <span className="relative mt-[10px] block font-sans text-[12px] leading-[14.32px] tracking-[0.2px] text-neutral-dark-hover">
                              {message.proposal.status}
                            </span>
                          </div>
                        );
                      }

                      const fromRecruiter = message.from === 'recruiter';
                      return (
                        <div
                          key={message.id}
                          className={classNames(
                            'flex w-full max-w-[537px] flex-col gap-[6px] rounded-[12px] px-[16px] pb-[8px] pt-[14px]',
                            fromRecruiter ? 'self-end bg-[#e5e5e5]/50' : 'self-start bg-[#737373]'
                          )}
                        >
                          <span
                            className={classNames(
                              'font-sans text-[14px] leading-[19.6px]',
                              fromRecruiter ? 'text-[#595959]' : 'text-white'
                            )}
                          >
                            {message.text}
                          </span>
                          <span className="flex items-center gap-[4px] self-end">
                            <span className="font-sans text-[12px] leading-[14.32px] text-neutral-dark">
                              {message.time}
                            </span>
                            {message.receipt && (
                              <span className="font-sans text-[12px] font-medium leading-[14.32px] text-[#349643]">
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

            {/* Composer pill — Figma 7249:84147, r100, 1.21px #00522b, h60.
                `shrink-0` so it stays pinned below the scrolling messages
                above it instead of being pushed off by a long thread. */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                log('branch', { action: 'send-message', wired: false });
              }}
              className="mt-[24px] flex h-[60px] shrink-0 items-center justify-between gap-[16.88px] rounded-pill border-[1.21px] border-[#00522b]/10 py-[12px] pl-[20px] pr-[12px]"
            >
              <input
                type="text"
                placeholder={COMPOSER_PLACEHOLDER}
                className="min-w-0 flex-1 bg-transparent font-sans text-[14px] leading-[17.6px] text-black outline-none placeholder:text-[#999999]"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid h-[36px] w-[37px] shrink-0 place-items-center rounded-full bg-brand-green transition-colors hover:bg-brand-green-hover"
              >
                <SendIcon className="h-[12px] w-[13px] text-white" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
};

export default RecruiterMessagesSection;
