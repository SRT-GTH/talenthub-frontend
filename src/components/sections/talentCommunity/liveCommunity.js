import { COMMUNITIES_RESPONSE, COMMUNITY_CATEGORIES, COMMUNITY_DETAILS } from './communityData.js';

/*
 * Live Community mappers — backend records (services/community.api.js) -> the shapes GubliAS's Community v2
 * components already draw (COMMUNITIES_RESPONSE cards, COMMUNITY_DETAILS pages, feed posts, members).
 * Pure functions; the hooks in useLiveCommunity.js call them.
 *
 * ⚠️ ASSUMPTIONS (no backend data yet):
 *   - Covers / collage photos are the bundled Figma images, picked by slug (`coverKey`); unknown slugs reuse the
 *     Software Engineering cover and the Frontend collage.
 *   - "Picked for you" / the cover pill come from the backend's profile score (school, career goals, interests, industries,
 *     skills, location — `recommendation.reasons`); communities with no match fall back to the most-joined.
 *   - "Activity": the backend has no activity metric, so cards read "New community" under 25 members, else "Public".
 *   - No events backend: the hero hides the events line and the Events tab shows no count.
 *   - People without a photo get an initials avatar (data URI) instead of a Figma face.
 */

const COVERS = Object.fromEntries(COMMUNITIES_RESPONSE.communities.map((c) => [c.id, c.cover]));
const DEFAULT_COVER = COVERS['software-engineering-ghana'];
const CATEGORY_LABEL = Object.fromEntries(COMMUNITY_CATEGORIES.map((c) => [c.id, c.label]));
const FRONTEND = COMMUNITY_DETAILS['frontend-devs-ghana'];

const KIND_LABEL = {
  update: 'Update',
  achievement: 'Achievement',
  question: 'Question',
  resource: 'Resource',
};

export const formatCount = (n) => Number(n || 0).toLocaleString('en-US');
export const membersLabel = (n) => `${formatCount(n)} ${n === 1 ? 'member' : 'members'}`;
export const coverFor = (c) => COVERS[c?.coverKey] || COVERS[c?.slug] || DEFAULT_COVER;
const activityOf = (c) => (c.memberCount < 25 ? 'New community' : 'Public');

const PALETTE = ['#387440', '#c8951a', '#2f5d8a', '#8a3b5d', '#5b4a8a', '#3b7a78'];

/** Initials avatar as an SVG data URI (stable colour per name). */
export const initialsAvatar = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const initials =
    ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() ||
    '?';
  let hash = 0;
  for (const ch of String(name)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const bg = PALETTE[hash % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="${bg}"/><text x="32" y="41" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const avatarOf = (person) => person?.avatar || initialsAvatar(person?.name);

/** "Just now" / "5 minutes ago" / "2 hours ago" / "3 days ago" / "12 Oct". */
export const timeAgo = (iso, now = Date.now()) => {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const s = Math.max(0, Math.round((now - t) / 1000));
  if (s < 60) return 'Just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} ${m === 1 ? 'minute' : 'minutes'} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} ${d === 1 ? 'day' : 'days'} ago`;
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/* ---- browse ---- */

/* Profile areas the backend scores (utils/communityView.js AREAS) -> the words "Picked for you" uses. */
export const AREA_WORDS = {
  education: 'school',
  careers: 'career goals',
  interests: 'interests',
  industries: 'target industries',
  skills: 'skills',
  location: 'location',
};

/** "Based on your school, career goals and skills" from the areas that matched anything. */
export const basedOnNote = (areas = []) => {
  const words = Object.keys(AREA_WORDS)
    .filter((a) => areas.includes(a))
    .map((a) => AREA_WORDS[a]);
  if (!words.length) return null;
  const list =
    words.length < 2 ? words[0] : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
  return `Based on your ${list}`;
};

export const toCard = (c) => {
  const reasons = c.recommendation?.reasons || [];
  const top = reasons[0];
  return {
    id: c.slug,
    apiId: c.id,
    name: c.name,
    members: c.memberCount,
    activity: activityOf(c),
    description: c.description,
    cover: coverFor(c),
    categories: c.categories || [],
    topics: [...(c.topics || []), ...(c.institutions || [])],
    joined: Boolean(c.isMember),
    score: c.recommendation?.score || 0,
    reasons,
    // Cover pill: "You’re in" when joined, else why it is recommended (e.g. "Your school").
    tag: c.isMember
      ? { kind: 'joined', label: 'You’re in' }
      : top
        ? { kind: 'highlight', label: top.label }
        : null,
  };
};

/* ---- feed ---- */

const postBody = (p) => {
  const tags = (p.tags || []).map((t) => `#${String(t).replace(/^#/, '')}`).join(' ');
  return [p.content, tags, p.link].filter(Boolean).join('\n\n');
};

export const toPost = (p) => ({
  id: p.id,
  author: {
    name: p.author?.name || 'GTH member',
    avatar: avatarOf(p.author),
    me: p.mine || undefined,
  },
  kind: KIND_LABEL[p.kind] || 'Update',
  kindId: p.kind || 'update',
  // US-5.2.2-01: the purpose badge replaces the kind sticker when the post has one.
  purpose: p.purpose || undefined,
  purposeLabel: p.purposeLabel || undefined,
  time: timeAgo(p.publishedAt),
  body: postBody(p),
  images: p.images?.length ? p.images.slice(0, 3) : undefined,
  likes: p.likes || 0,
  comments: p.comments || 0,
  liked: Boolean(p.likedByMe),
  // The author's own post waiting for a moderator, or turned down by one (the API sends these to their author only).
  pending: Boolean(p.pending) || undefined,
  rejected: Boolean(p.rejected) || undefined,
  rejectedReason: p.rejectedReason || undefined,
});

/** PostComments-style comment: { id, author, time, text, likes, avatar, me, replies[] }. */
export const toComment = (c, meId) => ({
  id: c.id,
  author: c.author?.name || 'GTH member',
  avatar: avatarOf(c.author),
  me: Boolean(meId && c.author?.entityId === meId) || undefined,
  time: timeAgo(c.createdAt),
  text: c.content,
  likes: c.likes || 0,
  replies: (c.replies || []).map((r) => toComment(r, meId)),
});

/* ---- members ---- */

export const toMember = (m, meId) => ({
  id: m.entityId,
  me: Boolean(meId && m.entityId === meId) || undefined,
  name: m.name,
  avatar: avatarOf(m),
  badge: m.role === 'moderator' ? { kind: 'moderator', label: 'Moderator' } : null,
  role: [m.headline, m.city].filter(Boolean).join(' · ') || 'GTH member',
  city: m.city || '',
  skills: m.skills || [],
  following: false,
});

/* ---- detail ---- */

const collageFor = (c) => {
  const drawn = COMMUNITY_DETAILS[c.slug]?.collage;
  if (drawn) return drawn;
  const [first, ...rest] = FRONTEND.collage;
  return [{ ...first, src: coverFor(c) }, ...rest];
};

const createdLabel = (iso) => {
  const t = new Date(typeof iso === 'number' ? iso : iso || NaN);
  return Number.isFinite(t.getTime())
    ? t.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : '—';
};

/**
 * COMMUNITY_DETAILS-shaped page data.
 *   c        GET /community/:id `community`
 *   posts    mapped feed posts (toPost)
 *   people   mapped members (toMember) — the Members tab
 *   catalogue  browse cards (toCard) — "Related communities"
 */
export const toDetail = (c, { posts = [], people = [], catalogue = [] } = {}) => {
  const preview = (c.membersPreview || []).map((m) => ({ ...m, avatar: avatarOf(m) }));
  const others = Math.max(0, c.memberCount - 1);
  const firstNames = preview.slice(0, 2).map((m) => m.name.split(' ')[0]);
  const category = (c.categories || []).map((id) => CATEGORY_LABEL[id]).find(Boolean);
  const related = catalogue
    .filter(
      (x) => x.id !== c.slug && x.categories.some((cat) => (c.categories || []).includes(cat))
    )
    .concat(catalogue.filter((x) => x.id !== c.slug))
    .filter((x, i, all) => all.findIndex((y) => y.id === x.id) === i)
    .slice(0, 3)
    .map((x) => ({ id: x.id, name: x.name, members: membersLabel(x.members), thumb: x.cover }));
  const moderators = (c.moderators || []).map((m) => ({
    name: m.name,
    role: [m.headline, m.city].filter(Boolean).join(' · ') || 'Moderator',
    avatar: avatarOf(m),
  }));
  return {
    id: c.slug,
    apiId: c.id,
    name: `#${c.name}`,
    sticker: `${category || 'Community'} · ${c.visibility === 'public' ? 'Public' : 'Private'}`,
    members: c.memberCount,
    membersLabel: membersLabel(c.memberCount),
    activity: activityOf(c),
    events: null,
    eventsCount: null,
    description: c.description,
    faces: c.isMember
      ? others
        ? `You + ${formatCount(others)} ${others === 1 ? 'other' : 'others'}`
        : 'You’re the first member'
      : '',
    previewFaces: firstNames.length
      ? `${firstNames.join(', ')}${c.memberCount > firstNames.length ? ` + ${formatCount(c.memberCount - firstNames.length)} more` : ''}`
      : 'Be the first to join',
    facesImages: preview.slice(0, 3).map((m) => m.avatar),
    collage: collageFor(c),
    info: {
      members: formatCount(c.memberCount),
      activity: activityOf(c),
      visibility: c.visibility === 'public' ? 'Public' : 'Private',
      moderatedBy: c.moderatorCount
        ? `GTH + ${c.moderatorCount} ${c.moderatorCount === 1 ? 'member' : 'members'}`
        : 'GTH',
    },
    contributorsTitle: 'Newest members',
    contributors: preview.map((m) => ({
      name: m.name,
      active: m.city || m.headline || 'Member',
      online: false,
      avatar: m.avatar,
    })),
    topicsTitle: 'Topics',
    topics: c.topics || [],
    related,
    posts,
    about: {
      text: c.about || c.description,
      audience: c.audience || [],
      rules: c.rules || [],
      moderators: moderators.length
        ? moderators
        : [{ name: 'GTH Community Team', role: 'Ghana Talent Hub', avatar: DEFAULT_COVER }],
      facts: [
        { id: 'created', icon: 'calendar', label: 'Created', value: createdLabel(c.createdAt) },
        { id: 'language', icon: 'globe', label: 'Language', value: c.language || 'English' },
        { id: 'joined', icon: 'users', label: 'Members', value: formatCount(c.memberCount) },
      ],
    },
    people,
    membersSearch: `Search ${membersLabel(c.memberCount)}`,
    moreMembers: false,
  };
};
