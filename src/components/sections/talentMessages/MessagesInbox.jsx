import { useEffect, useState } from 'react';
import { useIsDesktop } from '../../../hooks/useMediaQuery.js';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { useMessagesA11yClasses } from './MessagesA11yPrefs.js';
import MessagesInboxList from './MessagesInboxList.jsx';
import MessagesThread from './MessagesThread.jsx';
import MessagesTitleRow from './MessagesHeaderArt.jsx';
import { SEED_COUNTS } from './messagesData.js';
import { buildInbox } from './messagesSelect.js';
import { messagesActions, useMessagesStore } from './messagesStore.js';
import { useLiveMessagesContext } from './useLiveMessages.js';

const log = debug('MessagesInbox');

const useOnline = () => {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
};

/*
 * MessagesInbox — the body of /messages: title row + header art, then the list pane and the conversation pane
 * (two columns from `lg`; on a phone the list and the conversation are separate screens: the list first, a row opens
 * `?c=…` with a back arrow). All state comes from the URL (messagesState.js) + the in-memory store (messagesStore.js).
 * Props: messages (useMessagesState()).
 */
const MessagesInbox = ({ messages }) => {
  const store = useMessagesStore();
  const desktop = useIsDesktop();
  const online = useOnline();
  const live = useLiveMessagesContext();
  const a11yClasses = useMessagesA11yClasses(messages);
  const loading = messages.state === 'loading' || Boolean(live && !live.loaded);
  const empty =
    messages.state === 'empty' ||
    Boolean(live && live.loaded && live.records.length === 0 && !live.error);
  const offline = messages.state === 'offline' || !online;
  const view = buildInbox({ store, messages, desktop, live });
  const [screen, setScreen] = useState(() =>
    messages.c || messages.state || messages.menu || messages.modal || messages.reply
      ? 'thread'
      : 'list'
  );
  const phoneThread = !desktop && screen === 'thread' && Boolean(view.active) && !loading && !empty;
  const showThread = desktop || (screen === 'thread' && Boolean(view.active)) || loading || empty;

  useEffect(() => {
    log('state', {
      tab: view.tab,
      active: view.activeId,
      screen,
      desktop,
      offline,
      loading,
      empty,
    });
  }, [view.tab, view.activeId, screen, desktop, offline, loading, empty]);

  const setLiveActive = live?.setActiveId;
  useEffect(() => {
    setLiveActive?.(view.activeId ?? null);
  }, [setLiveActive, view.activeId]);

  const markLiveRead = live?.actions.markRead;
  const activeUnread = view.active?.unread ?? 0;
  useEffect(() => {
    if (!view.active || !showThread) return;
    if (markLiveRead) {
      // A pending request stays unread on the server until accepted (the recruiter can't see it was read).
      if (!view.pending && activeUnread) markLiveRead(view.active.id);
      return;
    }
    messagesActions.markRead(view.active.listId);
  }, [view.active, view.pending, showThread, markLiveRead, activeUnread]);

  useEffect(() => {
    if (messages.c) setScreen('thread');
  }, [messages.c]);

  const onSelect = (id) => {
    log('select', id);
    messages.update({
      c: id,
      menu: null,
      modal: null,
      state: messages.state === 'accepted' ? 'accepted' : null,
    });
    setScreen('thread');
  };

  const counts = live ? view.counts : SEED_COUNTS;
  const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
  const stickerLabel =
    loading || empty
      ? null
      : messages.tab === 'requests'
        ? live && !counts.requests
          ? null
          : plural(counts.requests, 'request')
        : live && !counts.unread
          ? null
          : `${counts.unread} new`;
  const artCopy = live
    ? {
        label: `${plural(counts.all + counts.requests, 'recruiter')} in your inbox`,
        week: counts.requests
          ? `${plural(counts.requests, 'request')} waiting`
          : `${counts.unread} unread`,
      }
    : null;

  return (
    <div
      className={classNames(
        'flex flex-col gap-[clamp(14px,1.39vw,24px)] pb-[clamp(16px,1.85vw,32px)] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)]',
        a11yClasses
      )}
    >
      <div className={classNames(phoneThread && 'max-lg:hidden')}>
        <MessagesTitleRow
          stickerLabel={stickerLabel}
          artState={loading ? 'loading' : empty ? 'empty' : 'default'}
          copy={loading || empty ? null : artCopy}
        />
      </div>
      <div
        className={classNames(
          'flex h-[clamp(520px,47.45vw,820px)] min-h-0 gap-[10px]',
          phoneThread
            ? 'max-lg:h-[max(520px,calc(100dvh-180px))]'
            : 'max-lg:h-[max(560px,calc(100dvh-230px))]'
        )}
      >
        <MessagesInboxList
          messages={messages}
          view={view}
          loading={loading}
          empty={empty}
          onSelect={onSelect}
          live={Boolean(live)}
          hidden={showThread && !loading && !empty}
        />
        <MessagesThread
          messages={messages}
          view={view}
          store={store}
          offline={offline}
          loading={loading}
          empty={empty}
          onBack={() => setScreen('list')}
          hidden={!showThread || (!desktop && (loading || empty))}
        />
      </div>
    </div>
  );
};

export default MessagesInbox;
