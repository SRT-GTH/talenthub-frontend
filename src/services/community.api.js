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
 *   GET  /community/:id/posts?kind                  { posts[{ id, kind, content, tags, link, author, likes, likedByMe, comments }], total }
 *   POST /community/:id/posts  { content, kind, tags, link }   { post, purposeFlagged }
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
        if (catalogueCache.promise === pending) catalogueCache = { at: Date.now(), data, promise: null };
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
  const data = q || category ? unwrap(await api.get('/community', { params })) : await loadCatalogue();
  log('catalogue', { n: data?.communities?.length, basedOn: data?.basedOn });
  const communities = data?.communities || [];
  return withMeta ? { communities, basedOn: data?.basedOn || [] } : communities;
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
    if (err?.response?.status === 404 && err?.response?.data?.type === 'NOT_MEMBER') return { already: true };
    throw err;
  }
};

export const fetchCommunityPosts = async (id, { kind, pageSize = 30 } = {}) => {
  const params = { pageSize };
  if (kind) params.kind = kind;
  const data = unwrap(await api.get(`/community/${enc(id)}/posts`, { params }));
  log('posts', id, { n: data?.posts?.length, total: data?.total });
  return { posts: data?.posts || [], total: data?.total ?? 0 };
};

export const createCommunityPost = async (id, { content, kind, tags, link }) => {
  const body = { content, kind };
  if (tags?.length) body.tags = tags;
  if (link) body.link = link;
  const data = unwrap(await api.post(`/community/${enc(id)}/posts`, body));
  log('posted', id, { flagged: data?.purposeFlagged });
  return { post: data?.post || null, flagged: Boolean(data?.purposeFlagged) };
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
