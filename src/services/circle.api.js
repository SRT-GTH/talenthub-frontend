import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('circle.api');

/*
 * My Circle (backend circle.service, Epic 5.3.1). People are talents, identified by their entity id.
 *
 *   GET    /circle/discover              { audience, empty, invitationsPreview, suggestions, minor? }
 *   GET    /circle/summary               { inCircle, pendingInvitations, sentPending }
 *   GET    /circle/invitations           { received: [card + requestId, note, sentAt], sent: [...] }
 *   GET    /circle/connections?offset=   { total, items: [card + connectionId, connectedAt, muted] }
 *   GET    /circle/search?q=             { items: [card + status] }
 *   GET    /circle/people/:id            card + status ('none' | 'pending-sent' | 'invited' | 'connected'), requestId
 *   POST   /circle/requests              { personId, note?, source? }
 *   DELETE /circle/requests/:id          withdraw / undo
 *   POST   /circle/requests/:id/respond  { response: 'accept' | 'ignore' }
 *   POST   /circle/dismissals · DELETE /circle/connections/:personId · POST /circle/mutes · DELETE /circle/mutes/:id
 *   POST   /circle/blocks · POST /circle/reports
 *   GET    /circle/feed?offset=          { total, items: [post card] }  "From your circle" (US-5.3.1-04)
 *   POST   /circle/posts                 { content, audience, purpose, link?, tags? }  { post, moderation }
 *
 * A card: { id, name, firstName, photo, headline, town, region, mutual, shares: [{ kind, label }], reason, buddy }.
 */

const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);

export const circleApi = {
  feed: async (offset = 0) => unwrap(await api.get('/circle/feed', { params: { offset } })),
  createPost: async (body) => unwrap(await api.post('/circle/posts', body)),
  discover: async () => {
    const out = unwrap(await api.get('/circle/discover'));
    log('discover', out?.audience, out?.suggestions?.items?.length);
    return out;
  },
  summary: async () => unwrap(await api.get('/circle/summary')),
  invitations: async () => unwrap(await api.get('/circle/invitations')),
  connections: async (offset = 0) =>
    unwrap(await api.get('/circle/connections', { params: { offset } })),
  search: async (q) => unwrap(await api.get('/circle/search', { params: { q } })),
  person: async (id) => unwrap(await api.get(`/circle/people/${encodeURIComponent(id)}`)),
  linkUp: async (personId, note = '', source = 'discover') =>
    unwrap(await api.post('/circle/requests', { personId, note, source })),
  withdraw: async (requestId) =>
    unwrap(await api.delete(`/circle/requests/${encodeURIComponent(requestId)}`)),
  respond: async (requestId, response) =>
    unwrap(
      await api.post(`/circle/requests/${encodeURIComponent(requestId)}/respond`, { response })
    ),
  dismiss: async (personId) => unwrap(await api.post('/circle/dismissals', { personId })),
  remove: async (personId) =>
    unwrap(await api.delete(`/circle/connections/${encodeURIComponent(personId)}`)),
  mute: async (personId) => unwrap(await api.post('/circle/mutes', { personId })),
  unmute: async (personId) =>
    unwrap(await api.delete(`/circle/mutes/${encodeURIComponent(personId)}`)),
  block: async (personId) => unwrap(await api.post('/circle/blocks', { personId })),
  report: async (personId, reason) =>
    unwrap(await api.post('/circle/reports', { personId, reason })),
};

/** The server's message when it's written for people (403 minors rule, 400 note, 409, 429), else a fallback. */
export const circleErrorText = (err, fallback = 'That didn’t work. Please try again.') => {
  const data = err?.response?.data;
  const status = err?.response?.status;
  if (data?.message && status && status < 500) return data.message;
  return fallback;
};

/** "2 days ago" for a request or connection date. */
export const agoText = (date, now = Date.now()) => {
  const t = new Date(date).getTime();
  if (!Number.isFinite(t)) return '';
  const mins = Math.max(0, Math.round((now - t) / 60000));
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.round(days / 7);
  if (days < 30) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? '' : 's'} ago`;
};
