import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import { renderWorkspaceSidebar } from '../recruiterDashboard/renderWorkspaceSidebar.jsx';
import useScopedRoundedFont from '../../../hooks/useScopedRoundedFont.js';
import BannerToast from '../../ui/BannerToast.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ARCHIVED, CONVERSATIONS, PAGE, TAB_COUNTS, TOASTS } from './recruiterInboxData.js';
import RecruiterInboxList from './RecruiterInboxList.jsx';
import RecruiterThreadView from './RecruiterThreadView.jsx';
import { useLiveRecruiterInbox } from './useLiveRecruiterInbox.js';

const log = debug('RecruiterInboxSection');

/*
 * RecruiterInboxSection — `/recruiter/messages` (recruiter view). Figma "Recruiter - Messages" 10124:23474, frames R-MSG-01 … R-MSG-11. Mock data, state in the URL, no route guards:
 *   (none)                                   R-MSG-01 inbox · All, Ama Boateng's application thread open
 *   ?tab=unread                              R-MSG-09 Unread filter (Akosua open)
 *   ?tab=applicants                          R-MSG-02 Applicants filter + auto-message note
 *   ?tab=applicants&inbox=none               R-MSG-08 no new applications ("Your 2 active jobs are live")
 *   ?tab=applicants&toast=archived           R-MSG-04 archived toast with Undo
 *   ?archived=1                              R-MSG-05 archived view, Ama open;  &inbox=empty  R-MSG-07 nothing archived
 *   ?toast=unarchived                        R-MSG-06 moved back to the inbox (toast)
 *   ?conversation=none                       R-MSG-02 (second) no message selected yet
 *   ?inbox=empty                             R-MSG-11 empty inbox, first visit
 *   &conversation=<id>  &menu=thread  &thread=open (below lg: show the thread screen)
 * Archiving from the thread menu removes the row locally and shows the toast; Undo / Unarchive bring it back. ⚠️ ASSUMPTION: "Archive conversation" menu row (the frames only show its result).
 * `?view=talent` keeps the earlier talent-side screens (RecruiterMessagesSection).
 */
const FIRST_ARCHIVED_ID = ARCHIVED[0].id;

const RecruiterInboxSection = () => {
  useScopedRoundedFont('data-recruiter-ui');
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [archivedIds, setArchivedIds] = useState([]);

  const tab = ['all', 'unread', 'applicants'].includes(params.get('tab'))
    ? params.get('tab')
    : 'all';
  const inboxState = params.get('inbox'); // 'empty' | 'none' | null
  const archivedView = params.get('archived') === '1';
  const conversationParam = params.get('conversation');
  const toastKind = params.get('toast');
  const menuOpen = params.get('menu') === 'thread';
  const threadOpen = params.get('thread') === 'open';
  // Signed-in recruiter: their own conversations (demo frames otherwise).
  const live = useLiveRecruiterInbox(
    conversationParam && conversationParam !== 'none' ? conversationParam : null
  );
  const isLive = live.status !== 'demo';

  const update = useCallback(
    (patch, { push = false } = {}) => {
      const next = new URLSearchParams(window.location.search);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      log('url', Object.fromEntries(next));
      setParams(next, { replace: !push });
    },
    [setParams]
  );

  const inbox = useMemo(
    () =>
      isLive
        ? live.items
        : inboxState === 'empty'
          ? []
          : CONVERSATIONS.filter((c) => !archivedIds.includes(c.id)),
    [isLive, live.items, inboxState, archivedIds]
  );
  // Live: GET /talent-messages/conversations?folder=archived (a reply from either side brings one back).
  const archivedItems = useMemo(
    () =>
      isLive
        ? live.archived
        : inboxState === 'empty'
          ? []
          : [...CONVERSATIONS.filter((c) => archivedIds.includes(c.id)), ...ARCHIVED].filter(
              (c, i, all) => all.findIndex((x) => x.id === c.id) === i
            ),
    [isLive, live.archived, inboxState, archivedIds]
  );

  const items = archivedView
    ? archivedItems
    : tab === 'unread'
      ? inbox.filter((c) => c.unread)
      : tab === 'applicants'
        ? inboxState === 'none'
          ? []
          : inbox.filter((c) => c.applicant)
        : inbox;

  const pad = (n) => `(${String(n).padStart(2, '0')})`;
  const counts = isLive
    ? {
        all: pad(inbox.length),
        unread: pad(inbox.filter((c) => c.unread).length),
        applicants: inbox.filter((c) => c.applicant).length,
      }
    : inboxState === 'empty'
      ? TAB_COUNTS.empty
      : tab === 'unread'
        ? TAB_COUNTS.unread
        : inboxState === 'none'
          ? TAB_COUNTS.none
          : TAB_COUNTS.default;

  const selected =
    conversationParam === 'none'
      ? null
      : (items.find((c) => c.id === conversationParam) ?? items[0] ?? null);
  // Live: the first conversation opens by default; put it in the URL so its thread loads.
  const selectedId = selected?.id;
  useEffect(() => {
    if (isLive && selectedId && !conversationParam) update({ conversation: selectedId });
  }, [isLive, selectedId, conversationParam, update]);

  let emptyKind = null;
  if (!items.length)
    emptyKind = archivedView ? 'archive' : tab === 'applicants' ? 'applicants' : 'inbox';
  let rightState = 'select';
  if (archivedView) rightState = 'select-archived';
  else if (inboxState === 'empty' || (isLive && !inbox.length)) rightState = 'start';
  else if (inboxState === 'none') rightState = 'live';

  const archiveSelected = () => {
    if (!selected) return;
    log('branch', { archive: selected.id });
    if (isLive) {
      const id = selected.id;
      live
        .archive(id)
        .then((ok) =>
          ok ? update({ menu: null, thread: null, conversation: null, toast: 'archived' }) : null
        );
      return;
    }
    setArchivedIds((prev) => [...prev, selected.id]);
    update({ menu: null, thread: null, conversation: null, toast: 'archived' });
  };
  const restore = (id) => {
    log('branch', { restore: id });
    if (isLive) {
      live
        .unarchive(id)
        .then((ok) =>
          ok
            ? update(
                { archived: null, toast: 'unarchived', conversation: id, menu: null },
                { push: true }
              )
            : null
        );
      return;
    }
    setArchivedIds((prev) => prev.filter((x) => x !== id));
    update({ archived: null, toast: 'unarchived', conversation: null, menu: null }, { push: true });
  };
  const toast =
    isLive && toastKind === 'archived'
      ? {
          ...TOASTS.archived,
          title: 'Success - Conversation archived',
          message: 'Find it with the archive button next to search. A reply brings it back.',
          actionLabel: undefined,
        }
      : isLive && toastKind === 'unarchived'
        ? {
            ...TOASTS.unarchived,
            title: 'Success - Moved back to your inbox',
            message: selected?.name || '',
            actionLabel: undefined,
          }
        : TOASTS[toastKind];

  return (
    <DashboardShell
      renderSidebar={renderWorkspaceSidebar}
      immersiveOnMobile={threadOpen}
      mainClassName={threadOpen ? 'max-lg:pb-0!' : undefined}
    >
      <div
        className={classNames(
          'flex h-full w-full flex-col gap-[24px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-lg:gap-[10px] max-lg:py-[12px]',
          threadOpen && 'max-lg:gap-0 max-lg:p-0'
        )}
      >
        <header className={classNames('flex flex-col gap-[3px]', threadOpen && 'max-lg:hidden')}>
          <div className="flex items-center gap-[12px]">
            <h1
              className="m-0 font-heading font-semibold tracking-[-0.02em] text-[#1c2a21]"
              style={{ fontSize: 'clamp(1.75rem, 1.4rem + 0.7vw, 2.125rem)', lineHeight: 1.2 }}
            >
              {PAGE.title}
            </h1>
            {inboxState === 'empty' || (isLive && !inbox.some((c) => c.unread)) ? null : (
              <span className="inline-flex h-[24px] items-center rounded-full border border-solid border-[#c1d4c4] bg-[#ebf1ec] px-[10px] font-sans text-[13px] leading-[16px] font-bold text-[#1f4a2b]">
                {isLive ? `${inbox.filter((c) => c.unread).length} new` : PAGE.newBadge}
              </span>
            )}
          </div>
          <p className="m-0 font-sans text-[16px] leading-[24px] text-[#999] max-md:hidden">
            {PAGE.subtitle}
          </p>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:flex-row">
          <RecruiterInboxList
            archived={archivedView}
            items={items}
            counts={counts}
            tab={tab}
            onTab={(id) =>
              update({ tab: id === 'all' ? null : id, conversation: null, menu: null })
            }
            selectedId={selected?.id}
            onOpen={(id) => update({ conversation: id, thread: 'open', menu: null })}
            onArchiveToggle={() =>
              update(
                { archived: archivedView ? null : '1', conversation: null, menu: null },
                { push: true }
              )
            }
            onRestore={restore}
            emptyKind={emptyKind}
            onEmptyAction={() => navigate('/recruiter/talent-search')}
            className={threadOpen ? 'max-lg:hidden' : undefined}
          />
          <RecruiterThreadView
            conversation={selected}
            archived={archivedView}
            menuOpen={menuOpen}
            onMenu={(open) => update({ menu: open ? 'thread' : null })}
            onMenuItem={(id) => (id === 'archive' ? archiveSelected() : update({ menu: null }))}
            onUnarchive={() => selected && restore(selected.id)}
            onBack={() => update({ thread: null, menu: null })}
            state={rightState}
            {...(isLive
              ? {
                  liveThread:
                    live.thread && live.thread.id === selected?.id ? live.thread : { groups: [] },
                  onSend: live.send,
                  sending: live.sending,
                  error: live.error,
                }
              : {})}
            className={!threadOpen ? 'max-lg:hidden' : undefined}
          />
        </div>
      </div>

      {toast ? (
        <BannerToast
          key={toastKind}
          tone={toast.tone}
          title={toast.title}
          message={toast.message}
          actionLabel={toast.actionLabel}
          duration={0}
          onAction={() => {
            if (toastKind === 'archived') setArchivedIds((prev) => prev.slice(0, -1));
            if (toastKind === 'unarchived') setArchivedIds((prev) => [...prev, FIRST_ARCHIVED_ID]);
          }}
          onClose={() => update({ toast: null })}
        />
      ) : null}
    </DashboardShell>
  );
};

export default RecruiterInboxSection;
