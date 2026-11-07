import { useEffect } from 'react';
import DashboardShell from '../dashboard/DashboardShell.jsx';
import RecruiterPageHeading from '../recruiterShared/RecruiterPageHeading.jsx';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { PAGE_HEADING, PAGE_SUBHEADING } from './recruiterMessagesData.js';
import { useRecruiterMessagesUrlState } from './useRecruiterMessagesUrlState.js';
import MessagesInboxPanel from './MessagesInboxPanel.jsx';
import MessagesThreadPanel from './MessagesThreadPanel.jsx';
import RecruiterMessagesTalentShell from './RecruiterMessagesTalentShell.jsx';
import RecruiterInboxSection from './RecruiterInboxSection.jsx';

const log = debug('RecruiterMessagesSection');

/*
 * RecruiterMessagesSection — `/recruiter/messages`. Figma section 7249:83992 "RECRUITER - MESSAGES"
 * (canvas 7249:84024 / 84410 / 84806 / 85178: VERTICAL gap 24, py 32; two panes 10px apart).
 *
 * All five frames are URLs on this one route — keys and frame table: useRecruiterMessagesUrlState.js. Data and
 * ⚠️ ASSUMPTIONS: recruiterMessagesData.js.
 *
 * RESPONSIVE (below lg) — master/detail, not two squeezed panes: `thread=open` shows the thread full-screen with a
 * back arrow (the recruiter tab bar + Career Buddy launcher are dropped via DashboardShell's `immersiveOnMobile`);
 * otherwise the conversation list. At >= lg both panes always render as in Figma.
 *
 * `view=talent` renders the same workspace inside the talent shell (RecruiterMessagesTalentShell).
 */
const RecruiterMessagesSection = () => {
  const state = useRecruiterMessagesUrlState();
  const { viewpoint, conversationId, threadOpen, viewId } = state;
  const conversation =
    viewpoint.conversations.find((item) => item.id === conversationId) ??
    viewpoint.conversations[0];

  useEffect(() => {
    log('mount/update', { viewId, conversationId, threadOpen, rail: state.railCollapsed });
  }, [viewId, conversationId, threadOpen, state.railCollapsed]);

  // The recruiter view is the Figma "Recruiter - Messages" inbox (10124:23474); the talent view keeps the earlier screens.
  if (viewId === 'recruiter') return <RecruiterInboxSection />;

  const workspace = (
    <div
      className={classNames(
        'flex h-full w-full flex-col gap-[24px] py-[32px] pl-[clamp(16px,2.3vw,40px)] pr-[clamp(16px,3.24vw,56px)] max-lg:gap-[10px] max-lg:py-[12px]',
        threadOpen && 'max-lg:gap-0 max-lg:p-0'
      )}
    >
      <RecruiterPageHeading
        lead={PAGE_HEADING.lead}
        subtitle={PAGE_SUBHEADING}
        titleStyle="sans"
        className={threadOpen ? 'max-lg:hidden' : undefined}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-[10px] lg:flex-row">
        <MessagesInboxPanel
          viewpoint={viewpoint}
          tabId={state.tabId}
          conversationId={conversationId}
          forcedHoverId={state.forcedHoverId}
          onSelectTab={state.selectTab}
          onOpenConversation={state.openConversation}
          className={threadOpen ? 'max-lg:hidden' : undefined}
        />
        <MessagesThreadPanel
          viewpoint={viewpoint}
          conversation={conversation}
          menuOpen={state.menuOpen}
          compareTalentMenu={state.compareTalentMenu}
          forcedHoverId={state.forcedHoverId}
          onSetMenuOpen={state.setMenuOpen}
          onBack={state.closeThread}
          threadOpen={threadOpen}
          className={!threadOpen ? 'max-lg:hidden' : undefined}
        />
      </div>
    </div>
  );

  if (viewId === 'talent') {
    log('branch', { shell: 'talent' });
    return <RecruiterMessagesTalentShell>{workspace}</RecruiterMessagesTalentShell>;
  }

  return (
    // `key` re-mounts the shell when ?rail= changes, because the shell only reads its initial collapsed state.
    <DashboardShell
      key={state.railCollapsed ? 'rail-collapsed' : 'rail-expanded'}
      defaultSidebarCollapsed={state.railCollapsed}
      immersiveOnMobile={threadOpen}
      mainClassName={threadOpen ? 'max-lg:pb-0!' : undefined}
    >
      {workspace}
    </DashboardShell>
  );
};

export default RecruiterMessagesSection;
