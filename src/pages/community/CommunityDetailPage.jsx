import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import CommunityShell from '../../components/sections/community/CommunityShell.jsx';
import CommunityPageBackground from '../../components/sections/community/CommunityPageBackground.jsx';
import CommunityHero from '../../components/sections/community/CommunityHero.jsx';
import CommunityStickyHeader from '../../components/sections/community/CommunityStickyHeader.jsx';
import CommunityTabs from '../../components/sections/community/CommunityTabs.jsx';
import GuidelinesToast from '../../components/sections/community/GuidelinesToast.jsx';
import PostFilterBar from '../../components/sections/community/PostFilterBar.jsx';
import PostCard from '../../components/sections/community/PostCard.jsx';
import CommunityLeftRail from '../../components/sections/community/CommunityLeftRail.jsx';
import CommunityRightRail from '../../components/sections/community/CommunityRightRail.jsx';
import CreatePostModal from '../../components/sections/community/CreatePostModal.jsx';
import ReportPostModal from '../../components/sections/community/ReportPostModal.jsx';
import {
  COMMUNITIES,
  COMMUNITY_DETAIL,
  COMMUNITY_POSTS,
} from '../../components/sections/community/communityData.js';

const log = debug('CommunityDetailPage');

/*
 * CommunityDetailPage — route `/community/:communityId`.
 *
 * Covers four Figma frames, which are four STATES of one screen:
 *   7025:86093 — first visit: Guidelines toast shown, community NOT joined
 *                (full hero with the single green "Join" button)
 *   7025:86728 — same screen, toast dismissed
 *   7025:87352 — scrolled + joined: hero collapses into the sticky header
 *                (annotation on 7025:87493: "This appears on scroll and
 *                remains fixed"), actions become "Joined" + "Invite Friends"
 *   7025:87985 — same as above with the post action hovers visible
 *                (annotations on 7025:88313 / :88317) — implemented as real
 *                CSS hover states inside PostCard, not a separate screen.
 *
 * The sidebar is collapsed by default here (Figma 7025:86125, 126px) and
 * expanded on the index (7025:85256, 339px); the rail's chevron toggles.
 *
 * Only "#Frontend Devs Ghana" has a designed detail screen. Navigating to any
 * other community id still renders this layout but swaps in that community's
 * own name/member count/description from the index dataset, and logs the
 * substitution — no extra copy is invented for communities Figma never drew.
 */

const CommunityDetailPage = () => {
  const { communityId } = useParams();

  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [activeTab, setActiveTab] = useState('Feed');
  const [postFilter, setPostFilter] = useState('All');
  const [postQuery, setPostQuery] = useState('');
  const [joined, setJoined] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef(null);

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  /* Resolve which community's identity to render in the hero. */
  const community = useMemo(() => {
    if (!communityId || communityId === COMMUNITY_DETAIL.id) {
      return COMMUNITY_DETAIL;
    }
    const match = COMMUNITIES.find((item) => item.id === communityId);
    if (!match) {
      log.warn(`branch: unknown community id "${communityId}" — falling back to the designed one`);
      return COMMUNITY_DETAIL;
    }
    log(
      'branch: community id',
      communityId,
      '— reusing the designed detail layout with this community’s own identity'
    );
    return {
      ...COMMUNITY_DETAIL,
      id: match.id,
      title: `#${match.name.trim()}`,
      memberLabel: `${match.memberLabel.trim().replace(/members$/i, 'Members')}`,
      description: match.description,
      info: [
        { label: 'Members', value: match.memberLabel.trim().replace(/\s*members$/i, '') },
        { label: 'Activity', value: COMMUNITY_DETAIL.info[1].value },
      ],
    };
  }, [communityId]);

  useEffect(() => {
    log('mount', { communityId: communityId ?? '(none)', posts: COMMUNITY_POSTS.length });
  }, [communityId]);

  /* Hero → compact header swap (Figma annotation on 7025:87493: "This appears
     on scroll and remains fixed").
     A 1px sentinel sits directly below the hero + tabs. The moment it is
     clipped out of view, the sticky block has reached the top of the content
     column, so the compact header is inserted above the filter row and the
     two travel together — exactly the arrangement frame 7025:87352 shows.
     An IntersectionObserver is used rather than a pixel threshold so the swap
     stays correct as the clamped hero type resizes with the viewport. */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const next = !entry.isIntersecting;
        setScrolled((current) => {
          if (current === next) return current;
          log(
            'branch: hero sentinel',
            next ? 'left view → compact header' : 'back in view → full hero'
          );
          return next;
        });
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const visiblePosts = useMemo(() => {
    const byType = postFilter === 'All' ? posts : posts.filter((post) => post.type === postFilter);
    const needle = postQuery.trim().toLowerCase();
    const result = needle
      ? byType.filter(
          (post) =>
            post.author.toLowerCase().includes(needle) ||
            post.body.some((run) => run.text.toLowerCase().includes(needle))
        )
      : byType;
    log('feed filter applied:', {
      filter: postFilter,
      query: needle || '(none)',
      matched: result.length,
    });
    return result;
  }, [posts, postFilter, postQuery]);

  const handleToggleJoin = useCallback(() => {
    setJoined((current) => {
      log('join state changed:', current, '→', !current);
      return !current;
    });
  }, []);

  const handleAddComment = useCallback((postId, body) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;
        const comment = {
          id: `comment-local-${Date.now()}`,
          author: 'Kofi A.',
          avatar: post.comments[0]?.avatar ?? post.avatar,
          timestamp: 'Just now',
          body,
          likeCount: 0,
          replyCountLabel: null,
          replies: [],
        };
        log('comment added to', postId, '— total now', post.comments.length + 1);
        return { ...post, comments: [comment, ...post.comments] };
      })
    );
  }, []);

  const handleLikeComment = useCallback((commentId, direction) => {
    setPosts((current) =>
      current.map((post) => ({
        ...post,
        comments: post.comments.map((comment) => {
          if (comment.id !== commentId) return comment;
          const delta = direction === 'up' ? 1 : -1;
          const next = Math.max(0, comment.likeCount + delta);
          log('comment like count:', commentId, comment.likeCount, '→', next);
          return { ...comment, likeCount: next };
        }),
      }))
    );
  }, []);

  const handleReplyToComment = useCallback((commentId, body) => {
    setPosts((current) =>
      current.map((post) => ({
        ...post,
        comments: post.comments.map((comment) => {
          if (comment.id !== commentId) return comment;
          const reply = {
            id: `reply-local-${Date.now()}`,
            author: 'Kofi A.',
            avatar: comment.avatar,
            timestamp: 'Just now',
            body,
            likeCount: 0,
            replyCountLabel: null,
            replies: [],
          };
          const replies = [...comment.replies, reply];
          log('reply added to', commentId, '— total now', replies.length);
          return {
            ...comment,
            replies,
            replyCountLabel: `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`,
          };
        }),
      }))
    );
  }, []);

  const handleCreatePost = useCallback((payload) => {
    const post = {
      id: `post-local-${Date.now()}`,
      author: 'Kofi A.',
      avatar: COMMUNITY_POSTS[0].avatar,
      badge: payload.type,
      timestamp: 'Just now',
      type: payload.type === 'Achievement' ? 'Achievements' : payload.type,
      body: [{ text: payload.body, tone: 'body' }],
      photoLayout: 'single',
      photos: [],
      likeLabel: '0',
      commentLabel: '0 Comments',
      comments: [],
    };
    log('post prepended to feed:', post.id, '| type:', post.type);
    setPosts((current) => [post, ...current]);
  }, []);

  return (
    <CommunityShell defaultSidebarCollapsed>
      {/* Non-sticky lead content — `<main>` itself carries no padding (see
          CommunityShell.jsx), precisely so the sticky block below can be a
          true full-width, full-bleed child instead of being trapped inside
          this same padded column. This wrapper supplies its own top +
          horizontal padding since it's ordinary scrolling content.
          Side padding, corrected 2026-09-17: NOT centered via `mx-auto` —
          re-verified against this page's own frame metadata (7025:86093):
          the sidebar defaults collapsed here (126px) and content sits 32px
          from it, 56px from the true screen edge (same 56px page-edge
          constant CategoryFilterBar.jsx documents for the index page) —
          asymmetric, not the guessed symmetric clamp used before. No `max-w`
          cap either, for the same reason CategoryFilterBar.jsx drops it:
          Figma's 1514px was this column's width on ONE fixed 1728px
          reference frame, not a real design cap — the 3-column body below
          already scales proportionally via `fr` units, so it should
          genuinely fill the space between the two margins, not stop short
          of it on wider real screens. */}
      <div className="flex w-full flex-col items-start gap-[24px] pl-[clamp(16px,1.85vw,32px)] pr-[clamp(28px,3.24vw,56px)] pt-[32px]">
        {/* Guidelines toast — first-visit state (Figma 7025:86093). Portals
            to #toast-root (see GuidelinesToast.jsx) and takes no layout
            space of its own — rendered here only for state/lifecycle. */}
        <GuidelinesToast open={guidelinesOpen} onDismiss={() => setGuidelinesOpen(false)} />

        {/* Full hero — replaced by the compact header once it scrolls away */}
        {!scrolled && (
          <>
            <CommunityHero
              community={community}
              joined={joined}
              onToggleJoin={handleToggleJoin}
              onInvite={() => log('invite friends (no invite flow designed yet)')}
              className="w-full"
            />
            <div className="flex w-full justify-center">
              <CommunityTabs value={activeTab} onChange={setActiveTab} />
            </div>
          </>
        )}

        {/* Sentinel drives the hero → compact-header swap */}
        <div ref={sentinelRef} aria-hidden="true" className="h-px w-full shrink-0" />
      </div>

      {/* Full-bleed sticky block: compact header (on scroll) + post filter
          row. A direct child of `<main>` — NOT nested inside the padded
          column above — so it can reach `<main>`'s true top and side edges
          (see CommunityShell.jsx / CategoryFilterBar.jsx for the full history
          of why that matters: `position: sticky; top: 0` sticks to a
          scrolling ancestor's *padding* edge, so any padding on `<main>`
          becomes a permanent gap scrolled content bleeds through). Its own
          inner content uses the same margins, no `max-w` cap (see lead
          content's comment above for why). */}
      <div className="sticky top-0 z-20 w-full overflow-hidden py-[12px]">
        <CommunityPageBackground className="z-0" />
        <div className="relative z-10 flex w-full flex-col gap-[16px] pl-[clamp(16px,1.85vw,32px)] pr-[clamp(28px,3.24vw,56px)]">
          {scrolled && (
            <CommunityStickyHeader
              community={community}
              joined={joined}
              onToggleJoin={handleToggleJoin}
              onInvite={() => log('invite friends (no invite flow designed yet)')}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="w-full"
            />
          )}

          <PostFilterBar
            filter={postFilter}
            onFilterChange={setPostFilter}
            query={postQuery}
            onQueryChange={setPostQuery}
            onCreatePost={() => setCreatePostOpen(true)}
            className="w-full"
          />
        </div>
      </div>

      {/* Non-sticky trailing content — back to the page's real (asymmetric,
          not centered, uncapped) padding now that the full-bleed sticky
          block above has closed. */}
      <div className="flex w-full flex-col items-start gap-[24px] pl-[clamp(16px,1.85vw,32px)] pr-[clamp(28px,3.24vw,56px)] pt-[24px]">
        {/* Three-column body — Figma 7025:86315 (331 | 703 | 422 of 1514) */}
        <div className="grid w-full grid-cols-1 items-start gap-[clamp(16px,1.9vw,29px)] xl:grid-cols-[minmax(0,331fr)_minmax(0,703fr)_minmax(0,422fr)]">
          <CommunityLeftRail community={community} className="order-2 xl:order-1" />

          <section
            className="order-1 flex w-full flex-col items-start gap-[clamp(16px,1.5vw,23px)] xl:order-2"
            aria-label={`${activeTab} — ${community.title}`}
          >
            {activeTab === 'Feed' ? (
              visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onReport={(target) => setReportTarget(target)}
                  // Sharing a post has no Figma design yet — the "Milestone
                  // unlocked!" modal that used to open here belongs to
                  // Career Buddy's post-stage-confirm flow instead (see
                  // ShareMilestoneModal.jsx), not to sharing an arbitrary
                  // existing post. Stubbed until a real share design exists.
                  onShare={(target) => log('share clicked (no design yet):', target.id)}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  onReplyToComment={handleReplyToComment}
                />
              ))
            ) : (
              /* Figma designs only the Feed tab. Rather than inventing an
                 About / Members layout, the tab switches and says so. */
              <div className="w-full rounded-[19.29px] bg-white px-[24.1px] py-[32px] shadow-[0px_7.232px_10.005px_0px_rgba(63,42,120,0.12)]">
                <p className="font-sans text-[16px] text-[#595959]">
                  {`The “${activeTab}” tab has no Figma design yet.`}
                </p>
              </div>
            )}
          </section>

          <CommunityRightRail className="order-3" />
        </div>
      </div>

      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        onSubmit={handleCreatePost}
      />
      <ReportPostModal
        isOpen={Boolean(reportTarget)}
        post={reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={(payload) => log('report acknowledged (no backend):', payload)}
      />
    </CommunityShell>
  );
};

export default CommunityDetailPage;
