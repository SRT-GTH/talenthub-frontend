import { useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { currentEntityId } from '../../../services/careerBuddy.api.js';
import {
  CreatePostDialog,
  LeaveCommunityDialog,
  ReportPostDialog,
} from '../../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../../components/sections/talentCommunity/CommunityFrame.jsx';
import { Composer, FeedToolbar } from '../../../components/sections/talentCommunity/CommunityFeedParts.jsx';
import { PostedToast } from '../../../components/sections/talentCommunity/CommunityPendingParts.jsx';
import {
  CommunityHero,
  CommunityTabs,
  ContributorsCard,
  InfoCard,
  RelatedCard,
  TopicsCard,
} from '../../../components/sections/talentCommunity/CommunityPageParts.jsx';
import CommunityPostCard from '../../../components/sections/talentCommunity/CommunityPostCard.jsx';
import LivePostComments from '../../../components/sections/talentCommunity/LivePostComments.jsx';
import {
  COMMUNITY_PAGE_COPY,
  COMMUNITY_PAGE_RHYTHM,
} from '../../../components/sections/talentCommunity/communityData.js';
import { SIDE_LEFT, SIDE_RIGHT } from '../../../components/sections/talentCommunity/communityPageStyles.js';
import { useLiveCommunityPage, useLivePost } from '../../../components/sections/talentCommunity/useLiveCommunity.js';
import { shareLink } from './shareLink.js';
import { LiveError, LiveLoading } from './LiveStates.jsx';

const log = debug('CommunityPostLive');

/*
 * CommunityPostLive — `/community/:communityId/post/:postId` on the API: the community page with the post open (expanded
 * card + its real comment thread) above the rest of the feed. Visitors can read; commenting, liking and posting need a join.
 */
const CommunityPostLive = ({ community }) => {
  const { communityId, postId } = useParams();
  const navigate = useNavigate();
  const page = useLiveCommunityPage(communityId);
  const open = useLivePost(communityId, postId, currentEntityId());
  const { modal, update } = community;
  const [toast, setToast] = useState(null);
  const [busy, setBusy] = useState(false);
  const [postError, setPostError] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const hideToast = useCallback(() => setToast(null), []);
  const back = `/community/${communityId}`;
  const { detail, joined } = page;

  useEffect(() => {
    log('state', { communityId, postId, page: page.status, post: open.status });
  }, [communityId, postId, page.status, open.status]);

  if (page.status === 'missing') return <Navigate to="/community" replace />;
  if (open.status === 'missing') return <Navigate to={back} replace />;

  const onPost = async (draft) => {
    setBusy(true);
    setPostError(null);
    const res = await page.post(draft);
    setBusy(false);
    if (!res.ok) {
      setPostError(res.error);
      return;
    }
    update({ modal: null });
    setToast(res.flagged ? 'Posted! A moderator will check it’s on topic' : 'Posted!');
  };

  const onReport = async ({ reason, note }) => {
    if (!reportTarget) return;
    setBusy(true);
    const ok = await page.report(reportTarget.id, { reason, note });
    setBusy(false);
    setReportTarget(null);
    update({ modal: null });
    setToast(ok ? 'Thanks. Our moderators will review this post' : 'Couldn’t send the report. Try again.');
  };

  const onLeave = async () => {
    setBusy(true);
    const ok = await page.leave();
    setBusy(false);
    update({ modal: null });
    if (ok) navigate(back, { replace: true });
    else setToast('Couldn’t leave right now. Try again.');
  };

  const openReport = (post) => {
    setReportTarget(post);
    update({ modal: 'report' });
  };

  const rest = detail ? detail.posts.filter((p) => p.id !== postId) : [];
  const rhythm = COMMUNITY_PAGE_RHYTHM.default;
  const tabs = detail
    ? [
        { id: 'feed', label: COMMUNITY_PAGE_COPY.tabs.feed },
        { id: 'about', label: COMMUNITY_PAGE_COPY.tabs.about },
        { id: 'members', label: COMMUNITY_PAGE_COPY.tabs.members, count: detail.info.members },
        { id: 'events', label: COMMUNITY_PAGE_COPY.tabs.events, inert: true },
      ]
    : [];
  const error = page.status === 'error' || open.status === 'error';

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1506px] flex-col gap-[20px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)]">
        {error ? (
          <LiveError
            message="Couldn’t load this post. Check your connection and try again."
            onRetry={() => {
              page.reload();
              open.reload();
            }}
          />
        ) : null}
        {detail ? (
          <>
            <CommunityHero
              detail={detail}
              joined={joined}
              faces={detail.facesImages}
              onJoin={async () => {
                if (await page.join()) setToast(`You’re in! Say hi to ${detail.name.replace(/^#/, '')}`);
              }}
              onLeave={() => update({ modal: 'leave' })}
              onShare={() => shareLink(back, detail.name)}
              onInvite={() => shareLink(back, detail.name)}
            />
            <CommunityTabs
              tabs={tabs}
              active="feed"
              onChange={(id) => navigate(id === 'feed' ? back : `${back}?tab=${id}`)}
            />
            <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
              <aside className={`order-2 flex shrink-0 flex-col gap-[20px] xl:order-1 ${SIDE_LEFT}`}>
                <InfoCard detail={detail} gap={rhythm.infoGap} />
                {detail.contributors.length ? <ContributorsCard detail={detail} /> : null}
              </aside>
              <main className="order-1 min-w-0 flex-1 xl:order-2">
                <div className="flex min-w-0 flex-col gap-[16px]">
                  <FeedToolbar
                    filters={COMMUNITY_PAGE_COPY.filters}
                    filter={COMMUNITY_PAGE_COPY.filters[0]}
                    onFilter={() => navigate(back)}
                    sort={COMMUNITY_PAGE_COPY.sort}
                  />
                  {joined ? (
                    <Composer
                      onCompose={() => {
                        setPostError(null);
                        update({ modal: 'create' });
                      }}
                    />
                  ) : null}
                  {open.post ? (
                    <CommunityPostCard
                      tone="expanded"
                      commentsActive
                      locked={!joined}
                      post={open.post}
                      onOpen={() => navigate(back)}
                      onLike={async (p) => {
                        const res = await page.like(p.id);
                        if (res) open.setLiked(res.likedByMe, res.likes);
                      }}
                      onMore={openReport}
                      onShare={(p) => shareLink(`${back}/post/${p.id}`, p.author.name)}
                    >
                      <LivePostComments comments={open.comments} canWrite={joined} onComment={open.comment} />
                    </CommunityPostCard>
                  ) : (
                    <LiveLoading label="Loading post…" />
                  )}
                  {rest.map((post) => (
                    <CommunityPostCard
                      key={post.id}
                      post={post}
                      locked={!joined}
                      onOpen={(p) => navigate(`${back}/post/${p.id}`)}
                      onLike={(p) => page.like(p.id)}
                      onMore={openReport}
                      onShare={(p) => shareLink(`${back}/post/${p.id}`, p.author.name)}
                    />
                  ))}
                </div>
              </main>
              <aside className={`order-3 flex shrink-0 flex-col gap-[20px] ${SIDE_RIGHT}`}>
                {detail.topics.length ? <TopicsCard detail={detail} gap={rhythm.trendGap} tagGap={rhythm.tagGap} /> : null}
                {detail.related.length ? <RelatedCard detail={detail} gap={rhythm.relatedGap} /> : null}
              </aside>
            </div>
          </>
        ) : page.status === 'loading' ? (
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
          onLeave={onLeave}
        />
      ) : null}
    </CommunityFrame>
  );
};

export default CommunityPostLive;
