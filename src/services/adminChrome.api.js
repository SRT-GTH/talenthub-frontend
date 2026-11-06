import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('adminChrome.api');

/*
 * Platform Admin top bar (backend services/adminChrome.service.js + messaging / notifications gateways).
 *
 *   GET  /admin/chrome/counts                          { notifications, messages }  (null = couldn't count)
 *   GET  /admin/chrome/conversations?limit             { conversations: [{ id, title, withWhom, lastMessage, lastMessageAt, unreadCount }] }
 *   GET  /admin/chrome/search?q                        { accounts, settings, canSearchAccounts }
 *   GET  /messaging/conversations/:id/messages         a conversation's messages
 *   POST /messaging/conversations/:id/messages         reply { content }
 *   POST /messaging/conversations/:id/read             mark read
 */
const body = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
export const COUNTS_CHANGED = 'gth:admin-counts-changed';
export const countsChanged = () => window.dispatchEvent(new Event(COUNTS_CHANGED));

export const chromeCounts = async () => body(await api.get('/admin/chrome/counts'));
export const chromeConversations = async (limit = 20) =>
  body(await api.get('/admin/chrome/conversations', { params: { limit } }));
export const chromeSearch = async (q) =>
  body(await api.get('/admin/chrome/search', { params: { q } }));

export const conversationMessages = async (id, limit = 50) => {
  const data = body(
    await api.get(`/messaging/conversations/${encodeURIComponent(id)}/messages`, {
      params: { limit },
    })
  );
  return data?.messages || data?.rows || (Array.isArray(data) ? data : []);
};
export const replyToConversation = async (id, content) => {
  const data = body(
    await api.post(`/messaging/conversations/${encodeURIComponent(id)}/messages`, { content })
  );
  log('replied', id);
  return data;
};
export const markConversationRead = async (id) =>
  body(await api.post(`/messaging/conversations/${encodeURIComponent(id)}/read`, {}));
