import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
const sortKey = (sort, item) => {
  const person = CIRCLE_PEOPLE[item.id];
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
 * Data: circleData.js blocks; what the talent does is kept in circleStore.js (session).
 */
const CirclePage = () => {
  const circle = useCircleState();
  const navigate = useNavigate();
  const store = useCircleStore();
  const { toast, show, hide } = useCircleToast();
  const { tab, sub, demoState, q } = circle;
  const [sort, setSort] = useState(CONNECTIONS_RESPONSE.sorts[0]);

  const minor = demoState === 'minor';
  const empty = demoState === 'empty';

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
      if (demoState === 'sent' && id === 'abena-owusu') return 'pending-sent';
      return statusOf(store, id, base);
    },
    [store, demoState]
  );

  const received = useMemo(
    () => INVITATIONS_RESPONSE.received.filter((r) => !store.ignored.includes(r.id)),
    [store.ignored]
  );
  const acceptedIds = useMemo(() => {
    const ids = received
      .filter((r) => store.relations[r.id]?.status === 'connected')
      .map((r) => r.id);
    if (demoState === 'accepted' && !ids.includes('nana-yaw-mensah')) ids.push('nana-yaw-mensah');
    return ids;
  }, [received, store.relations, demoState]);
  const pendingCount = received.filter((r) => store.relations[r.id]?.status !== 'connected').length;
  const storeAccepted = received.filter(
    (r) => store.relations[r.id]?.status === 'connected'
  ).length;
  const total = CIRCLE_SUMMARY.inCircle + storeAccepted - store.removed.length;

  /* ---- actions ----------------------------------------------------------------------------------------------- */
  const selectTab = (id) =>
    circle.update({ tab: id === 'discover' ? null : id, sub: null, menu: null });
  const openConnect = (person) => circle.update({ modal: 'connect', person: person.id });
  const closeModal = () => circle.update({ modal: null, person: null, draft: null });

  const sendLinkUp = (person, note) => {
    log('link up', person.id, note ? 'with note' : 'no note');
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
    circleActions.accept(person.id);
    show({
      text: COPY.toast.inCircle(person.firstName),
      actionLabel: COPY.toast.messageAction,
      onAction: () => navigate('/messages'),
    });
  };
  const ignore = (person) => {
    log('ignore', person.id);
    circleActions.ignore(person.id);
  };
  const way = (id) => {
    log('way in', id);
    if (id === 'community') navigate('/community');
    else if (id === 'classmates') navigate('/profile');
    else {
      // ⚠️ ASSUMPTION: "Invite a friend" copies the talent's GTH link (WhatsApp sharing is not wired).
      navigator.clipboard
        ?.writeText(`${window.location.origin}/talent/kofi-agyekum`)
        .catch(() => {});
      show({ text: 'Your GTH link is copied' });
    }
  };
  const menuAction = (k, person) => {
    circle.update({ menu: null });
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
    const person = CIRCLE_PEOPLE[item.id];
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
        onDismiss={(p) => circleActions.dismiss(p.id)}
      />
    );
  };
  const visible = (items) =>
    items.filter(
      (item) => !store.dismissed.includes(item.id) && matches(CIRCLE_PEOPLE[item.id], q)
    );

  const connectionItems = useMemo(() => {
    const items = CONNECTIONS_RESPONSE.items
      .filter((item) => !store.removed.includes(item.id))
      .filter((item) => matches(CIRCLE_PEOPLE[item.id], q));
    const fresh = acceptedIds
      .filter((id) => store.relations[id]?.status === 'connected')
      .map((id) => ({ id, connected: 'Connected just now', region: '' }));
    const all = [...fresh, ...items];
    return sort === 'Recently added'
      ? all
      : [...all].sort((a, b) => sortKey(sort, a).localeCompare(sortKey(sort, b)));
  }, [store.removed, store.relations, acceptedIds, q, sort]);

  const connectPerson = circle.modal === 'connect' ? CIRCLE_PEOPLE[circle.person] : null;

  /* ---- body per view ------------------------------------------------------------------------------------------ */
  let body;
  if (tab === 'feed' || tab === 'following') {
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
  } else if (empty) {
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs
          active="discover"
          counts={{ invitations: pendingCount, circle: total, following: CIRCLE_SUMMARY.following }}
          onSelect={selectTab}
        />
        {/* Playful draws the empty card and the grid in the 1058px left column, Focused across the full 1506px. */}
        <div className="flex flex-col gap-[22px] playful:max-w-[1058px]">
          <CircleEmptyNetwork onWay={way} />
          <CircleSectionHead
            title={EMPTY_RESPONSE.suggestions.title}
            note={EMPTY_RESPONSE.suggestions.note}
            size="md"
          />
          <CircleCardGrid>
            {visible(EMPTY_RESPONSE.suggestions.items).map((item, i) =>
              renderCard(item, i, [EMPTY_RESPONSE.suggestions.topPickId])
            )}
          </CircleCardGrid>
        </div>
      </>
    );
  } else if (minor) {
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs
          active={tab}
          counts={{ invitations: pendingCount, circle: total, following: CIRCLE_SUMMARY.following }}
          onSelect={selectTab}
        />
        <div className="grid grid-cols-1 items-start gap-[28px] lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)]">
          <div className="flex min-w-0 flex-col gap-[22px]">
            <CircleMinorBanner onLearnMore={() => circle.update({ help: true })} />
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
          </div>
          <CircleParentCard />
        </div>
      </>
    );
  } else {
    const side = (
      <CircleSidePanel stats={{ inCircle: total }} className="lg:sticky lg:top-[16px]" />
    );
    let main;
    if (tab === 'invitations') {
      main = (
        <>
          <CircleInvitationsCard
            mode="full"
            received={received}
            accepted={acceptedIds}
            sent={INVITATIONS_RESPONSE.sent}
            sub={sub}
            onSub={(id) => circle.update({ sub: id === 'received' ? null : id })}
            total={pendingCount}
            xpFor={acceptedIds[0]}
            onAccept={accept}
            onIgnore={ignore}
            onSayHi={(p) => navigate('/messages', { state: { to: p.id } })}
          />
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
          muted={store.muted}
          onMessage={() => navigate('/messages')}
          onMenuAction={menuAction}
        />
      );
    } else {
      const list = visible(DISCOVER_RESPONSE.suggestions.items);
      main = (
        <>
          {received.length > 0 && !q.trim() && (
            <CircleInvitationsCard
              mode="preview"
              received={received}
              accepted={acceptedIds}
              sent={INVITATIONS_RESPONSE.sent}
              total={pendingCount}
              onSeeAll={() => selectTab('invitations')}
              onAccept={accept}
              onIgnore={ignore}
              onSayHi={() => navigate('/messages')}
            />
          )}
          <CircleSectionHead
            title={DISCOVER_RESPONSE.suggestions.title}
            note={DISCOVER_RESPONSE.suggestions.note}
            sticker="PICKED FOR YOU"
          />
          <CircleCardGrid>
            {list.map((item, i) => renderCard(item, i, ['abena-owusu', 'kwame-boateng']))}
          </CircleCardGrid>
          {list.length === 0 && (
            <p className="m-0 font-sans text-[14px] leading-[20px] text-[#595959]">
              {`No people match “${q}”.`}
            </p>
          )}
        </>
      );
    }
    body = (
      <>
        <CircleHeader q={q} onQ={(text) => circle.update({ q: text })} />
        <CircleTabs
          active={tab}
          counts={{ invitations: pendingCount, circle: total, following: CIRCLE_SUMMARY.following }}
          onSelect={selectTab}
        />
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
