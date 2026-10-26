import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CommunityDialogs, {
  CreatePostDialog,
  LeaveCommunityDialog,
  ReportPostDialog,
} from '../../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  Composer,
  EmptyFeed,
  FeedToolbar,
  Guidelines,
  PreviewBanner,
} from '../../../components/sections/talentCommunity/CommunityFeedParts.jsx';
import {
  LivePendingPostCard,
  PostedToast,
} from '../../../components/sections/talentCommunity/CommunityPendingParts.jsx';
import {
  CommunityHero,
  CommunityTabs,
  ContributorsCard,
  InfoCard,
  RelatedCard,
  TopicsCard,
} from '../../../components/sections/talentCommunity/CommunityPageParts.jsx';
import CommunityPostCard from '../../../components/sections/talentCommunity/CommunityPostCard.jsx';
import {
  AboutPanel,
  MembersPanel,
} from '../../../components/sections/talentCommunity/CommunityTabPanels.jsx';
import {
  COMMUNITY_PAGE_COPY,
  COMMUNITY_PAGE_RHYTHM,
  TOAST_POSTED,
} from '../../../components/sections/talentCommunity/communityData.js';
import { useCommunityMembership } from '../../../components/sections/talentCommunity/communityMembership.js';
import {
  SIDE_LEFT,
  SIDE_RIGHT,
} from '../../../components/sections/talentCommunity/communityPageStyles.js';
import { useLiveCommunityPage } from '../../../components/sections/talentCommunity/useLiveCommunity.js';
import { LiveError, LiveLoading } from './LiveStates.jsx';
import { shareLink } from './shareLink.js';

const log = debug('CommunityPageLive');

/*
 * CommunityPageLive — `/community/:communityId` on the API. `joined` comes from the server (not `?joined=1`).
 * URL keys kept from the drawn page: `?tab=about|members`, `?welcome=1` (house rules after joining), `?modal=create|report|leave`.
 * Create post: the post goes live at once and is put on top of the feed; when the backend flags it as off-purpose the toast
 * says a moderator will check it (⚠️ the drawn "pending review" card needs a moderation queue the backend doesn't expose yet).
 */
const CommunityPageLive = ({ community }) => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const page = useLiveCommunityPage(communityId);
  const { toggleMute } = useCommunityMembership();
  const { tab, welcome, modal, update } = community;
  const [filter, setFilter] = useState(COMMUNITY_PAGE_COPY.filters[0]);
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [postError, setPostError] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const hideToast = useCallback(() => setToast(null), []);

  const { status, detail, joined } = page;
  useEffect(() => {
    log('state', { communityId, status, joined, tab, posts: detail?.posts.length });
  }, [communityId, status, joined, tab, detail?.posts.length]);

  // A dialog that needs membership is closed for visitors (e.g. an old ?modal=create link).
  useEffect(() => {
    if (status === 'ready' && !joined && (modal === 'create' || modal === 'leave'))
      update({ modal: null });
  }, [status, joined, modal, update]);

  if (status === 'missing') return <Navigate to="/community" replace />;

  const onJoin = async () => {
    const ok = await page.join();
    if (ok) {
      update({ welcome: true });
      setToast(`You’re in! Say hi to ${detail?.name.replace(/^#/, '') ?? 'the community'}`);
    } else setToast('Couldn’t join right now. Try again.');
  };

  const onPost = async (draft) => {
    setBusy(true);
    setPostError(null);
    const res = await page.post(draft);
    setBusy(false);
    if (!res.ok) {
      setPostError(res.error);
      return;
    }
    update({ modal: null, welcome: null });
    setFilter(COMMUNITY_PAGE_COPY.filters[0]);
    setToast(
      res.pending
        ? TOAST_POSTED
        : res.flagged
          ? 'Posted! A moderator will check it’s on topic'
          : 'Posted!'
    );
  };

  const onReport = async ({ reason, note }) => {
    if (!reportTarget) return;
    setBusy(true);
    const ok = await page.report(reportTarget.id, { reason, note });
    setBusy(false);
    update({ modal: null });
    setReportTarget(null);
    setToast(
      ok ? 'Thanks. Our moderators will review this post' : 'Couldn’t send the report. Try again.'
    );
  };

  const onLeave = async () => {
    setBusy(true);
    const ok = await page.leave();
    setBusy(false);
    update({ modal: null, welcome: null, tab: null });
    if (!ok) setToast('Couldn’t leave right now. Try again.');
  };

  const openReport = (post) => {
    setReportTarget(post);
    update({ modal: 'report' });
  };
  const openCreate = () => {
    setPostError(null);
    update({ modal: 'create' });
  };

  let main;
  if (status === 'loading' || !detail) {
    main = status === 'error' ? null : <LiveLoading label="Loading community…" />;
  } else if (tab === 'about') {
    main = <AboutPanel detail={detail} />;
  } else if (tab === 'members') {
    main = <MembersPanel detail={detail} />;
  } else {
    const posts = detail.posts.filter(
      (post) =>
        filter === COMMUNITY_PAGE_COPY.filters[0] ||
        `${post.kind}s`.toLowerCase() === filter.toLowerCase()
    );
    main = (
      <div className="flex min-w-0 flex-col gap-[16px]">
        <FeedToolbar
          filters={COMMUNITY_PAGE_COPY.filters}
          filter={filter}
          onFilter={setFilter}
          sort={COMMUNITY_PAGE_COPY.sort}
        />
        {!joined ? <PreviewBanner onJoin={onJoin} /> : null}
        {joined && welcome ? (
          <Guidelines
            rules={detail.about.rules.slice(0, 3).map((r) => `${r.title}. ${r.text}`)}
            note="Posts that are off-topic for this community are flagged for a moderator."
            onGotIt={() => update({ welcome: null })}
            onReadAll={() => update({ tab: 'about', welcome: null })}
          />
        ) : null}
        {joined ? <Composer onCompose={openCreate} /> : null}
        {posts.length === 0 ? (
          joined ? (
            <EmptyFeed
              onWrite={openCreate}
              body="The first post sets the tone. Say hello, ask a question or share what you’re working on."
            />
          ) : (
            <p className="m-0 py-[24px] text-center font-sans text-[14px] text-[#737373]">
              No posts yet. Join to write the first one.
            </p>
          )
        ) : (
          posts.map((post) =>
            post.pending || post.rejected ? (
              <LivePendingPostCard key={post.id} post={post} />
            ) : (
              <CommunityPostCard
                key={post.id}
                post={post}
                locked={!joined}
                onOpen={(p) => navigate(`/community/${communityId}/post/${p.id}`)}
                onLike={(p) => page.like(p.id)}
                onMore={openReport}
                onShare={(p) => shareLink(`/community/${communityId}/post/${p.id}`, p.author.name)}
              />
            )
          )
        )}
      </div>
    );
  }

  const rhythm = !joined
    ? COMMUNITY_PAGE_RHYTHM.preview
    : welcome
      ? COMMUNITY_PAGE_RHYTHM.welcome
      : COMMUNITY_PAGE_RHYTHM.default;
  const tabs = detail
    ? [
        { id: 'feed', label: COMMUNITY_PAGE_COPY.tabs.feed },
        { id: 'about', label: COMMUNITY_PAGE_COPY.tabs.about },
        {
          id: 'members',
          label: COMMUNITY_PAGE_COPY.tabs.members,
          count: detail.info.members,
          tone: tab === 'members' ? 'gold' : undefined,
        },
        { id: 'events', label: COMMUNITY_PAGE_COPY.tabs.events, inert: true },
      ]
    : [];

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1602px] flex-col gap-[20px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.39vw,24px)]">
        {status === 'error' ? (
          <LiveError
            message="Couldn’t load this community. Check your connection and try again."
            onRetry={page.reload}
          />
        ) : null}
        {detail ? (
          <>
            <CommunityHero
              detail={detail}
              joined={joined}
              faces={detail.facesImages}
              onJoin={onJoin}
              onLeave={() => update({ modal: 'leave' })}
              onShare={() => shareLink(`/community/${communityId}`, detail.name)}
              onInvite={() => shareLink(`/community/${communityId}`, detail.name)}
            />
            <CommunityTabs
              tabs={tabs}
              active={tab}
              onChange={(id) => update({ tab: id === 'feed' ? null : id })}
            />
            <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
              <aside
                className={`order-2 flex shrink-0 flex-col gap-[20px] xl:order-1 ${SIDE_LEFT}`}
              >
                <InfoCard detail={detail} gap={rhythm.infoGap} />
                {detail.contributors.length ? <ContributorsCard detail={detail} /> : null}
              </aside>
              <div className="order-1 min-w-0 flex-1 xl:order-2">{main}</div>
              <aside className={`order-3 flex shrink-0 flex-col gap-[20px] ${SIDE_RIGHT}`}>
                {detail.topics.length ? (
                  <TopicsCard detail={detail} gap={rhythm.trendGap} tagGap={rhythm.tagGap} />
                ) : null}
                {detail.related.length ? (
                  <RelatedCard detail={detail} gap={rhythm.relatedGap} />
                ) : null}
              </aside>
            </div>
          </>
        ) : status === 'loading' ? (
          <LiveLoading label="Loading community…" />
        ) : null}
      </div>
      {toast ? <PostedToast text={toast} onDone={hideToast} /> : null}
      {detail && modal === 'create' && joined ? (
        <CreatePostDialog
          live
          busy={busy}
          error={postError}
          communityName={detail.name}
          onClose={() => update({ modal: null })}
          onPost={onPost}
        />
      ) : null}
      {detail && modal === 'report' && reportTarget ? (
        <ReportPostDialog
          live
          busy={busy}
          author={reportTarget.author.name.split(' ')[0]}
          communityName={detail.name}
          onClose={() => {
            setReportTarget(null);
            update({ modal: null });
          }}
          onSubmit={onReport}
        />
      ) : null}
      {detail && modal === 'leave' && joined ? (
        <LeaveCommunityDialog
          busy={busy}
          communityName={detail.name}
          onClose={() => update({ modal: null })}
          onMute={() => {
            toggleMute(communityId);
            update({ modal: null });
            setToast('Muted. You won’t get notifications from this community');
          }}
          onLeave={onLeave}
        />
      ) : null}
      {modal === 'milestone' ? <CommunityDialogs community={community} /> : null}
    </CommunityFrame>
  );
};

export default CommunityPageLive;
