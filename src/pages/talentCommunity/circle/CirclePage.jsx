import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import CircleCardGrid from '../../../components/sections/talentCommunity/circle/CircleCardGrid.jsx';
import CircleConnectDialog from '../../../components/sections/talentCommunity/circle/CircleConnectDialog.jsx';
import CircleConnectionsCard from '../../../components/sections/talentCommunity/circle/CircleConnectionsCard.jsx';
import CircleEmptyNetwork from '../../../components/sections/talentCommunity/circle/CircleEmptyNetwork.jsx';
import CircleFeed from '../../../components/sections/talentCommunity/circle/CircleFeed.jsx';
import CircleFrame from '../../../components/sections/talentCommunity/circle/CircleFrame.jsx';
import CircleHeader from '../../../components/sections/talentCommunity/circle/CircleHeader.jsx';
import CircleInvitationsCard from '../../../components/sections/talentCommunity/circle/CircleInvitationsCard.jsx';
import CircleInvitationsFootnote from '../../../components/sections/talentCommunity/circle/CircleInvitationsFootnote.jsx';
import CircleMinorBanner from '../../../components/sections/talentCommunity/circle/CircleMinorBanner.jsx';
import CirclePageWrap from '../../../components/sections/talentCommunity/circle/CirclePageWrap.jsx';
import CircleParentCard from '../../../components/sections/talentCommunity/circle/CircleParentCard.jsx';
import CirclePersonCard from '../../../components/sections/talentCommunity/circle/CirclePersonCard.jsx';
import CircleSectionHead from '../../../components/sections/talentCommunity/circle/CircleSectionHead.jsx';
import CircleSidePanel from '../../../components/sections/talentCommunity/circle/CircleSidePanel.jsx';
import CircleSwitch from '../../../components/sections/talentCommunity/circle/CircleSwitch.jsx';
import CircleTabs from '../../../components/sections/talentCommunity/circle/CircleTabs.jsx';
import CircleToast from '../../../components/sections/talentCommunity/circle/CircleToast.jsx';
import LiveCircleFeed from '../../../components/sections/talentCommunity/circle/LiveCircleFeed.jsx';
import LiveRecommendationsForYou from '../../../components/sections/talentCommunity/circle/LiveRecommendationsForYou.jsx';
import {
  CIRCLE_COPY as COPY,
  CIRCLE_PEOPLE,
  CIRCLE_SUMMARY,
  CONNECTIONS_RESPONSE,
  DISCOVER_RESPONSE,
  EMPTY_RESPONSE,
  INVITATIONS_RESPONSE,
  MINOR_RESPONSE,
} from '../../../components/sections/talentCommunity/circle/circleData.js';
import {
  circleActions,
  statusOf,
  useCircleStore,
} from '../../../components/sections/talentCommunity/circle/circleStore.js';
import {
  personHref,
  useCircleState,
} from '../../../components/sections/talentCommunity/circle/circleState.js';
import { useCircleToast } from '../../../components/sections/talentCommunity/circle/useCircleToast.js';
import { useLiveCircle } from '../../../components/sections/talentCommunity/circle/useLiveCircle.js';
import { isLoggedIn } from '../../../services/auth.api.js';
import { circleErrorText } from '../../../services/circle.api.js';

const log = debug('CirclePage');

const matches = (person, q) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    person.name,
    person.headline,
    person.town,
    ...(person.shares ?? []).map((s) => s.label),
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(needle);
};

/* Sort key of the Connections chips ("Recently added" keeps the API order). */
const sortKey = (sort, item, people) => {
  const person = people[item.id] ?? {};
  if (sort === 'Region') return item.region ?? '';
  if (sort === 'Skills')
    return (person.shares ?? []).find((s) => s.kind === 'skill')?.label ?? 'zz';
  if (sort === 'Community')
    return (person.shares ?? []).find((s) => s.kind === 'community')?.label ?? 'zz';
  return '';
};

/*
 * CirclePage — My circle (`/community?view=circle`, rendered by CommunityBrowsePage). One page, URL-driven (circleState.js):
 * Discover / Invitations / Circle / the feed, the under-18 and empty variants, the "Add a note" dialog and the toasts.
 * Live by default for a signed-in talent (backend circle.service via useLiveCircle): suggestions with their reasons,
 * invitations, the circle, and every action (link up, undo / withdraw, accept / ignore, dismiss, mute, remove, block,
 * report). `&state=…` demo frames and `?demo=1` keep the drawn mock (circleData.js + circleStore.js session actions).
 * The live screen hides what has no backend yet: Following / the feed (US-5.3.1-01 Q5, US-5.3.1-04), mentors, messaging.
 */
const CirclePage = () => {
  const circle = useCircleState();
  const navigate = useNavigate();
  const store = useCircleStore();
  const { toast, show, hide } = useCircleToast();
  const { tab: urlTab, sub, demoState, q } = circle;
  const [sort, setSort] = useState(CONNECTIONS_RESPONSE.sorts[0]);
  const [params] = useSearchParams();
  const liveOn = isLoggedIn() && !demoState && params.get('demo') !== '1';
  const L = useLiveCircle({ enabled: liveOn });
  const PEOPLE = liveOn ? L.people : CIRCLE_PEOPLE;
  // Live: no Following tab yet (US-5.3.1-01 Q5), so that URL shows Discover; the feed is live (US-5.3.1-04).
  const tab = liveOn && urlTab === 'following' ? 'discover' : urlTab;

  const minor = liveOn ? L.minor : demoState === 'minor';
  const empty = liveOn ? L.empty : demoState === 'empty';

  // Live search goes to the server (same rules as suggestions: minors are never found by adults).
  useEffect(() => {
    if (!liveOn) return undefined;
    const t = setTimeout(() => {
      L.actions.search(q).catch((err) => log.error('search failed', err?.response?.status));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveOn, q]);

  useEffect(() => {
    log('mount', { tab, sub, demoState, modal: circle.modal });
  }, [tab, sub, demoState, circle.modal]);

  // Demo frames that draw a toast on arrival (NW-03 link-up sent, NW-04 Nana Yaw accepted).
  useEffect(() => {
    if (demoState === 'sent') {
      show({
        text: COPY.toast.sent('Abena'),
        actionLabel: COPY.toast.undo,
        onAction: () => circle.update({ state: null }),
      });
    } else if (demoState === 'accepted') {
      show({
        text: COPY.toast.inCircle('Nana Yaw'),
        actionLabel: COPY.toast.messageAction,
        onAction: () => navigate('/messages'),
      });
    }
    // run once per demo state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoState]);

  /* ---- relationship helpers ---------------------------------------------------------------------------------- */
  const statusFor = useCallback(
    (id, base = 'none') => {
      if (liveOn) return L.statusFor(id, base);
      if (demoState === 'sent' && id === 'abena-owusu') return 'pending-sent';
      return statusOf(store, id, base);
    },
    [store, demoState, liveOn, L]
  );

  const mockReceived = useMemo(
    () => INVITATIONS_RESPONSE.received.filter((r) => !store.ignored.includes(r.id)),
    [store.ignored]
  );
  const received = liveOn ? L.received : mockReceived;
  const sentRows = liveOn ? L.sent : INVITATIONS_RESPONSE.sent;
  const mockAcceptedIds = useMemo(() => {
    const ids = mockReceived
      .filter((r) => store.relations[r.id]?.status === 'connected')
      .map((r) => r.id);
    if (demoState === 'accepted' && !ids.includes('nana-yaw-mensah')) ids.push('nana-yaw-mensah');
    return ids;
  }, [mockReceived, store.relations, demoState]);
  const acceptedIds = liveOn ? L.accepted : mockAcceptedIds;
  const pendingCount = liveOn
    ? L.received.filter((r) => !L.accepted.includes(r.id)).length
    : mockReceived.filter((r) => store.relations[r.id]?.status !== 'connected').length;
  const storeAccepted = mockReceived.filter(
    (r) => store.relations[r.id]?.status === 'connected'
  ).length;
  const total = liveOn
    ? L.connections.total
    : CIRCLE_SUMMARY.inCircle + storeAccepted - store.removed.length;
  const tabCounts = {
    invitations: pendingCount,
    circle: total,
    following: liveOn ? null : CIRCLE_SUMMARY.following,
  };
  const liveFail = (err, fallback) => show({ text: circleErrorText(err, fallback) });

  /* ---- actions ----------------------------------------------------------------------------------------------- */
  const selectTab = (id) =>
    circle.update({ tab: id === 'discover' ? null : id, sub: null, menu: null });
  const openConnect = (person) => circle.update({ modal: 'connect', person: person.id });
  const closeModal = () => circle.update({ modal: null, person: null, draft: null });

  const sendLinkUp = (person, note) => {
    log('link up', person.id, note ? 'with note' : 'no note', liveOn ? 'live' : 'mock');
    if (liveOn) {
      // The dialog stays open on an error (e.g. a note with a phone number) so the talent can edit it.
      L.actions
        .linkUp(person, note)
        .then((out) => {
          closeModal();
          if (out?.status === 'accepted') {
            show({ text: COPY.toast.inCircle(person.firstName) });
            return;
          }
          show({
            text: COPY.toast.sent(person.firstName),
            actionLabel: COPY.toast.undo,
            onAction: () =>
              L.actions
                .undoLinkUp(person)
                .catch((err) => liveFail(err, 'That couldn’t be undone.')),
          });
        })
        .catch((err) => liveFail(err, 'The link-up wasn’t sent. Please try again.'));
      return;
    }
    circleActions.linkUp(person.id, note);
    closeModal();
    show({
      text: COPY.toast.sent(person.firstName),
      actionLabel: COPY.toast.undo,
      onAction: () => circleActions.undoLinkUp(person.id),
    });
  };
  const learnFrom = (person) => {
    log('learn from', person.id);
    circleActions.toggleFollow(person.id);
  };
  const accept = (person) => {
    log('accept', person.id);
    if (liveOn) {
      const row = L.received.find((r) => r.id === person.id);
      L.actions
        .accept(row)
        .then(() => show({ text: COPY.toast.inCircle(person.firstName) }))
        .catch((err) => liveFail(err));
      return;
    }
    circleActions.accept(person.id);
    show({
      text: COPY.toast.inCircle(person.firstName),
      actionLabel: COPY.toast.messageAction,
      onAction: () => navigate('/messages'),
    });
  };
  const ignore = (person) => {
    log('ignore', person.id);
    if (liveOn) {
      const row = L.received.find((r) => r.id === person.id);
      L.actions.ignore(row).catch((err) => liveFail(err));
      return;
    }
    circleActions.ignore(person.id);
  };
  const withdraw = (row) => {
    log('withdraw', row.id);
    L.actions
      .withdraw(row)
      .then(() => show({ text: `Link-up to ${PEOPLE[row.id]?.firstName ?? 'them'} withdrawn` }))
      .catch((err) => liveFail(err));
  };
  const dismiss = (person) => {
    if (!liveOn) {
      circleActions.dismiss(person.id);
      return;
    }
    L.actions.dismiss(person).catch((err) => liveFail(err));
  };
  const way = (id) => {
    log('way in', id);
    if (id === 'community') navigate('/community');
    else if (id === 'classmates') navigate('/profile');
    else {
      // ⚠️ ASSUMPTION: "Invite a friend" copies a GTH link (WhatsApp sharing is not wired). Live: the GTH home page
      // (talents have no public profile link yet); the drawn demo keeps Kofi's.
      navigator.clipboard
        ?.writeText(
          liveOn ? `${window.location.origin}/` : `${window.location.origin}/talent/kofi-agyekum`
        )
        .catch(() => {});
      show({ text: liveOn ? 'GTH link copied' : 'Your GTH link is copied' });
    }
  };
  const liveMenuAction = (person, label) => {
    const first = person.firstName;
    const isMuted = L.connections.items.some((c) => c.id === person.id && c.muted);
    if (label === 'View profile') navigate(personHref(person.id));
    else if (label === 'Mute their posts') {
      L.actions
        .toggleMute(person, isMuted)
        .then(() =>
          show({
            text: isMuted ? `You will see ${first}'s posts again` : `You muted ${first}'s posts`,
          })
        )
        .catch((err) => liveFail(err));
    } else if (label === 'Remove connection') {
      L.actions
        .remove(person)
        .then(() => show({ text: `${first} was removed from your circle` }))
        .catch((err) => liveFail(err));
    } else if (label === 'Block') {
      // Confirm in the toast (no browser dialog): blocking also removes them from the circle.
      show({
        text: `Block ${first}? Neither of you will see the other in My circle.`,
        actionLabel: 'Block',
        onAction: () =>
          L.actions
            .block(person)
            .then(() => show({ text: `You blocked ${first}` }))
            .catch((err) => liveFail(err)),
      });
    } else if (label === 'Report') {
      L.actions
        .report(person, 'Reported from My circle')
        .then(() => show({ text: `Thanks, we will review ${first}'s profile` }))
        .catch((err) => liveFail(err));
    }
  };
  const menuAction = (k, person, label) => {
    circle.update({ menu: null });
    if (liveOn) {
      liveMenuAction(person, label);
      return;
    }
    if (k === 0) navigate(personHref(person.id));
    else if (k === 1) {
      circleActions.toggleMute(person.id);
      show({
        text: store.muted.includes(person.id)
          ? `You will see ${person.firstName}'s posts again`
          : `You muted ${person.firstName}'s posts`,
      });
    } else if (k === 2) {
      circleActions.removeConnection(person.id);
      show({
        text: `${person.firstName} was removed from your circle`,
        actionLabel: COPY.toast.undo,
        onAction: () => circleActions.restoreConnection(person.id),
      });
    } else show({ text: `Thanks, we will review ${person.firstName}'s profile` });
  };

  /* ---- lists --------------------------------------------------------------------------------------------------- */
  const renderCard = (item, i, topPicks) => {
    const person = PEOPLE[item.id];
    if (!person) return null;
    return (
      <CirclePersonCard
        key={item.id}
        person={person}
        cta={item.cta}
        status={statusFor(item.id, item.status)}
        following={store.following.includes(item.id)}
        index={i}
        topPick={topPicks.includes(item.id)}
        onLinkUp={openConnect}
        onNote={openConnect}
        onLearnFrom={learnFrom}
        onDismiss={dismiss}
      />
    );
  };
  const visible = (items) =>
    liveOn
      ? items.filter((item) => PEOPLE[item.id])
      : items.filter(
          (item) => !store.dismissed.includes(item.id) && matches(CIRCLE_PEOPLE[item.id], q)
        );

  const connectionItems = useMemo(() => {
    if (liveOn) {
      const items = L.connections.items.filter((item) => matches(PEOPLE[item.id] ?? {}, q));
      return sort === 'Recently added'
        ? items
        : [...items].sort((a, b) =>
            sortKey(sort, a, PEOPLE).localeCompare(sortKey(sort, b, PEOPLE))
          );
    }
    const items = CONNECTIONS_RESPONSE.items
      .filter((item) => !store.removed.includes(item.id))
      .filter((item) => matches(CIRCLE_PEOPLE[item.id], q));
    const fresh = acceptedIds
      .filter((id) => store.relations[id]?.status === 'connected')
      .map((id) => ({ id, connected: 'Connected just now', region: '' }));
    const all = [...fresh, ...items];
    return sort === 'Recently added'
      ? all
      : [...all].sort((a, b) =>
          sortKey(sort, a, CIRCLE_PEOPLE).localeCompare(sortKey(sort, b, CIRCLE_PEOPLE))
        );
  }, [store.removed, store.relations, acceptedIds, q, sort, liveOn, L.connections, PEOPLE]);

  const connectPerson = circle.modal === 'connect' ? PEOPLE[circle.person] : null;
  const mutedIds = liveOn
    ? L.connections.items.filter((c) => c.muted).map((c) => c.id)
    : store.muted;
  // Live Discover: the server's suggestions, or its search results while the talent types.
  const liveDiscover = L.discover?.suggestions;
  const liveSearching = liveOn && q.trim().length >= 2 && L.searchHits;
  const discoverBlock = liveOn
    ? liveSearching
      ? {
          title: `People matching “${q.trim()}”`,
          note: 'By name, school, skill or career goal',
          topPickId: null,
          items: L.searchHits.map((h) => ({ id: h.id, cta: 'link-up', status: h.status })),
        }
      : {
          title: liveDiscover?.title ?? DISCOVER_RESPONSE.suggestions.title,
          note: liveDiscover?.note ?? '',
          topPickId: liveDiscover?.topPickId ?? null,
          items: liveDiscover?.items ?? [],
        }
    : DISCOVER_RESPONSE.suggestions;
  const liveSide = (
    <CircleSidePanel
      className="lg:sticky lg:top-[16px]"
      tiles={[
        { value: total, label: 'In your circle' },
        { value: pendingCount, label: 'Invitations' },
        { value: sentRows.length, label: 'Link-ups sent' },
      ]}
    />
  );

  /* ---- body per view ------------------------------------------------------------------------------------------ */
  let body;
  if (liveOn && L.status !== 'ready') {
    body = (
      <div className="flex flex-col items-start gap-[12px] py-[40px]">
        <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
          {L.status === 'error' ? 'We couldn’t load your circle.' : 'Loading your circle…'}
        </p>
        {L.status === 'error' && (
          <button
            type="button"
            onClick={L.reload}
            className="cursor-pointer rounded-full border border-solid border-[#387440] bg-white px-[16px] py-[8px] font-sans text-[14px] font-semibold text-[#387440]"
          >
            Try again
          </button>
        )}
      </div>
    );
  } else if (!liveOn && (tab === 'feed' || tab === 'following')) {
    // ⚠️ ASSUMPTION: Figma draws the feed (NW-09) without tabs and does not say how to reach it: the Following tab opens it.
    body = (
      <CircleFeed
        store={store}
        statusFor={statusFor}
        onLinkUp={openConnect}
        onFollow={(p) => circleActions.toggleFollow(p.id)}
        onSeeAll={() => selectTab('discover')}
        show={show}
        stats={{ inCircle: total }}
      />
    );
  } else if (empty && !(liveOn && tab === 'feed')) {
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs active="discover" counts={tabCounts} onSelect={selectTab} withFeed={liveOn} />
        {/* Playful draws the empty card and the grid in the 1058px left column, Focused across the full 1506px. */}
        <div className="flex flex-col gap-[22px] playful:max-w-[1058px]">
          <CircleEmptyNetwork onWay={way} />
          <CircleSectionHead
            title={liveOn ? discoverBlock.title : EMPTY_RESPONSE.suggestions.title}
            note={liveOn ? discoverBlock.note : EMPTY_RESPONSE.suggestions.note}
            size="md"
          />
          <CircleCardGrid>
            {(liveOn
              ? visible(discoverBlock.items).map((item, i) =>
                  renderCard(item, i, [discoverBlock.topPickId])
                )
              : visible(EMPTY_RESPONSE.suggestions.items).map((item, i) =>
                  renderCard(item, i, [EMPTY_RESPONSE.suggestions.topPickId])
                )) || null}
          </CircleCardGrid>
          {liveOn && discoverBlock.items.length === 0 && (
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
              No suggestions yet. Add your school, career goals and skills to your profile and
              we&rsquo;ll find people who share them.
            </p>
          )}
        </div>
      </>
    );
  } else if (minor && !(liveOn && tab === 'feed')) {
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs active={tab} counts={tabCounts} onSelect={selectTab} withFeed={liveOn} />
        <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
          <div className="flex min-w-0 flex-col gap-[22px]">
            <CircleMinorBanner
              onLearnMore={() => circle.update({ help: true })}
              {...(liveOn && L.discover?.minor ? { banner: L.discover.minor.banner } : {})}
            />
            {liveOn ? (
              <>
                {/* Live under-18 view (CQ-5): classmates and approved groups only, no mentors. */}
                <CircleSectionHead title={discoverBlock.title} note={discoverBlock.note} />
                <CircleCardGrid>
                  {visible(discoverBlock.items).map((item, i) =>
                    renderCard(item, i, [discoverBlock.topPickId])
                  )}
                </CircleCardGrid>
                {discoverBlock.items.length === 0 && (
                  <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
                    No classmates to suggest yet. Add your school to your profile to find them.
                  </p>
                )}
              </>
            ) : (
              <>
                <CircleSectionHead
                  title={MINOR_RESPONSE.classmates.title}
                  note={MINOR_RESPONSE.classmates.note}
                />
                <CircleCardGrid>
                  {visible(MINOR_RESPONSE.classmates.items).map((item, i) =>
                    renderCard(item, i, [MINOR_RESPONSE.classmates.topPickId])
                  )}
                </CircleCardGrid>
                <CircleSectionHead
                  title={MINOR_RESPONSE.mentors.title}
                  note={MINOR_RESPONSE.mentors.note}
                />
                <CircleCardGrid>
                  {visible(MINOR_RESPONSE.mentors.items).map((item, i) =>
                    renderCard(item, i + 3, [MINOR_RESPONSE.mentors.topPickId])
                  )}
                </CircleCardGrid>
              </>
            )}
          </div>
          <CircleParentCard
            {...(liveOn && L.discover?.minor ? { card: L.discover.minor.parentCard } : {})}
          />
        </div>
      </>
    );
  } else {
    const side = liveOn ? (
      liveSide
    ) : (
      <CircleSidePanel stats={{ inCircle: total }} className="lg:sticky lg:top-[16px]" />
    );
    let main;
    if (liveOn && tab === 'feed') {
      main = <LiveCircleFeed minor={minor} onDiscover={() => selectTab('discover')} show={show} />;
    } else if (tab === 'invitations') {
      main = (
        <>
          <CircleInvitationsCard
            mode="full"
            received={received}
            accepted={acceptedIds}
            sent={sentRows}
            sub={sub}
            onSub={(id) => circle.update({ sub: id === 'received' ? null : id })}
            total={pendingCount}
            onAccept={accept}
            onIgnore={ignore}
            // Live: talent-to-talent messages don't exist yet, so no "Say hi"; sent requests can be withdrawn.
            onSayHi={liveOn ? undefined : (p) => navigate('/messages', { state: { to: p.id } })}
            people={PEOPLE}
            onWithdraw={liveOn ? withdraw : undefined}
            showManage={!liveOn}
          />
          {liveOn && <LiveRecommendationsForYou show={show} />}
          <CircleInvitationsFootnote />
        </>
      );
    } else if (tab === 'circle') {
      main = (
        <CircleConnectionsCard
          items={connectionItems}
          total={total}
          sort={sort}
          onSort={setSort}
          menuId={circle.menu}
          onMenu={(id) => circle.update({ menu: id })}
          muted={mutedIds}
          onMessage={liveOn ? undefined : () => navigate('/messages')}
          onMenuAction={menuAction}
          people={PEOPLE}
          menu={
            liveOn
              ? ['View profile', 'Mute their posts', 'Remove connection', 'Block', 'Report']
              : undefined
          }
        />
      );
    } else {
      const list = visible(discoverBlock.items);
      main = (
        <>
          {received.length > 0 && !q.trim() && (
            <CircleInvitationsCard
              mode="preview"
              received={received}
              accepted={acceptedIds}
              sent={sentRows}
              total={pendingCount}
              onSeeAll={() => selectTab('invitations')}
              onAccept={accept}
              onIgnore={ignore}
              onSayHi={liveOn ? undefined : () => navigate('/messages')}
              people={PEOPLE}
            />
          )}
          <CircleSectionHead
            title={discoverBlock.title}
            note={discoverBlock.note}
            sticker="PICKED FOR YOU"
          />
          <CircleCardGrid>
            {list.map((item, i) =>
              renderCard(
                item,
                i,
                liveOn ? [discoverBlock.topPickId] : ['abena-owusu', 'kwame-boateng']
              )
            )}
          </CircleCardGrid>
          {list.length === 0 && (
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
              {q.trim()
                ? `No people match “${q}”.`
                : 'No suggestions yet. Add your school, career goals and skills to your profile and we’ll find people who share them.'}
            </p>
          )}
        </>
      );
    }
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs active={tab} counts={tabCounts} onSelect={selectTab} withFeed={liveOn} />
        <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
          <div className="flex min-w-0 flex-col gap-[28px]">{main}</div>
          {side}
        </div>
      </>
    );
  }

  return (
    <CircleFrame circle={circle}>
      <CirclePageWrap>
        <CircleSwitch active="circle" count={pendingCount} rail={circle.rail} />
        {body}
      </CirclePageWrap>
      {connectPerson && (
        <CircleConnectDialog
          key={connectPerson.id}
          person={connectPerson}
          initialText={circle.draft ? COPY.notes.suggestion(connectPerson) : ''}
          onSend={(note) => sendLinkUp(connectPerson, note)}
          onClose={closeModal}
        />
      )}
      {toast && (
        <CircleToast
          key={toast.id}
          text={toast.text}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onDone={hide}
        />
      )}
    </CircleFrame>
  );
};

export default CirclePage;
