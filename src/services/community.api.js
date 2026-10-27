import api from './api.js';
import { debug } from '../utils/debug.js';

const log = debug('community.api');

/*
 * Talent Community API (backend services/community.service.js + mixins/community/*, gateway /api/community).
 * `:id` accepts the Mongo id or the community slug (e.g. `frontend-devs-ghana`).
 *
 *   GET  /community?q&category                      { communities[{ id, slug, name, …, memberCount, isMember,
 *                                                    recommendation: { score, reasons } }], basedOn[] } recommended first
 *   GET  /community/me                              { communities } the caller has joined
 *   GET  /community/:id                             { community: { …, about, rules, topics, membersPreview, moderators } }
 *   POST /community/:id/join | /leave               { memberCount }
 *   GET  /community/:id/posts?purpose               { posts[{ id, kind, purpose, purposeLabel, format, content, tags, link, author, likes, likedByMe, comments }], total }
 *   POST /community/:id/posts  { content, purpose, suggestedPurpose?, suggestionConfidence?, tags, link }   { post, purposeFlagged }
 *   GET  /community/:id/purposes                    { purposes[{ value, label, singular }], allowedPurposes[], restricted, canManage }
 *   PUT  /community/:id/purposes  { allowedPurposes[] }   { allowedPurposes[], restricted }
 *   POST /community/:id/purposes/suggest  { content }    { purpose|null, label, confidence, alternatives[] }
 *   PATCH /community/:id/posts/:postId/purpose  { purpose }   { changed, purpose, label }
 *   GET  /community/:id/members?q                   { members[{ entityId, name, avatar, headline, city, skills, role }], total }
 *   GET  /community/:id/posts/:postId               { post, comments[{ …, replies[] }] }
 *   POST /community/:id/posts/:postId/comments  { content, parentCommentId? }   { comment }
 *   POST /community/:id/posts/:postId/like      { likedByMe, likes }
 *   POST /community/:id/posts/:postId/report    { reason, note? }
 *
 * Functions return the unwrapped payload and throw on failure (the hooks decide what the screen shows).
 */
const unwrap = (res) => (res?.data?.data !== undefined ? res.data.data : res?.data);
const enc = encodeURIComponent;

/**
 * Catalogue, recommended first (`recommendation: { score, reasons[{ area, label, value }] }` from the talent's profile).
 * `withMeta` returns `{ communities, basedOn }` (the profile areas that matched anything) instead of the bare list.
 */
// The unfiltered catalogue is read by /community and again by every community page
// ("Related communities"), and the backend scores it against the profile each time.
// Keep it for a minute and share a request in flight. Join / leave clear it (isMember).
const CATALOGUE_TTL_MS = 60_000;
let catalogueCache = { at: 0, data: null, promise: null };

export const invalidateCatalogue = () => {
  catalogueCache = { at: 0, data: null, promise: null };
};

const loadCatalogue = () => {
  if (catalogueCache.data && Date.now() - catalogueCache.at < CATALOGUE_TTL_MS) {
    return Promise.resolve(catalogueCache.data);
  }
  if (!catalogueCache.promise) {
    const pending = api
      .get('/community')
      .then((res) => {
        const data = unwrap(res);
        if (catalogueCache.promise === pending)
          catalogueCache = { at: Date.now(), data, promise: null };
        return data;
      })
      .catch((err) => {
        if (catalogueCache.promise === pending) catalogueCache.promise = null;
        throw err;
      });
    catalogueCache.promise = pending;
  }
  return catalogueCache.promise;
};

export const fetchCommunities = async ({ q, category, withMeta = false } = {}) => {
  const params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  const data =
    q || category ? unwrap(await api.get('/community', { params })) : await loadCatalogue();
  log('catalogue', { n: data?.communities?.length, basedOn: data?.basedOn });
  const communities = data?.communities || [];
  return withMeta ? { communities, basedOn: data?.basedOn || [] } : communities;
};

/**
 * One section of the catalogue (GET /api/community, paged). Recommended first, then most-joined.
 *   { q, category }      server-side filter
 *   { excludeJoined }    leave out joined communities ("Picked for you", "All communities")
 *   { limit, offset }    page
 * -> { communities, total, nextOffset (null at the end), catalogueTotal, basedOn,
 *      mine (joined, first page only), closest (3 suggestions when nothing matches) }
 */
const browseInFlight = new Map();

export const browseCommunities = async ({ q, category, excludeJoined, limit, offset } = {}) => {
  const params = {};
  if (q) params.q = q;
  if (category) params.category = category;
  if (excludeJoined) params.excludeJoined = true;
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
  // The same section asked for again while it is loading (effects re-run, StrictMode) shares the request.
  const key = JSON.stringify(params);
  if (!browseInFlight.has(key)) {
    const pending = api.get('/community', { params }).finally(() => browseInFlight.delete(key));
    browseInFlight.set(key, pending);
  }
  const data = unwrap(await browseInFlight.get(key));
  log('browse', params, {
    n: data?.communities?.length,
    total: data?.total,
    next: data?.nextOffset,
  });
  return {
    communities: data?.communities || [],
    total: data?.total ?? (data?.communities || []).length,
    nextOffset: data?.nextOffset ?? null,
    catalogueTotal: data?.catalogueTotal ?? null,
    basedOn: data?.basedOn || [],
    mine: data?.mine || null,
    closest: data?.closest || [],
  };
};

export const fetchCommunity = async (id) => {
  const data = unwrap(await api.get(`/community/${enc(id)}`));
  log('detail', id, { member: data?.community?.isMember });
  return data?.community || null;
};

export const joinCommunity = async (id) => {
  try {
    const data = unwrap(await api.post(`/community/${enc(id)}/join`));
    invalidateCatalogue();
    log('joined', id);
    return data;
  } catch (err) {
    // Already a member (another tab) is the state the caller wanted.
    if (err?.response?.status === 409) return { already: true };
    throw err;
  }
};

export const leaveCommunity = async (id) => {
  try {
    const data = unwrap(await api.post(`/community/${enc(id)}/leave`));
    invalidateCatalogue();
    log('left', id);
    return data;
  } catch (err) {
    if (err?.response?.status === 404 && err?.response?.data?.type === 'NOT_MEMBER')
      return { already: true };
    throw err;
  }
};

export const fetchCommunityPosts = async (id, { kind, purpose, pageSize = 30 } = {}) => {
  const params = { pageSize };
  if (kind) params.kind = kind;
  if (purpose) params.purpose = purpose;
  const data = unwrap(await api.get(`/community/${enc(id)}/posts`, { params }));
  log('posts', id, { n: data?.posts?.length, total: data?.total });
  return { posts: data?.posts || [], total: data?.total ?? 0 };
};

export const createCommunityPost = async (
  id,
  { content, kind, purpose, suggestedPurpose, suggestionConfidence, tags, link }
) => {
  const body = { content };
  if (purpose) body.purpose = purpose;
  else if (kind) body.kind = kind;
  if (suggestedPurpose) {
    body.suggestedPurpose = suggestedPurpose;
    if (typeof suggestionConfidence === 'number') body.suggestionConfidence = suggestionConfidence;
  }
  if (tags?.length) body.tags = tags;
  if (link) body.link = link;
  const data = unwrap(await api.post(`/community/${enc(id)}/posts`, body));
  const pending = data?.moderation?.status === 'pending_review';
  log('posted', id, { flagged: data?.purposeFlagged, pending });
  // pending: the pre-publish check held it for a moderator; only the author sees it until then.
  return {
    post: data?.post || null,
    flagged: Boolean(data?.purposeFlagged),
    pending,
    message: pending ? data?.moderation?.message || null : null,
  };
};

export const fetchCommunityMembers = async (id, { q, pageSize = 50 } = {}) => {
  const params = { pageSize };
  if (q) params.q = q;
  const data = unwrap(await api.get(`/community/${enc(id)}/members`, { params }));
  log('members', id, { n: data?.members?.length, total: data?.total });
  return { members: data?.members || [], total: data?.total ?? 0 };
};

export const fetchCommunityPost = async (id, postId) => {
  const data = unwrap(await api.get(`/community/${enc(id)}/posts/${enc(postId)}`));
  log('post', postId, { comments: data?.comments?.length });
  return { post: data?.post || null, comments: data?.comments || [] };
};

export const commentOnPost = async (id, postId, { content, parentCommentId }) => {
  const body = { content };
  if (parentCommentId) body.parentCommentId = parentCommentId;
  const data = unwrap(await api.post(`/community/${enc(id)}/posts/${enc(postId)}/comments`, body));
  log('commented', postId, { reply: Boolean(parentCommentId) });
  return data?.comment || null;
};

export const likePost = async (id, postId) => {
  const data = unwrap(await api.post(`/community/${enc(id)}/posts/${enc(postId)}/like`));
  log('like', postId, data?.likedByMe);
  return { likedByMe: Boolean(data?.likedByMe), likes: data?.likes ?? 0 };
};

export const reportPost = async (id, postId, { reason, note }) => {
  const body = { reason };
  if (note) body.note = note;
  await api.post(`/community/${enc(id)}/posts/${enc(postId)}/report`, body);
  log('reported', postId, reason);
};

/* Post purposes (US-5.2.2-01/02/04). */
export const fetchCommunityPurposes = async (id) => {
  const data = unwrap(await api.get(`/community/${enc(id)}/purposes`));
  return {
    allowed: data?.allowedPurposes || [],
    restricted: Boolean(data?.restricted),
    canManage: Boolean(data?.canManage),
  };
};

export const suggestCommunityPurpose = async (id, content) => {
  const data = unwrap(await api.post(`/community/${enc(id)}/purposes/suggest`, { content }));
  return data?.purpose ? { purpose: data.purpose, confidence: data.confidence ?? null } : null;
};

export const reclassifyPostPurpose = async (id, postId, purpose) =>
  unwrap(await api.patch(`/community/${enc(id)}/posts/${enc(postId)}/purpose`, { purpose }));

export const setCommunityPurposes = async (id, allowedPurposes) =>
  unwrap(await api.put(`/community/${enc(id)}/purposes`, { allowedPurposes }));
