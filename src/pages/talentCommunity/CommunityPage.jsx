import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import CommunityDialogs from '../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  Composer,
  EmptyFeed,
  FeedToolbar,
  Guidelines,
  JoinedToast,
  PreviewBanner,
} from '../../components/sections/talentCommunity/CommunityFeedParts.jsx';
import PendingPostCard, {
  PostedToast,
} from '../../components/sections/talentCommunity/CommunityPendingParts.jsx';
import {
  CommunityHero,
  CommunityTabs,
  ContributorsCard,
  InfoCard,
  RelatedCard,
  TopicsCard,
} from '../../components/sections/talentCommunity/CommunityPageParts.jsx';
import CommunityPostCard from '../../components/sections/talentCommunity/CommunityPostCard.jsx';
import {
  AboutPanel,
  MembersPanel,
} from '../../components/sections/talentCommunity/CommunityTabPanels.jsx';
import {
  COMMUNITY_DETAILS,
  COMMUNITY_DETAIL_ALIASES,
  COMMUNITY_PAGE_COPY,
  COMMUNITY_PAGE_FACES,
  COMMUNITY_PAGE_RHYTHM,
  buildFallbackDetail,
  getCommunityById,
} from '../../components/sections/talentCommunity/communityData.js';
import { useCommunityMembership } from '../../components/sections/talentCommunity/communityMembership.js';
import { useCommunityState } from '../../components/sections/talentCommunity/communityState.js';
import {
  SIDE_LEFT,
  SIDE_RIGHT,
} from '../../components/sections/talentCommunity/communityPageStyles.js';

const log = debug('CommunityPage');

/*
 * CommunityPage — `/community/:communityId`: C-04 preview (not joined), C-05 `?joined=1&welcome=1` just joined + guidelines,
 * C-06 `?joined=1` feed, C-11 `&tab=about`, C-12 `&tab=members`, C-14 `/agritech-innovators-ghana?joined=1&state=empty`
 * (empty feed), `&pending=1` the C-13 pending post (+ "Posted!" toast), `&modal=create|report|leave|milestone` dialogs
 * (CommunityDialogs). Joined = `?joined=1` OR a real Join click (which sets it); leaving removes it.
 * Detail data: the `page` block of communityData.js (⚠️ ASSUMPTIONS listed there).
 */
const CommunityPage = () => {
  const community = useCommunityState();
  const { communityId } = useParams();
  const navigate = useNavigate();
  const membership = useCommunityMembership();
  const canonicalId = COMMUNITY_DETAIL_ALIASES[communityId] ?? communityId;
  const entry = getCommunityById(canonicalId);
  const detail = useMemo(
    () => COMMUNITY_DETAILS[canonicalId] ?? (entry ? buildFallbackDetail(entry) : null),
    [canonicalId, entry]
  );

  const { joined, tab, welcome, pending, state, update } = community;
  const [filter, setFilter] = useState(COMMUNITY_PAGE_COPY.filters[0]);
  const [welcomeToast, setWelcomeToast] = useState(false);
  const [postedToast, setPostedToast] = useState(Boolean(pending));
  const wasJoined = useRef(joined);

  useEffect(() => {
    log('mount', { communityId, canonicalId, joined, tab, state, pending });
  }, [communityId, canonicalId, joined, tab, state, pending]);

  // A community already joined elsewhere (catalogue / membership store) opens as joined.
  useEffect(() => {
    if (detail && !joined && membership.isJoined(canonicalId)) update({ joined: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canonicalId]);

  // Keep the membership store in step with leaving (the leave dialog only clears the URL key).
  useEffect(() => {
    if (wasJoined.current && !joined) membership.leave(canonicalId);
    wasJoined.current = joined;
  }, [joined, canonicalId, membership]);

  // The "You're in!" toast belongs to the moment of joining (C-05).
  useEffect(() => {
    if (joined && welcome) setWelcomeToast(true);
  }, [joined, welcome]);

  useEffect(() => {
    if (pending) setPostedToast(true);
  }, [pending]);

  const openCreate = useCallback(() => update({ modal: 'create' }), [update]);
  const onJoin = () => {
    log('join', canonicalId);
    membership.join(canonicalId);
    update({ joined: true, welcome: true });
  };
  const onMorePost = () => update({ modal: 'report' });
  // ⚠️ ASSUMPTION: Share / Invite friends have no screen in the frames: they share (or copy) the plain community / post link.
  const shareLink = (path, title) => {
    const url = `${window.location.origin}${path}`;
    log('share', url);
    if (navigator.share) navigator.share({ title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  };
  const onOpenPost = (post) => navigate(`/community/${communityId}/post/${post.id}`);
  const hideWelcomeToast = useCallback(() => setWelcomeToast(false), []);
  const hidePostedToast = useCallback(() => setPostedToast(false), []);

  if (!detail) return <Navigate to="/community" replace />;

  const empty = state === 'empty' || detail.posts.length === 0;
  const rhythm = !joined
    ? COMMUNITY_PAGE_RHYTHM.preview
    : welcome
      ? COMMUNITY_PAGE_RHYTHM.welcome
      : COMMUNITY_PAGE_RHYTHM.default;
  const tabs = [
    { id: 'feed', label: COMMUNITY_PAGE_COPY.tabs.feed },
    { id: 'about', label: COMMUNITY_PAGE_COPY.tabs.about },
    {
      id: 'members',
      label: COMMUNITY_PAGE_COPY.tabs.members,
      count: detail.info.members,
      tone: tab === 'members' ? 'gold' : undefined,
    },
    {
      id: 'events',
      label: COMMUNITY_PAGE_COPY.tabs.events,
      count: detail.eventsCount,
      inert: true,
    },
  ];
  const posts = detail.posts.filter((post) => {
    if (filter === COMMUNITY_PAGE_COPY.filters[0]) return true;
    return `${post.kind}s`.toLowerCase() === filter.toLowerCase();
  });

  const feed = (
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
          onGotIt={() => update({ welcome: null })}
          onReadAll={() => update({ tab: 'about', welcome: null })}
        />
      ) : null}
      {joined ? <Composer onCompose={openCreate} /> : null}
      {joined && pending ? <PendingPostCard community={community} onMore={onMorePost} /> : null}
      {empty || posts.length === 0 ? (
        joined ? (
          <EmptyFeed onWrite={openCreate} />
        ) : null
      ) : (
        posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post}
            locked={!joined}
            onOpen={onOpenPost}
            onMore={onMorePost}
            onShare={(shared) =>
              shareLink(`/community/${communityId}/post/${shared.id}`, shared.author.name)
            }
          />
        ))
      )}
    </div>
  );

  let main = feed;
  if (tab === 'about') main = <AboutPanel detail={detail} />;
  else if (tab === 'members') main = <MembersPanel detail={detail} />;

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1602px] flex-col gap-[20px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.39vw,24px)]">
        <CommunityHero
          detail={detail}
          joined={joined}
          faces={COMMUNITY_PAGE_FACES}
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
          <aside className={`order-2 flex shrink-0 flex-col gap-[20px] xl:order-1 ${SIDE_LEFT}`}>
            <InfoCard detail={detail} gap={rhythm.infoGap} />
            <ContributorsCard detail={detail} />
          </aside>
          <div className="order-1 min-w-0 flex-1 xl:order-2">{main}</div>
          <aside className={`order-3 flex shrink-0 flex-col gap-[20px] ${SIDE_RIGHT}`}>
            <TopicsCard detail={detail} gap={rhythm.trendGap} tagGap={rhythm.tagGap} />
            <RelatedCard detail={detail} gap={rhythm.relatedGap} />
          </aside>
        </div>
      </div>
      {welcomeToast ? <JoinedToast onDone={hideWelcomeToast} /> : null}
      {joined && pending && postedToast ? <PostedToast onDone={hidePostedToast} /> : null}
      <CommunityDialogs community={community} communityName={detail.name} />
    </CommunityFrame>
  );
};

export default CommunityPage;
