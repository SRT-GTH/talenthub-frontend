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

/*
 * Pure view-model builders for the Messages page (no React). Inputs: the URL state (messagesState.js), the in-memory
 * store (messagesStore.js) and whether the viewport is the two-column layout.
 */
const BY_ID = Object.fromEntries(MESSAGE_CONVERSATIONS.map((c) => [c.id, c]));
const JOB_CARDS = {
  pending: JOB_CARD_PENDING,
  passing: JOB_CARD_PASSING,
  applied: JOB_CARD_APPLIED,
  passed: JOB_CARD_PASSED,
  closed: JOB_CARD_CLOSED,
};

export const getConversation = (id) => BY_ID[id] ?? null;

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

export const buildInbox = ({ store, messages, desktop }) => {
  const urlAccepted = messages.state === 'accepted' ? ['request'] : [];
  const acceptedIds = uniq([...store.accepted, ...urlAccepted]);
  const gone = new Set([...store.removed, ...store.declined]);
  const primaries = PRIMARY_IDS.map((id) => BY_ID[id]).filter((c) => c && !gone.has(c.id));

  const selected = messages.c && BY_ID[messages.c] ? BY_ID[messages.c] : null;
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
    const unread = conv.unread > 0 && !store.read.includes(conv.id) ? conv.unread : 0;
    return {
      id: conv.id,
      name: conv.name,
      avatar: conv.avatar,
      confidential: Boolean(conv.confidential),
      time,
      preview,
      previewTone: sent || accepted ? 'normal' : (variant.previewTone ?? 'normal'),
      unread,
      request: conv.request && !accepted,
      muted: store.muted.includes(conv.id),
      separator: false,
    };
  };

  const order = uniq([...store.order, ...urlAccepted, ...PRIMARY_IDS]);
  const rank = (id) => order.indexOf(id);
  const pendingRows = primaries.filter((c) => c.request && !isAccepted(c, acceptedIds)).map(rowOf);
  const allRows = primaries
    .filter((c) => !c.request || isAccepted(c, acceptedIds))
    .sort((a, b) => rank(a.id) - rank(b.id))
    .map(rowOf);

  const sep = new Set(['interview', 'roselyn']);
  allRows.forEach((r) => {
    r.separator = sep.has(r.id);
  });

  const seeded = messages.state === 'empty' || messages.state === 'loading';
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
  if (q) rows = rows.filter((r) => textOf(BY_ID[r.id]).includes(q));

  const activeId = selected
    ? selected.id
    : defaultConversationId(
        messages,
        desktop,
        pendingRows.map((r) => r.id)
      );
  const active = activeId ? BY_ID[activeId] : null;
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

export const jobCardFor = (convId, store, messages) => {
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
