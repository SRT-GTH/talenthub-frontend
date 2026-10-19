import { useEffect, useMemo, useState } from 'react';
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
import { useLiveCatalogue } from '../../../components/sections/talentCommunity/useLiveCommunity.js';
import { basedOnNote } from '../../../components/sections/talentCommunity/liveCommunity.js';
import { HEADING } from '../../../components/sections/talentCommunity/communityStyles.js';
import { LiveError } from './LiveStates.jsx';

const log = debug('CommunityBrowseLive');

/*
 * CommunityBrowseLive — `/community` on the API (GET /api/community). Same parts and URL keys as the drawn page
 * (CommunityBrowsePage demo): `?cat`, `?q`, `?view=all`, `?menu=joined`.
 *   default      "Your communities" (when you have joined any) + "Picked for you" = the most-joined communities
 *   ?cat / ?q    filtered grid · no match -> "No community for …" + closest = the three most-joined
 * "Picked for you": communities matching the talent's profile (school, career goals, interests, industries, skills,
 * location — scored by the backend, US-2.3.11-01 "personalised based on career interests and PAOI"), the reason on each
 * cover pill, topped up with the most-joined. "Closest communities" on no results = the recommended / most-joined three.
 * ⚠️ ASSUMPTIONS:
 * Mute and "Request a community" have no backend: mute stays in this tab (communityMembership.js), a request only counts you in
 * on screen.
 */
const PICKED = 8;
const categoryLabel = (id) => COMMUNITY_CATEGORIES.find((c) => c.id === id)?.label ?? id;

const CommunityBrowseLive = ({ community }) => {
  const { cat, q, view, menu, update } = community;
  const navigate = useNavigate();
  const catalogue = useLiveCatalogue();
  const { isMuted, toggleMute } = useCommunityMembership();
  const [menuId, setMenuId] = useState(undefined);
  const [requested, setRequested] = useState(false);
  const [tileRequested, setTileRequested] = useState(false);

  const cards = catalogue.cards;
  const term = q.trim();
  const loading = catalogue.status === 'loading';

  useEffect(() => {
    log('state', { status: catalogue.status, n: cards.length, cat, q, view });
  }, [catalogue.status, cards.length, cat, q, view]);

  const filtered = useMemo(() => {
    const needle = term.toLowerCase();
    return cards.filter((c) => {
      if (cat && !c.categories.includes(cat)) return false;
      if (!needle) return true;
      return [c.name, c.description, ...c.topics, ...c.categories.map(categoryLabel)]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [cards, cat, term]);

  const filtering = Boolean(cat || term);
  const mine = cards.filter((c) => c.joined);
  const byMembers = [...cards].sort((a, b) => b.members - a.members);
  // Recommended (profile score) first, topped up with the most-joined so the section is never short.
  const recommended = cards.filter((c) => !c.joined && c.score > 0).sort((a, b) => b.score - a.score || b.members - a.members);
  const picked = [...recommended, ...byMembers.filter((c) => !c.joined && c.score === 0)].slice(0, PICKED);
  const pickedNote = basedOnNote(catalogue.basedOn) ?? 'The most-joined communities on GTH right now';

  const onJoin = async (c) => {
    log('join', c.id);
    const ok = await catalogue.join(c.id);
    if (ok) navigate(`/community/${c.id}?welcome=1`);
  };

  const visible = filtering ? filtered : view === 'all' ? cards : [...mine, ...picked];
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

  const clearFilters = () => {
    setRequested(false);
    setMenuId(undefined);
    update({ cat: null, q: null, menu: null });
  };

  let body;
  if (catalogue.status === 'error') {
    body = <LiveError message="Couldn’t load communities. Check your connection and try again." onRetry={catalogue.reload} />;
  } else if (loading) {
    body = (
      <>
        <BrowseSectionHead icon={CommunityTargetIcon} title={COPY.pickedTitle} note={COPY.loadingNote} />
        <BrowseGrid gap="wide" aria-busy="true" aria-label="Loading communities">
          {Array.from({ length: PICKED }, (_, i) => (
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
        <BrowseGrid gap="tight">{[...recommended, ...byMembers].filter((c, i, all) => all.indexOf(c) === i).slice(0, 3).map((c) => renderCard(c))}</BrowseGrid>
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
      </>
    );
  } else {
    body = (
      <>
        {mine.length ? (
          <>
            <BrowseSectionHead icon={CommunityUsersIcon} title={COPY.yourCommunities} sticker={`${mine.length} joined`} />
            <BrowseGrid>{mine.map((c) => renderCard(c))}</BrowseGrid>
          </>
        ) : null}
        <BrowseSectionHead
          icon={CommunityTargetIcon}
          title={COPY.pickedTitle}
          note={pickedNote}
        />
        <BrowseGrid>
          {picked.map((c) => renderCard(c))}
          {picked.length < PICKED ? (
            <RequestTile requested={tileRequested} onRequest={() => setTileRequested(true)} />
          ) : null}
        </BrowseGrid>
      </>
    );
  }

  return (
    <CommunityFrame community={community}>
      <div className="mx-auto flex w-full max-w-[1425px] flex-col gap-[24px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.85vw,32px)] pb-[24px]">
        <BrowseHeader total={cards.length} />
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
