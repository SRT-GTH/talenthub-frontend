import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { INBOX_TABS, VIEWPOINTS } from './recruiterMessagesData.js';

const log = debug('useRecruiterMessagesUrlState');

/*
 * URL state of /recruiter/messages — every Figma frame of the section is a URL (query string on the one route),
 * and clicking writes the same keys, so reload / deep link / Back all work.
 *
 *   view=recruiter|talent         whose screen: recruiter inbox (default) | the talent-side "Talents - Messages" frames
 *   tab=all|unread                inbox tab (default all)
 *   conversation=<id>             open conversation (default = first row of the viewpoint)
 *   thread=open                   below lg only: show the thread screen instead of the list
 *   menu=thread                   the thread header's options menu is open
 *   compareMenu=talent-side       also draw the iconed talent-side menu beside it (frame 7249:84379)
 *   forceHover=mute|view-profile|report|block|delete|archive|refresh
 *                                 pins the hover look of a menu row / the refresh button (the real :hover stays)
 *   rail=collapsed                collapsed icon sidebar (frames 7249:84379, 84775); default expanded
 *
 * Frame → URL
 *   7249:83993  /recruiter/messages
 *   7249:84379  /recruiter/messages?rail=collapsed&menu=thread&compareMenu=talent-side&forceHover=mute
 *   7249:84775  /recruiter/messages?rail=collapsed&tab=unread&menu=thread&forceHover=mute
 *   7249:85147  /recruiter/messages?view=talent
 *   7249:85536  /recruiter/messages?view=talent&menu=thread&forceHover=mute
 */
const VIEW_IDS = Object.keys(VIEWPOINTS);
const TAB_IDS = INBOX_TABS.map((tab) => tab.id);
const HOVER_IDS = ['view-profile', 'mute', 'archive', 'report', 'block', 'delete', 'refresh'];

const pick = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

export const useRecruiterMessagesUrlState = () => {
  const [params, setParams] = useSearchParams();

  const viewId = pick(params.get('view'), VIEW_IDS, 'recruiter');
  const viewpoint = VIEWPOINTS[viewId];
  const tabId = pick(params.get('tab'), TAB_IDS, 'all');
  const requestedConversationId = params.get('conversation');
  const conversationId = viewpoint.conversations.some((c) => c.id === requestedConversationId)
    ? requestedConversationId
    : viewpoint.conversations[0].id;
  const threadOpen = params.get('thread') === 'open';
  const menuOpen = params.get('menu') === 'thread';
  const compareTalentMenu = menuOpen && params.get('compareMenu') === 'talent-side';
  const forcedHoverId = pick(params.get('forceHover'), HOVER_IDS, null);
  const railCollapsed = params.get('rail') === 'collapsed';

  // Merge a patch into the query string (null / false / '' removes a key). `push` = new history entry.
  const update = useCallback(
    (patch, { push = false } = {}) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null || value === undefined || value === false || value === '') {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      log('update', patch, push ? 'push' : 'replace');
      setParams(next, { replace: !push });
    },
    [params, setParams]
  );

  return useMemo(() => {
    log('state', {
      viewId,
      tabId,
      conversationId,
      threadOpen,
      menuOpen,
      compareTalentMenu,
      forcedHoverId,
    });
    return {
      viewId,
      viewpoint,
      tabId,
      conversationId,
      threadOpen,
      menuOpen,
      compareTalentMenu,
      forcedHoverId,
      railCollapsed,
      selectTab: (id) => update({ tab: id === 'all' ? null : id }, { push: true }),
      openConversation: (id) =>
        update({ conversation: id, thread: 'open', menu: null, compareMenu: null }, { push: true }),
      closeThread: () =>
        update({ thread: null, menu: null, compareMenu: null, forceHover: null }, { push: true }),
      setMenuOpen: (open) =>
        update(open ? { menu: 'thread' } : { menu: null, compareMenu: null, forceHover: null }),
    };
  }, [
    viewId,
    viewpoint,
    tabId,
    conversationId,
    threadOpen,
    menuOpen,
    compareTalentMenu,
    forcedHoverId,
    railCollapsed,
    update,
  ]);
};
