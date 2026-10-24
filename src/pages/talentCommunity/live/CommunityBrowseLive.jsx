import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CommunityCard from '../../../components/sections/talentCommunity/CommunityCard.jsx';
import CommunityDialogs from '../../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  BrowseGrid,
  BrowseHeader,
  BrowseResultsLine,
  BrowseSectionHead,
  BrowseToolbar,
  CommunityCardSkeleton,
  NoResults,
  RequestTile,
} from '../../../components/sections/talentCommunity/CommunityBrowseParts.jsx';
import {
  CommunityGlobeIcon,
  CommunityTargetIcon,
  CommunityUsersIcon,
} from '../../../components/sections/talentCommunity/communityBrowseIcons.jsx';
import {
  COMMUNITY_BROWSE_COPY as COPY,
  COMMUNITY_CATEGORIES,
} from '../../../components/sections/talentCommunity/communityData.js';
import { useCommunityMembership } from '../../../components/sections/talentCommunity/communityMembership.js';
import { BROWSE_PICKED, useLiveBrowse } from '../../../components/sections/talentCommunity/useLiveCommunity.js';
import { basedOnNote } from '../../../components/sections/talentCommunity/liveCommunity.js';
import { HEADING } from '../../../components/sections/talentCommunity/communityStyles.js';
import { LiveError } from './LiveStates.jsx';

const log = debug('CommunityBrowseLive');

/*
 * CommunityBrowseLive: `/community` on the API (GET /api/community, paged). Same parts and URL keys as the drawn page
 * (CommunityBrowsePage demo): `?cat`, `?q`, `?view=all`, `?menu=joined`.
 *   default      "Your communities" (when you have joined any) + "Picked for you" = the first 8 not-joined
 *   ?view=all    "Your communities" + "All communities", a page at a time ("Show more")
 *   ?cat / ?q    search results from the server, a page at a time; no match -> "No community for ..." + 3 closest
 * The backend orders communities by profile match (US-2.3.11-01 "personalised based on career interests and PAOI"),
 * then by members, and returns one section per request instead of the whole catalogue (see useLiveBrowse).
 * ASSUMPTIONS:
 * Mute and "Request a community" have no backend: mute stays in this tab (communityMembership.js), a request only counts you in
 * on screen.
 */
const categoryLabel = (id) => COMMUNITY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

const ShowMore = ({ loading, shown, total, onClick }) => (
  <div className="flex justify-center pt-[8px]">
    <button
      type="button"
      data-browse-more
      onClick={onClick}
      disabled={loading}
      className="rounded-full border border-slate-300 bg-white px-[20px] py-[10px] text-[15px] font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
    >
      {loading ? 'Loading…' : `Show more (${shown} of ${total})`}
    </button>
  </div>
);

const CommunityBrowseLive = ({ community }) => {
  const { cat, q, view, menu, update } = community;
  const navigate = useNavigate();
  const browse = useLiveBrowse({ cat, q, view });
  const { isMuted, toggleMute } = useCommunityMembership();
  const [menuId, setMenuId] = useState(undefined);
  const [requested, setRequested] = useState(false);
  const [tileRequested, setTileRequested] = useState(false);

  const { cards, mine, closest } = browse;
  const term = q.trim();
  const loading = browse.status === 'loading';
  const filtering = browse.searching;

  useEffect(() => {
    log('state', { status: browse.status, n: cards.length, total: browse.total, cat, q, view });
  }, [browse.status, cards.length, browse.total, cat, q, view]);

  const pickedNote = basedOnNote(browse.basedOn) ?? 'The most-joined communities on GTH right now';

  const onJoin = async (c) => {
    log('join', c.id);
    const ok = await browse.join(c.id);
    if (ok) navigate(`/community/${c.id}?welcome=1`);
  };

  const visible = filtering ? cards : [...mine, ...cards];
  const urlMenuId = menu === 'joined' ? (visible.find((c) => c.joined)?.id ?? null) : null;
  const openId = menuId === undefined ? urlMenuId : menuId;
  const closeMenu = () => {
    setMenuId(null);
    if (menu) update({ menu: null });
  };
  const toggleMenu = (c) => {
    const next = openId === c.id ? null : c.id;
    setMenuId(next);
    update({ menu: next ? 'joined' : null });
  };

  const renderCard = (c, extra = {}) => (
    <CommunityCard
      key={c.id}
      community={c}
      joined={c.joined}
      muted={isMuted(c.id)}
      menuOpen={c.joined && openId === c.id}
      to={`/community/${c.id}`}
      faces={null}
      onJoin={onJoin}
      onToggleMenu={toggleMenu}
      onCloseMenu={closeMenu}
      onMute={(item) => toggleMute(item.id)}
      onLeave={(item) => navigate(`/community/${item.id}?modal=leave`)}
      {...extra}
    />
  );

  const showMore =
    browse.nextOffset != null ? (
      <ShowMore loading={browse.loadingMore} shown={cards.length} total={browse.total} onClick={browse.loadMore} />
    ) : null;

  const clearFilters = () => {
    setRequested(false);
    setMenuId(undefined);
    update({ cat: null, q: null, menu: null });
  };

  let body;
  if (browse.status === 'error') {
    body = <LiveError message="Couldn’t load communities. Check your connection and try again." onRetry={browse.reload} />;
  } else if (loading) {
    body = (
      <>
        <BrowseSectionHead icon={CommunityTargetIcon} title={COPY.pickedTitle} note={COPY.loadingNote} />
        <BrowseGrid gap="wide" aria-busy="true" aria-label="Loading communities">
          {Array.from({ length: BROWSE_PICKED }, (_, i) => (
            <CommunityCardSkeleton key={i} />
          ))}
        </BrowseGrid>
      </>
    );
  } else if (filtering && browse.total === 0) {
    const label = term || categoryLabel(cat);
    body = (
      <>
        <NoResults
          term={label}
          asked={requested ? 1 : 0}
          needed={25}
          requested={requested}
          onRequest={() => {
            log('request community', label);
            setRequested(true);
          }}
          onClear={clearFilters}
        />
        <h2 className={`${HEADING} text-[21px] leading-[26px] max-lg:text-[20px]`}>{COPY.closest}</h2>
        <BrowseGrid gap="tight">{closest.map((c) => renderCard(c))}</BrowseGrid>
      </>
    );
  } else if (filtering) {
    body = (
      <>
        <BrowseResultsLine
          count={browse.total}
          label={term || categoryLabel(cat)}
          term={Boolean(term) && !cat}
          onClear={clearFilters}
        />
        <BrowseGrid>{cards.map((c) => renderCard(c))}</BrowseGrid>
        {showMore}
      </>
    );
  } else if (view === 'all') {
    body = (
      <>
        <BrowseSectionHead icon={CommunityUsersIcon} title={COPY.yourCommunities} sticker={`${mine.length} joined`} />
        <BrowseGrid>
          {mine.map((c) => renderCard(c))}
          <RequestTile requested={tileRequested} onRequest={() => setTileRequested(true)} />
        </BrowseGrid>
        <BrowseSectionHead icon={CommunityGlobeIcon} title={COPY.allCommunities} />
        <BrowseGrid>{cards.filter((c) => !c.joined).map((c) => renderCard(c))}</BrowseGrid>
        {showMore}
      </>
    );
  } else {
    const picked = cards.filter((c) => !c.joined).slice(0, BROWSE_PICKED);
    body = (
      <>
        {mine.length ? (
          <>
            <BrowseSectionHead icon={CommunityUsersIcon} title={COPY.yourCommunities} sticker={`${mine.length} joined`} />
            <BrowseGrid>{mine.map((c) => renderCard(c))}</BrowseGrid>
          </>
        ) : null}
        <BrowseSectionHead icon={CommunityTargetIcon} title={COPY.pickedTitle} note={pickedNote} />
        <BrowseGrid>
          {picked.map((c) => renderCard(c))}
          {picked.length < BROWSE_PICKED ? (
            <RequestTile requested={tileRequested} onRequest={() => setTileRequested(true)} />
          ) : null}
        </BrowseGrid>
      </>
    );
  }

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1425px] flex-col gap-[24px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
        <BrowseHeader total={browse.catalogueTotal ?? cards.length + mine.length} />
        <BrowseToolbar
          cat={cat}
          onCat={(id) => {
            setRequested(false);
            setMenuId(undefined);
            update({ cat: id, menu: null });
          }}
          q={q}
          onQ={(text) => {
            setRequested(false);
            update({ q: text.length ? text : null });
          }}
        />
        {body}
      </div>
      <CommunityDialogs community={community} />
    </CommunityFrame>
  );
};

export default CommunityBrowseLive;
