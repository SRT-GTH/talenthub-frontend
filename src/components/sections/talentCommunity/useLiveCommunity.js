import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debug } from '../../../utils/debug.js';
import {
  browseCommunities,
  commentOnPost,
  createCommunityPost,
  fetchCommunities,
  fetchCommunity,
  fetchCommunityMembers,
  fetchCommunityPost,
  fetchCommunityPosts,
  joinCommunity,
  leaveCommunity,
  likePost,
  reportPost,
} from '../../../services/community.api.js';
import { currentEntityId } from '../../../services/careerBuddy.api.js';
import { toCard, toComment, toDetail, toMember, toPost } from './liveCommunity.js';

const log = debug('useLiveCommunity');

/*
 * Live Community data (GET/POST /api/community/*). Every hook returns { status: 'loading' | 'ready' | 'error' |
 * 'missing', … }. Actions update local state optimistically where the screen expects an instant change
 * (join, like) and roll back if the call fails.
 */

/** "Picked for you" size, and the page size for "All communities" and search results. */
export const BROWSE_PICKED = 8;
export const BROWSE_PAGE = 24;

const markJoined = (c, joined) => ({
  ...c,
  joined,
  members: Math.max(0, c.members + (joined === c.joined ? 0 : joined ? 1 : -1)),
  tag: joined
    ? { kind: 'joined', label: 'You’re in' }
    : c.reasons[0]
      ? { kind: 'highlight', label: c.reasons[0].label }
      : null,
});

/**
 * Catalogue for /community, one section at a time (GET /api/community is paged):
 *   default      "Picked for you": the first 8 not-joined (recommended first, then most-joined)
 *   view=all     "All communities": not-joined, BROWSE_PAGE at a time, loadMore() for the next page
 *   cat / q      search results (filtered on the server), BROWSE_PAGE at a time
 * `mine` (joined) comes with every first page; `closest` is set when a search finds nothing.
 * The search term is debounced; a newer request always wins over an older one.
 */
export const useLiveBrowse = ({ cat = null, q = '', view = null } = {}) => {
  const term = (q || '').trim();
  const [debounced, setDebounced] = useState(term);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), term ? 300 : 0);
    return () => clearTimeout(t);
  }, [term]);

  const mode = cat || debounced ? 'search' : view === 'all' ? 'all' : 'picked';
  const query = useMemo(
    () =>
      mode === 'search'
        ? { q: debounced || undefined, category: cat || undefined, limit: BROWSE_PAGE }
        : { excludeJoined: true, limit: mode === 'all' ? BROWSE_PAGE : BROWSE_PICKED },
    [mode, debounced, cat]
  );

  const [state, setState] = useState({
    status: 'loading',
    mode,
    cards: [],
    mine: [],
    closest: [],
    total: 0,
    catalogueTotal: null,
    basedOn: [],
    nextOffset: null,
    loadingMore: false,
  });
  const seq = useRef(0);

  const load = useCallback(async () => {
    const id = ++seq.current;
    // Keep what is on screen while a filter change loads; only the first load shows skeletons.
    setState((s) => ({ ...s, status: s.status === 'ready' ? 'refreshing' : 'loading' }));
    try {
      const d = await browseCommunities(query);
      if (id !== seq.current) return;
      setState((s) => ({
        status: 'ready',
        mode,
        cards: d.communities.map(toCard),
        mine: d.mine ? d.mine.map(toCard) : s.mine,
        closest: d.closest.map(toCard),
        total: d.total,
        catalogueTotal: d.catalogueTotal ?? s.catalogueTotal,
        basedOn: d.basedOn,
        nextOffset: d.nextOffset,
        loadingMore: false,
      }));
    } catch (err) {
      if (id !== seq.current) return;
      log('browse failed', err?.response?.status || err?.message);
      setState((s) => ({ ...s, status: 'error', loadingMore: false }));
    }
  }, [query, mode]);

  useEffect(() => {
    load();
  }, [load]);

  const loadMore = useCallback(async () => {
    if (state.nextOffset == null || state.loadingMore) return;
    const id = seq.current;
    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const d = await browseCommunities({ ...query, offset: state.nextOffset });
      if (id !== seq.current) return; // the filter changed meanwhile
      setState((s) => {
        const seen = new Set(s.cards.map((c) => c.id));
        return {
          ...s,
          cards: [...s.cards, ...d.communities.map(toCard).filter((c) => !seen.has(c.id))],
          nextOffset: d.nextOffset,
          total: d.total,
          loadingMore: false,
        };
      });
    } catch (err) {
      if (id !== seq.current) return;
      log('load more failed', err?.response?.status || err?.message);
      setState((s) => ({ ...s, loadingMore: false }));
    }
  }, [query, state.nextOffset, state.loadingMore]);

  const setJoined = useCallback((slug, joined) => {
    const flip = (list) => list.map((c) => (c.id === slug ? markJoined(c, joined) : c));
    setState((s) => {
      const card = [...s.cards, ...s.closest, ...s.mine].find((c) => c.id === slug);
      const mine = joined
        ? s.mine.some((c) => c.id === slug) || !card
          ? flip(s.mine)
          : [...s.mine, markJoined(card, true)]
        : s.mine.filter((c) => c.id !== slug);
      return { ...s, cards: flip(s.cards), closest: flip(s.closest), mine };
    });
  }, []);

  const join = useCallback(
    async (slug) => {
      setJoined(slug, true);
      try {
        await joinCommunity(slug);
        return true;
      } catch (err) {
        log('join failed', slug, err?.response?.status);
        setJoined(slug, false);
        return false;
      }
    },
    [setJoined]
  );

  const leave = useCallback(
    async (slug) => {
      setJoined(slug, false);
      try {
        await leaveCommunity(slug);
        return true;
      } catch (err) {
        log('leave failed', slug, err?.response?.status);
        setJoined(slug, true);
        return false;
      }
    },
    [setJoined]
  );

  return { ...state, searching: mode === 'search', reload: load, loadMore, join, leave };
};

/**
 * One community: detail + feed + members + catalogue (for "Related communities").
 * `detail` is COMMUNITY_DETAILS-shaped; `joined` comes from the server.
 */
export const useLiveCommunityPage = (slug) => {
  const [base, setBase] = useState(null); // raw community
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [status, setStatus] = useState('loading');
  const alive = useRef(true);

  const loadPosts = useCallback(async () => {
    const { posts: rows } = await fetchCommunityPosts(slug);
    if (alive.current) setPosts(rows.map(toPost));
  }, [slug]);

  const loadMembers = useCallback(async () => {
    const { members } = await fetchCommunityMembers(slug);
    if (alive.current) setPeople(members.map((m) => toMember(m, currentEntityId())));
  }, [slug]);

  const load = useCallback(async () => {
    setStatus('loading');
    // Secondary data only needs the slug: fetch it alongside the detail instead of
    // after it. Failures leave the section empty rather than the page.
    Promise.allSettled([
      loadPosts(),
      loadMembers(),
      fetchCommunities().then((rows) => alive.current && setCatalogue(rows.map(toCard))),
    ]).then((r) =>
      r.forEach((x) => x.status === 'rejected' && log('secondary failed', x.reason?.message))
    );
    try {
      const c = await fetchCommunity(slug);
      if (!alive.current) return;
      if (!c) {
        setStatus('missing');
        return;
      }
      setBase(c);
      setStatus('ready');
    } catch (err) {
      const code = err?.response?.status;
      log('detail failed', slug, code);
      if (alive.current) setStatus(code === 404 ? 'missing' : 'error');
    }
  }, [slug, loadPosts, loadMembers]);

  useEffect(() => {
    alive.current = true;
    load();
    return () => {
      alive.current = false;
    };
  }, [load]);

  // Re-read the community (member preview, counts) without flipping the page back to "loading".
  const refreshBase = () =>
    fetchCommunity(slug)
      .then((c) => c && alive.current && setBase(c))
      .catch((err) => log('refresh failed', err?.response?.status));

  const setMember = (isMember) =>
    setBase((c) =>
      c
        ? {
            ...c,
            isMember,
            memberCount: Math.max(
              0,
              c.memberCount + (isMember === c.isMember ? 0 : isMember ? 1 : -1)
            ),
          }
        : c
    );

  const join = async () => {
    setMember(true);
    try {
      await joinCommunity(slug);
      loadMembers().catch(() => {});
      refreshBase();
      return true;
    } catch (err) {
      log('join failed', err?.response?.status);
      setMember(false);
      return false;
    }
  };

  const leave = async () => {
    setMember(false);
    try {
      await leaveCommunity(slug);
      loadMembers().catch(() => {});
      refreshBase();
      return true;
    } catch (err) {
      log('leave failed', err?.response?.status);
      setMember(true);
      return false;
    }
  };

  /** Create a post; resolves { ok, flagged }. The new post is put at the top of the feed. */
  const post = async ({ type, text, tags, link }) => {
    try {
      const { post: created, flagged } = await createCommunityPost(slug, {
        content: text,
        kind: type,
        tags,
        link,
      });
      if (created && alive.current) setPosts((list) => [toPost(created), ...list]);
      return { ok: true, flagged };
    } catch (err) {
      log('post failed', err?.response?.status);
      return { ok: false, error: err?.response?.data?.message || 'Could not post. Try again.' };
    }
  };

  // CommunityPostCard flips its own like state on click; the server answer then becomes the post's truth.
  const like = async (postId) => {
    try {
      const res = await likePost(slug, postId);
      setPosts((list) =>
        list.map((p) => (p.id === postId ? { ...p, liked: res.likedByMe, likes: res.likes } : p))
      );
      return res;
    } catch (err) {
      log('like failed', err?.response?.status);
      return null;
    }
  };

  const report = async (postId, { reason, note }) => {
    try {
      await reportPost(slug, postId, { reason, note });
      return true;
    } catch (err) {
      log('report failed', err?.response?.status);
      return false;
    }
  };

  const detail = base ? toDetail(base, { posts, people, catalogue }) : null;
  return {
    status,
    detail,
    joined: Boolean(base?.isMember),
    raw: base,
    reload: load,
    reloadPosts: loadPosts,
    join,
    leave,
    post,
    like,
    report,
  };
};

/** One open post + its comments (C-07). `meId` marks the caller's own comments. */
export const useLivePost = (slug, postId, meId) => {
  const [state, setState] = useState({ status: 'loading', post: null, comments: [] });
  const load = useCallback(async () => {
    try {
      const { post, comments } = await fetchCommunityPost(slug, postId);
      setState({
        status: post ? 'ready' : 'missing',
        post: post ? toPost(post) : null,
        comments: comments.map((c) => toComment(c, meId)),
      });
    } catch (err) {
      const code = err?.response?.status;
      log('post failed', postId, code);
      setState((s) => ({ ...s, status: code === 404 ? 'missing' : 'error' }));
    }
  }, [slug, postId, meId]);
  useEffect(() => {
    load();
  }, [load]);

  /** Add a comment (or a reply under `parentId`); resolves true on success. */
  const comment = async (text, parentId) => {
    try {
      const created = await commentOnPost(slug, postId, {
        content: text,
        parentCommentId: parentId,
      });
      if (!created) return false;
      const mapped = toComment(
        { ...created, author: { ...created.author }, content: created.content },
        meId
      );
      mapped.me = true;
      setState((s) => {
        const comments = parentId
          ? s.comments.map((c) =>
              c.id === parentId || c.replies.some((r) => r.id === parentId)
                ? { ...c, replies: [...c.replies, mapped] }
                : c
            )
          : [...s.comments, mapped];
        return {
          ...s,
          comments,
          post: s.post ? { ...s.post, comments: s.post.comments + 1 } : s.post,
        };
      });
      return true;
    } catch (err) {
      log('comment failed', err?.response?.status);
      return false;
    }
  };

  const setLiked = (liked, likes) =>
    setState((s) => (s.post ? { ...s, post: { ...s.post, liked, likes } } : s));

  return { ...state, reload: load, comment, setLiked };
};
