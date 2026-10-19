import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import CommunityBrowseLive from './live/CommunityBrowseLive.jsx';
import CommunityCard from '../../components/sections/talentCommunity/CommunityCard.jsx';
import CommunityDialogs from '../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  BrowseGrid,
  BrowseHeader,
  BrowseResultsLine,
  BrowseSectionHead,
  BrowseToolbar,
  CommunityCardSkeleton,
  NoResults,
  RequestTile,
} from '../../components/sections/talentCommunity/CommunityBrowseParts.jsx';
import {
  CommunityGlobeIcon,
  CommunityTargetIcon,
  CommunityUsersIcon,
} from '../../components/sections/talentCommunity/communityBrowseIcons.jsx';
import {
  COMMUNITIES_RESPONSE,
  COMMUNITY_BROWSE_COPY as COPY,
  COMMUNITY_CATEGORIES,
} from '../../components/sections/talentCommunity/communityData.js';
import { useCommunityMembership } from '../../components/sections/talentCommunity/communityMembership.js';
import { useCommunityState } from '../../components/sections/talentCommunity/communityState.js';
import { HEADING } from '../../components/sections/talentCommunity/communityStyles.js';

const log = debug('CommunityBrowsePage');

/*
 * CommunityBrowsePage — `/community` (Community v2 browse). One page, URL-driven (communityState.js):
 *   /community                              C-01 "Picked for you" (8 communities, chips, search)
 *   /community?cat=software-engineering     C-02 filtered ("Showing 3 communities in … · Clear") …
 *   /community?menu=joined&cat=…            … with the "Joined" menu open under the joined card
 *   /community?view=all                     C-03 "Your communities" + "All communities" (full page)
 *   /community?state=loading                C-15 skeleton cards
 *   /community?q=<no match>                 C-16 "No community for “…” yet" + "Closest communities"
 * Real behaviour: category chips + search filter the catalogue (URL kept in sync), Join joins (and opens the community's
 * "just joined" screen), "Joined" opens the Open / Mute / Leave menu, Request this community counts you in.
 * Data: COMMUNITIES_RESPONSE (`GET /communities`) in communityData.js; join/mute state in communityMembership.js.
 */
const categoryLabel = (id) => COMMUNITY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

const CommunityBrowseDemo = () => {
  const community = useCommunityState();
  const { cat, q, view, state, menu, update } = community;
  const navigate = useNavigate();
  const membership = useCommunityMembership();
  // undefined = follow `?menu=joined`; string = card id with the menu open; null = closed by the user.
  const [menuId, setMenuId] = useState(undefined);
  const [requested, setRequested] = useState(false);
  const [tileRequested, setTileRequested] = useState(false);

  const { communities, picked, closest, request, total } = COMMUNITIES_RESPONSE;
  const byId = useMemo(() => Object.fromEntries(communities.map((c) => [c.id, c])), [communities]);
  const term = q.trim();
  const loading = state === 'loading';

  const filtered = useMemo(() => {
    const needle = term.toLowerCase();
    return communities.filter((c) => {
      if (cat && !c.categories.includes(cat)) return false;
      if (!needle) return true;
      const hay = [c.name, c.description, ...c.categories.map(categoryLabel)]
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [communities, cat, term]);

  const filtering = Boolean(cat || term);
  const showAll = view === 'all' && !filtering && !loading;

  useEffect(() => {
    log('mount', { cat, q, view, state, menu });
  }, [cat, q, view, state, menu]);

  // Join: record it and land on the community's "just joined + guidelines" screen (C-05).
  const onJoin = (c) => {
    membership.join(c.id);
    navigate(`/community/${c.id}?joined=1&welcome=1`);
  };

  // `?menu=joined` opens the menu on the first joined card that is on screen (C-02).
  const visible = filtering ? filtered : showAll ? communities : picked.ids.map((id) => byId[id]);
  const urlMenuId =
    menu === 'joined' ? (visible.find((c) => membership.isJoined(c.id))?.id ?? null) : null;
  const openId = menuId === undefined ? urlMenuId : menuId;

  const closeMenu = () => {
    setMenuId(null);
    if (menu) update({ menu: null });
  };
  const toggleMenu = (c) => {
    const next = openId === c.id ? null : c.id;
    log('menu', c.id, next ? 'open' : 'close');
    setMenuId(next);
    update({ menu: next ? 'joined' : null });
  };

  const renderCard = (c, extra = {}) => {
    const joined = membership.isJoined(c.id);
    return (
      <CommunityCard
        key={c.id}
        community={c}
        joined={joined}
        muted={membership.isMuted(c.id)}
        menuOpen={joined && openId === c.id}
        onJoin={onJoin}
        onToggleMenu={toggleMenu}
        onCloseMenu={closeMenu}
        onMute={(item) => membership.toggleMute(item.id)}
        onLeave={(item) => navigate(`/community/${item.id}?joined=1&modal=leave`)}
        {...extra}
      />
    );
  };

  const clearFilters = () => {
    log('clear filters');
    setRequested(false);
    setMenuId(undefined);
    update({ cat: null, q: null, menu: null });
  };

  let body;
  if (loading) {
    body = (
      <>
        <BrowseSectionHead
          icon={CommunityTargetIcon}
          title={COPY.pickedTitle}
          note={COPY.loadingNote}
        />
        <BrowseGrid gap="wide" aria-busy="true" aria-label="Loading communities">
          {Array.from({ length: 8 }, (_, i) => (
            <CommunityCardSkeleton key={i} />
          ))}
        </BrowseGrid>
      </>
    );
  } else if (filtering && filtered.length === 0) {
    const label = term || categoryLabel(cat);
    body = (
      <>
        <NoResults
          term={label}
          asked={request.asked}
          needed={request.needed}
          requested={requested}
          onRequest={() => {
            log('request community', label);
            setRequested(true);
          }}
          onClear={clearFilters}
        />
        <h2 className={`${HEADING} text-[21px] leading-[26px] max-lg:text-[20px]`}>
          {COPY.closest}
        </h2>
        <BrowseGrid gap="tight">
          {closest.ids.map((id) =>
            renderCard(
              byId[id],
              closest.verbatim
                ? { joined: false, menuOpen: false, showTag: false, activity: closest.activity[id] }
                : {}
            )
          )}
        </BrowseGrid>
      </>
    );
  } else if (filtering) {
    body = (
      <>
        <BrowseResultsLine
          count={filtered.length}
          label={term || categoryLabel(cat)}
          term={Boolean(term) && !cat}
          onClear={clearFilters}
        />
        <BrowseGrid>{filtered.map((c) => renderCard(c))}</BrowseGrid>
      </>
    );
  } else if (showAll) {
    const mine = communities.filter((c) => membership.isJoined(c.id));
    const rest = communities.filter((c) => !membership.isJoined(c.id));
    body = (
      <>
        <BrowseSectionHead
          icon={CommunityUsersIcon}
          title={COPY.yourCommunities}
          sticker={`${mine.length} joined`}
        />
        <BrowseGrid>
          {mine.map((c) => renderCard(c))}
          <RequestTile requested={tileRequested} onRequest={() => setTileRequested(true)} />
        </BrowseGrid>
        <BrowseSectionHead icon={CommunityGlobeIcon} title={COPY.allCommunities} />
        <BrowseGrid>{rest.map((c) => renderCard(c))}</BrowseGrid>
      </>
    );
  } else {
    body = (
      <>
        <BrowseSectionHead
          icon={CommunityTargetIcon}
          title={COPY.pickedTitle}
          note={COPY.pickedNote(picked.basedOn)}
        />
        <BrowseGrid>{picked.ids.map((id) => renderCard(byId[id]))}</BrowseGrid>
      </>
    );
  }

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1425px] flex-col gap-[24px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
        <BrowseHeader total={total} />
        <BrowseToolbar
          cat={cat}
          onCat={(id) => {
            setRequested(false);
            update({ cat: id, menu: null });
            setMenuId(undefined);
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

/* Live data by default; `?demo=1` (or a demo-only state key, see communityState.js) shows the drawn mock. */
const CommunityBrowsePage = () => {
  const community = useCommunityState();
  return community.demo ? <CommunityBrowseDemo /> : <CommunityBrowseLive community={community} />;
};

export default CommunityBrowsePage;
