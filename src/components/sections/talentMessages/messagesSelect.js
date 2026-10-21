import { MESSAGE_CONVERSATIONS, PRIMARY_IDS, SEED_COUNTS } from './messagesData.js';
import {
  INTERVIEW_CARD_CONFIRMED,
  INTERVIEW_CARD_INVITE,
  JOB_CARD_APPLIED,
  JOB_CARD_CLOSED,
  JOB_CARD_PASSED,
  JOB_CARD_PASSING,
  JOB_CARD_PENDING,
} from './cards/messageCardsData.js';
import { jobCardFromApi } from './messagesLive.js';

/*
 * Pure view-model builders for the Messages page (no React). Inputs: the URL state (messagesState.js), the in-memory
 * store (messagesStore.js), whether the viewport is the two-column layout, and `live` (useLiveMessages.js) — when set,
 * the signed-in talent's real conversations replace the drawn mock records (same record shape, see messagesLive.js).
 */
const BY_ID = Object.fromEntries(MESSAGE_CONVERSATIONS.map((c) => [c.id, c]));
const JOB_CARDS = {
  pending: JOB_CARD_PENDING,
  passing: JOB_CARD_PASSING,
  applied: JOB_CARD_APPLIED,
  passed: JOB_CARD_PASSED,
  closed: JOB_CARD_CLOSED,
};

export const getConversation = (id, live = null) => (live ? live.byId[id] : BY_ID[id]) ?? null;

/* Conversation keys of the drawn mock: `?c=owura` etc. always draw the frames, even when signed in. */
export const MOCK_CONVERSATION_IDS = MESSAGE_CONVERSATIONS.map((c) => c.id);

const uniq = (list) => [...new Set(list)];

const isAccepted = (conv, acceptedIds) => conv.request && acceptedIds.includes(conv.id);

export const effectiveTab = (messages) =>
  messages.state === 'accepted' && messages.tab === 'requests' ? 'all' : messages.tab;

export const defaultConversationId = (messages, desktop, pendingIds) => {
  if (messages.state === 'empty' || messages.state === 'loading') return null;
  if (messages.state === 'offline') return 'abigail';
  if (effectiveTab(messages) === 'requests' && pendingIds.length) return pendingIds[0];
  return desktop ? 'owura' : null;
};

const textOf = (conv) =>
  [conv.name, conv.preview, ...conv.thread.map((i) => i.text ?? '')].join(' ').toLowerCase();

export const buildInbox = ({ store, messages, desktop, live = null }) => {
  const byId = live ? live.byId : BY_ID;
  const ids = live ? live.records.map((r) => r.id) : PRIMARY_IDS;
  const urlAccepted = !live && messages.state === 'accepted' ? ['request'] : [];
  const acceptedIds = uniq([...store.accepted, ...urlAccepted]);
  const gone = new Set([...store.removed, ...store.declined]);
  const primaries = ids.map((id) => byId[id]).filter((c) => c && !gone.has(c.id));

  const selected = messages.c && byId[messages.c] ? byId[messages.c] : null;
  const sentOf = (id) => store.sent[id] ?? [];
  const lastSent = (conv) => sentOf(conv.id).at(-1) ?? null;

  const rowOf = (conv) => {
    const variant = selected && selected.listId === conv.id ? selected : conv;
    const accepted = isAccepted(conv, acceptedIds);
    const sent = lastSent(conv);
    let { preview, time } = variant;
    if (accepted && conv.acceptedRow) {
      time = conv.acceptedRow.time;
      preview = conv.acceptedRow.preview ?? preview;
    }
    if (sent) {
      preview = `You: ${sent.text}`;
      time = sent.time;
    }
    const unread =
      conv.unread > 0 && (live ? conv.id !== messages.c : !store.read.includes(conv.id))
        ? conv.unread
        : 0;
    return {
      id: conv.id,
      name: conv.name,
      avatar: conv.avatar,
      initials: conv.initials ?? '',
      confidential: Boolean(conv.confidential),
      time,
      preview,
      previewTone: sent || accepted ? 'normal' : (variant.previewTone ?? 'normal'),
      unread,
      request: conv.request && !accepted,
      muted: live ? Boolean(conv.muted) : store.muted.includes(conv.id),
      separator: false,
    };
  };

  const order = uniq([...store.order, ...urlAccepted, ...ids]);
  const rank = (id) => order.indexOf(id);
  const pendingRows = primaries.filter((c) => c.request && !isAccepted(c, acceptedIds)).map(rowOf);
  const allRows = primaries
    .filter((c) => !c.request || isAccepted(c, acceptedIds))
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map(rowOf);

  const sep = new Set(live ? [] : ['interview', 'roselyn']);
  allRows.forEach((r) => {
    r.separator = sep.has(r.id);
  });

  const seeded = !live && (messages.state === 'empty' || messages.state === 'loading');
  const counts = seeded
    ? SEED_COUNTS
    : {
        all: allRows.length,
        unread: allRows.filter((r) => r.unread > 0).length,
        requests: pendingRows.length,
      };

  const tab = effectiveTab(messages);
  let rows =
    tab === 'requests'
      ? pendingRows
      : tab === 'unread'
        ? allRows.filter((r) => r.unread > 0)
        : allRows;
  const q = (messages.q ?? '').trim().toLowerCase();
  if (q) rows = rows.filter((r) => textOf(byId[r.id]).includes(q));

  const liveDefault = () => {
    if (tab === 'requests') return pendingRows[0]?.id ?? null;
    return desktop ? (rows[0]?.id ?? null) : null;
  };
  const activeId = selected
    ? selected.id
    : live
      ? liveDefault()
      : defaultConversationId(
          messages,
          desktop,
          pendingRows.map((r) => r.id)
        );
  const active = activeId ? byId[activeId] : null;
  const activeListId = active ? active.listId : null;
  const pending = Boolean(active && active.request && !acceptedIds.includes(active.id));

  return {
    rows,
    counts,
    tab,
    activeId,
    active,
    activeListId,
    pending,
    acceptedIds,
    requestsNotice: tab === 'requests' && !seeded,
  };
};

export const jobCardFor = (convId, store, messages, live = null) => {
  if (live) {
    const job = live.byId[convId]?.job;
    if (!job) return null;
    const local = store.card[convId];
    return jobCardFromApi(local ? { ...job, state: local } : job);
  }
  const base = BY_ID[convId]?.thread.find((i) => i.kind === 'jobCard');
  if (!base) return null;
  let state = store.card[convId] ?? base.card.state;
  if (convId === 'owura' && messages.modal === 'not-interested') state = 'passing';
  return JOB_CARDS[state] ?? base.card;
};

export const interviewCardFor = (messages) =>
  messages.state === 'confirmed' ? INTERVIEW_CARD_CONFIRMED : INTERVIEW_CARD_INVITE;

export const threadFor = ({ conv, store, messages, acceptedIds }) => {
  if (!conv) return [];
  const confirmed = messages.state === 'confirmed';
  let items = conv.thread.filter((i) => {
    if (i.when === 'confirmed') return confirmed;
    if (i.when === 'accepted') return acceptedIds.includes(conv.id);
    return true;
  });
  // T-MSG-05 draws the conversation at the moment the talent taps "Not interested": the thread ends at the recruiter's
  // last bubble (no later messages, no reaction, no typing indicator).
  if (conv.id === 'owura' && messages.modal === 'not-interested') {
    const cut = items.findIndex((i) => i.kind === 'sent');
    if (cut > 0)
      items = items.slice(0, cut).map((i) => (i.reaction ? { ...i, reaction: null } : i));
  }
  const sent = (store.sent[conv.id] ?? []).map((i) => ({ ...i }));
  return [...items, ...sent].map((i) =>
    i.kind === 'sent' ? { ...i, status: store.status[i.id] ?? i.status ?? 'delivered' } : i
  );
};
