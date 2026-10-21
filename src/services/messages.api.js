import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('messages.api');

/*
 * Talent Messages API (backend services/talentMessages.service.js, gateway /api/talent-messages). The signed-in talent's
 * own recruiter conversations, shaped for the /messages screens.
 *   GET    /talent-messages/conversations            { conversations: Row[], counts: { all, unread, requests } }
 *   GET    /talent-messages/conversations/:id        { conversation: Row, messages: Msg[], job: Job | null }
 *                                                     ?withJob=false skips the job (no `job`, no `reChip`): for polling
 *   POST   /talent-messages/conversations/:id/messages     { text }            -> { message: Msg }
 *   POST   /talent-messages/conversations/:id/read
 *   POST   /talent-messages/conversations/:id/accept
 *   POST   /talent-messages/conversations/:id/decline      { spam? }
 *   POST   /talent-messages/conversations/:id/mute         { muted }
 *   POST   /talent-messages/conversations/:id/archive
 *   DELETE /talent-messages/conversations/:id              hide it from the talent's inbox
 *   POST   /talent-messages/conversations/:id/job          { action: 'pass' | 'undo' | 'apply', reason? } -> { job }
 *   GET    /talent-messages/unread-count                    { unread }
 * Row: { id, name, role, avatarUrl, initials, label, reChip, lastMessageAt, preview, previewFromMe, unread, request,
 *        muted, confidential, startedByMe }
 * Msg: { id, from: 'me' | 'them', text, at (ISO), status: 'delivered' | 'read' }
 * Job: { id, state: 'pending'|'passed'|'applied'|'closed', company, role, tags[], matchPercent, skillsLabel, reason }
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const base = '/talent-messages';
const conv = (id) => `${base}/conversations/${encodeURIComponent(id)}`;

export const MESSAGES_CHANGED = 'gth:messages-changed';

export const notifyMessagesChanged = () => {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(MESSAGES_CHANGED));
};

export const fetchConversations = async () => {
  const data = unwrap(await api.get(`${base}/conversations`));
  log('inbox', { rows: data?.conversations?.length, counts: data?.counts });
  return data;
};

export const fetchConversation = async (id, { withJob = true } = {}) => {
  const data = unwrap(
    await api.get(conv(id), withJob ? undefined : { params: { withJob: false } })
  );
  log('conversation', { id, messages: data?.messages?.length, job: data?.job?.state });
  return data;
};

export const sendMessage = async (id, text) =>
  unwrap(await api.post(`${conv(id)}/messages`, { text }))?.message;

export const markConversationRead = async (id) => unwrap(await api.post(`${conv(id)}/read`, {}));

export const acceptRequest = async (id) => unwrap(await api.post(`${conv(id)}/accept`, {}));

export const declineRequest = async (id, { spam = false } = {}) =>
  unwrap(await api.post(`${conv(id)}/decline`, { spam }));

export const muteConversation = async (id, muted) =>
  unwrap(await api.post(`${conv(id)}/mute`, { muted }));

export const archiveConversation = async (id) => unwrap(await api.post(`${conv(id)}/archive`, {}));

export const deleteConversation = async (id) => unwrap(await api.delete(conv(id)));

export const updateJobCard = async (id, action, reason) =>
  unwrap(await api.post(`${conv(id)}/job`, { action, ...(reason ? { reason } : {}) }))?.job;

export const fetchUnreadMessages = async () =>
  unwrap(await api.get(`${base}/unread-count`))?.unread ?? 0;
