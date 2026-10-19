import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import CommunityDialogs from '../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  Composer,
  FeedToolbar,
} from '../../components/sections/talentCommunity/CommunityFeedParts.jsx';
import {
  CommunityHero,
  CommunityTabs,
  ContributorsCard,
  InfoCard,
  RelatedCard,
  TopicsCard,
} from '../../components/sections/talentCommunity/CommunityPageParts.jsx';
import CommunityPostCard from '../../components/sections/talentCommunity/CommunityPostCard.jsx';
import PostComments from '../../components/sections/talentCommunity/PostComments.jsx';
import { PostedToast } from '../../components/sections/talentCommunity/CommunityPendingParts.jsx';
import PendingPostCard from '../../components/sections/talentCommunity/CommunityPendingParts.jsx';
import {
  COMMUNITY_DETAILS,
  COMMUNITY_DETAIL_ALIASES,
  COMMUNITY_PAGE_COPY,
  COMMUNITY_PAGE_FACES,
  COMMUNITY_PAGE_RHYTHM,
  POST_DETAIL,
  buildFallbackDetail,
  getCommunityById,
} from '../../components/sections/talentCommunity/communityData.js';
import { useCommunityState } from '../../components/sections/talentCommunity/communityState.js';
import {
  SIDE_LEFT,
  SIDE_RIGHT,
} from '../../components/sections/talentCommunity/communityPageStyles.js';
import { debug } from '../../utils/debug.js';
import CommunityPostLive from './live/CommunityPostLive.jsx';

const log = debug('CommunityPostPage');

/*
 * CommunityPostPage — C-07 "Post + comments" (Playful 7628:5877 / Focused 8110:461719) at
 * `/community/:communityId/post/:postId`: the community page (hero, tabs, side cards) with the post open in the feed
 * (expanded card + comment thread). The page is always the joined view (the frame draws "Joined"). Only the first post
 * (Yaa Asantewaa, id `yaa-first-pr`) has a drawn thread: every other post id opens that one (⚠️ ASSUMPTION, see POST_DETAIL).
 * Mounts CommunityDialogs (create / report / leave / milestone) and, with `?pending=1`, the C-13 pending post + toast.
 */
const CommunityPostDemo = () => {
  const community = useCommunityState();
  const { communityId, postId } = useParams();
  const navigate = useNavigate();
  const canonicalId = COMMUNITY_DETAIL_ALIASES[communityId] ?? communityId;
  const entry = getCommunityById(canonicalId);
  const detail = useMemo(
    () => COMMUNITY_DETAILS[canonicalId] ?? (entry ? buildFallbackDetail(entry) : null),
    [canonicalId, entry]
  );
  const [extra, setExtra] = useState(0);
  const [toast, setToast] = useState(Boolean(community.pending));
  const [filter, setFilter] = useState(COMMUNITY_PAGE_COPY.filters[0]);
  const hideToast = useCallback(() => setToast(false), []);

  useEffect(() => {
    log('mount', { communityId, postId });
  }, [communityId, postId]);

  if (!detail) return <Navigate to="/community" replace />;

  const posts = detail.posts.length ? detail.posts : [];
  const open = posts.find((p) => p.id === postId) ?? posts.find((p) => p.id === POST_DETAIL.id);
  const rest = posts.filter((p) => p !== open);
  const rhythm = COMMUNITY_PAGE_RHYTHM.default;
  const tabs = [
    { id: 'feed', label: COMMUNITY_PAGE_COPY.tabs.feed },
    { id: 'about', label: COMMUNITY_PAGE_COPY.tabs.about },
    { id: 'members', label: COMMUNITY_PAGE_COPY.tabs.members, count: detail.info.members },
    {
      id: 'events',
      label: COMMUNITY_PAGE_COPY.tabs.events,
      count: detail.eventsCount,
      inert: true,
    },
  ];
  const back = `/community/${communityId}`;
  const onMore = () => community.update({ modal: 'report' });

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1506px] flex-col gap-[20px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)]">
        <CommunityHero
          detail={detail}
          joined
          faces={COMMUNITY_PAGE_FACES}
          onLeave={() => community.update({ modal: 'leave' })}
          onShare={() => log('share community', canonicalId)}
          onInvite={() => log('invite friends', canonicalId)}
        />
        <CommunityTabs
          tabs={tabs}
          active="feed"
          onChange={(id) => navigate(id === 'feed' ? back : `${back}?joined=1&tab=${id}`)}
        />
        <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
          <aside className={`order-2 flex shrink-0 flex-col gap-[20px] xl:order-1 ${SIDE_LEFT}`}>
            <InfoCard detail={detail} gap={rhythm.infoGap} />
            <ContributorsCard detail={detail} />
          </aside>
          <main className="order-1 min-w-0 flex-1 xl:order-2">
            <div className="flex min-w-0 flex-col gap-[16px]">
              <FeedToolbar
                filters={COMMUNITY_PAGE_COPY.filters}
                filter={filter}
                onFilter={(label) => {
                  setFilter(label);
                  navigate(back);
                }}
                sort={COMMUNITY_PAGE_COPY.sort}
              />
              <Composer onCompose={() => community.update({ modal: 'create' })} />
              {community.pending ? <PendingPostCard community={community} onMore={onMore} /> : null}
              {open ? (
                <CommunityPostCard
                  tone="expanded"
                  commentsActive
                  post={{ ...open, comments: open.comments + extra }}
                  onOpen={() => navigate(back)}
                  onMore={onMore}
                >
                  <PostComments onCount={setExtra} />
                </CommunityPostCard>
              ) : null}
              {rest.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onOpen={(p) => navigate(`${back}/post/${p.id}?joined=1`)}
                  onMore={onMore}
                />
              ))}
            </div>
          </main>
          <aside className={`order-3 flex shrink-0 flex-col gap-[20px] ${SIDE_RIGHT}`}>
            <TopicsCard detail={detail} gap={rhythm.trendGap} tagGap={rhythm.tagGap} />
            <RelatedCard detail={detail} gap={rhythm.relatedGap} />
          </aside>
        </div>
      </div>
      {community.pending && toast ? <PostedToast onDone={hideToast} /> : null}
      <CommunityDialogs
        community={community}
        communityName={detail.name}
        onLeft={() => navigate(back, { replace: true })}
      />
    </CommunityFrame>
  );
};

/* Live data by default; `?demo=1` (or a demo-only state key, see communityState.js) shows the drawn mock. */
const CommunityPostPage = () => {
  const community = useCommunityState();
  return community.demo ? <CommunityPostDemo /> : <CommunityPostLive community={community} />;
};

export default CommunityPostPage;
