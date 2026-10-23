import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { debug } from '../../../utils/debug.js';
import { useUiStyle } from '../../../hooks/useUiStyle.js';
import ArchiveDialog from '../../../components/sections/talentCommunity/create/ArchiveDialog.jsx';
import InviteDialog from '../../../components/sections/talentCommunity/create/InviteDialog.jsx';
import ManageDialog from '../../../components/sections/talentCommunity/create/ManageDialog.jsx';
import MentorDialog from '../../../components/sections/talentCommunity/create/MentorDialog.jsx';
import OwnerEmptyFeed from '../../../components/sections/talentCommunity/create/OwnerEmptyFeed.jsx';
import OwnerHero from '../../../components/sections/talentCommunity/create/OwnerHero.jsx';
import OwnerLiveToast from '../../../components/sections/talentCommunity/create/OwnerLiveToast.jsx';
import TransferDialog from '../../../components/sections/talentCommunity/create/TransferDialog.jsx';
import { Callout } from '../../../components/sections/talentCommunity/create/CreateDialogParts.jsx';
import {
  OWNER_COPY,
  OWNER_PAGE_ASSETS,
  OWNER_STATUS_COPY,
} from '../../../components/sections/talentCommunity/create/createCommunityData.js';
import { useCreateCommunityState } from '../../../components/sections/talentCommunity/create/createCommunityState.js';
import { useOwnedCommunity } from '../../../components/sections/talentCommunity/create/createCommunityStore.js';
import CommunityDialogs from '../../../components/sections/talentCommunity/CommunityDialogs.jsx';
import CommunityFrame from '../../../components/sections/talentCommunity/CommunityFrame.jsx';
import {
  Composer,
  FeedToolbar,
} from '../../../components/sections/talentCommunity/CommunityFeedParts.jsx';
import {
  CommunityTabs,
  ContributorsCard,
  InfoCard,
  RelatedCard,
  TopicsCard,
} from '../../../components/sections/talentCommunity/CommunityPageParts.jsx';
import { COMMUNITY_PAGE_COPY } from '../../../components/sections/talentCommunity/communityData.js';
import {
  SIDE_LEFT,
  SIDE_RIGHT,
} from '../../../components/sections/talentCommunity/communityPageStyles.js';
import { useCommunityState } from '../../../components/sections/talentCommunity/communityState.js';

const log = debug('CommunityOwnerPage');

const LIVE_STATUSES = ['live', 'transfer-pending', 'archived'];
const VISIBILITY = { public: 'Public', request: 'Request to join', invite: 'Invite only' };

/*
 * CommunityOwnerPage — `/community/:communityId/manage`: the owner's view of a community they created (Figma CC-06 … CC-17b and the
 * dialogs CC-09, CC-10, CC-13 … CC-17 drawn over it). URL contract: the top of createCommunityState.js.
 * Status drives the banner, the sticker, the hero buttons and the empty-feed copy (OWNER_STATUS_COPY); `?modal=` opens the dialogs.
 * Owner-only for now: nothing here is shown to other members (⚠️ ASSUMPTION: the public page of an owned community is the existing
 * Community page, which does not know owned communities yet).
 */
const CommunityOwnerPage = () => {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const create = useCreateCommunityState();
  const shell = useCommunityState();
  const { uiStyle } = useUiStyle();
  const { modal, tab, demo, ownerState, requests, update } = create;
  const { community, patch } = useOwnedCommunity({ communityId, demo, ownerState, requests });
  const [filter, setFilter] = useState(COMMUNITY_PAGE_COPY.filters[0]);
  const status = demo ? (ownerState ?? 'live') : (community?.status ?? 'under-review');
  const copy = OWNER_STATUS_COPY[status] ?? OWNER_STATUS_COPY.live;
  const live = LIVE_STATUSES.includes(status);

  useEffect(() => {
    log('mount', communityId, status, modal ?? '');
  }, [communityId, status, modal]);

  const closeModal = useCallback(() => update({ modal: null, tab: null }), [update]);
  const setStatus = useCallback(
    (next, changes = {}) => {
      log('status', status, '→', next);
      patch((current) => ({ ...current, ...changes, status: next }));
      update({ modal: null, tab: null, toast: null, ...(demo ? { state: next } : {}) });
    },
    [patch, update, demo, status]
  );

  const editUrl = useCallback(
    (step) =>
      `/community/create?edit=${communityId}&from=${status}${step && step !== 'basics' ? `&step=${step}` : ''}${demo ? '&demo=1' : ''}`,
    [communityId, status, demo]
  );

  const onAction = (id) => {
    log('action', id);
    switch (id) {
      case 'edit':
      case 'resubmit':
        navigate(editUrl());
        break;
      case 'mentor':
        update({ modal: 'mentor' });
        break;
      case 'manage':
        update({ modal: 'manage', tab: 'reports' });
        break;
      case 'invite':
        update({ modal: 'invite' });
        break;
      case 'cancel-transfer':
        setStatus('live', { transfer: null });
        break;
      case 'restore':
        setStatus('live', { archivedOn: null });
        break;
      case 'ask':
        // ⚠️ ASSUMPTION: "Ask GTH a question" opens the shell's Help pop-over (default copy): no support destination is drawn.
        update({ help: true });
        break;
      default:
        break;
    }
  };

  const mentorInvited = (person) => {
    patch((current) => ({
      ...current,
      invitedMentor: { name: person.name, sentAgo: 'just now' },
      moderators: current.moderators.some((m) => m.name === person.name)
        ? current.moderators
        : [
            ...current.moderators,
            {
              id: person.id,
              name: person.name,
              avatar: person.avatar,
              title: 'Verified teacher',
              note: 'Verified teacher · invite sent',
              state: 'invited',
            },
          ],
    }));
  };

  const manageActions = {
    keepReport: (report) =>
      patch((c) => ({ ...c, reports: c.reports.filter((r) => r.id !== report.id) })),
    removeReport: (report) =>
      patch((c) => ({ ...c, reports: c.reports.filter((r) => r.id !== report.id) })),
    remind: (mod) => log('remind', mod.id),
    approve: (request) =>
      patch((c) => ({
        ...c,
        joinRequests: c.joinRequests.filter((r) => r.id !== request.id),
        members: [
          ...c.members,
          {
            id: request.id,
            name: request.name,
            role: 'member',
            activity: 'Joined today',
            avatar: request.avatar,
          },
        ],
      })),
    decline: (request) =>
      patch((c) => ({ ...c, joinRequests: c.joinRequests.filter((r) => r.id !== request.id) })),
    approveAll: () =>
      patch((c) => ({
        ...c,
        joinRequests: [],
        members: [
          ...c.members,
          ...c.joinRequests.map((r) => ({
            id: r.id,
            name: r.name,
            role: 'member',
            activity: 'Joined today',
            avatar: r.avatar,
          })),
        ],
      })),
    edit: (step) => navigate(editUrl(step)),
    transfer: () => update({ modal: 'transfer', tab: null }),
    archive: () => update({ modal: 'archive', tab: null }),
  };

  const share = useCallback(() => {
    if (!community) return;
    const url = `https://${community.inviteLink}`;
    log('share', url);
    if (navigator.share) navigator.share({ title: community.name, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  }, [community]);
  const hideToast = useCallback(() => update({ toast: null }), [update]);

  const detail = useMemo(() => {
    if (!community) return null;
    const invited = community.moderators.filter((m) => m.state === 'invited').length;
    const teachers = community.moderators.filter((m) => m.state === 'active').length;
    const moderatedBy = live
      ? `You + ${teachers} teacher${teachers === 1 ? '' : 's'}`
      : invited
        ? `You + ${invited} invited`
        : 'You';
    const rows = live
      ? community.members.map((m) => ({
          name: m.name,
          active: m.activity,
          online: m.role === 'owner',
          avatar: m.avatar,
        }))
      : community.moderators.map((m) => ({
          name: m.name,
          active: m.note,
          online: m.state === 'owner',
          avatar: m.avatar,
        }));
    return {
      info: {
        members: String(community.members.length),
        activity: live ? 'New today' : 'Not live yet',
        visibility: VISIBILITY[community.joinPolicy],
        moderatedBy,
      },
      contributorsTitle: live ? OWNER_COPY.foundingTitle : OWNER_COPY.moderatorsTitle,
      contributors: rows,
      topicsTitle: OWNER_COPY.topicsTitle,
      topics: OWNER_PAGE_ASSETS.topics,
      related: OWNER_PAGE_ASSETS.related,
    };
  }, [community, live]);

  if (!community || !detail) return demo ? null : <Navigate to="/community" replace />;

  const empty = copy.empty;
  const tabs = [
    { id: 'feed', label: OWNER_COPY.tabs.feed },
    {
      id: 'about',
      label: OWNER_COPY.tabs.about,
      inert: true,
    },
    {
      id: 'members',
      label: OWNER_COPY.tabs.members,
      count: live ? String(community.members.length) : undefined,
      inert: true,
    },
    { id: 'events', label: OWNER_COPY.tabs.events, count: live ? '0' : undefined, inert: true },
  ];
  const openWelcome = () => update({ modal: 'create' });
  const emptyAction = (id) => {
    if (id === 'cta' && copy.secondary?.id === 'resubmit') onAction('resubmit');
    else openWelcome();
  };
  const composerAction = () => {
    if (status === 'live' || status === 'transfer-pending') openWelcome();
    else log('composer inert until live', status);
  };

  return (
    <CommunityFrame community={shell}>
      <div className="mx-auto flex w-full max-w-[1602px] flex-col gap-[20px] pb-[32px] pl-[clamp(12px,2.31vw,40px)] pr-[clamp(12px,3.24vw,56px)] pt-[clamp(16px,1.39vw,24px)]">
        {copy.banner ? (
          <Callout
            role="status"
            tone={copy.banner.tone}
            icon={copy.banner.icon}
            title={copy.banner.title}
          >
            {copy.banner.body}
          </Callout>
        ) : null}
        <OwnerHero
          community={community}
          status={status}
          copy={copy}
          photos={OWNER_PAGE_ASSETS.collage}
          faces={OWNER_PAGE_ASSETS.faces}
          showEvents={live}
          onAction={onAction}
        />
        <CommunityTabs tabs={tabs} active="feed" onChange={() => {}} />
        <div className="flex flex-col gap-[24px] xl:flex-row xl:items-start">
          <aside className={`order-2 flex shrink-0 flex-col gap-[20px] xl:order-1 ${SIDE_LEFT}`}>
            <InfoCard detail={detail} gap={24} />
            <ContributorsCard detail={detail} />
          </aside>
          <div className="order-1 min-w-0 flex-1 xl:order-2">
            <div className="flex min-w-0 flex-col gap-[16px]">
              <FeedToolbar
                filters={COMMUNITY_PAGE_COPY.filters}
                filter={filter}
                onFilter={setFilter}
                sort={COMMUNITY_PAGE_COPY.sort}
              />
              {status === 'archived' ? null : <Composer onCompose={composerAction} />}
              <OwnerEmptyFeed
                title={empty.title}
                body={empty.body}
                cta={empty.cta}
                ideas={status !== 'archived'}
                onCta={emptyAction}
              />
            </div>
          </div>
          <aside className={`order-3 flex shrink-0 flex-col gap-[20px] ${SIDE_RIGHT}`}>
            <TopicsCard detail={detail} gap={14} tagGap={16} />
            <RelatedCard detail={detail} gap={24} />
          </aside>
        </div>
      </div>
      {create.toast === 'live' ? (
        <OwnerLiveToast
          name={community.name}
          xp={uiStyle === 'playful' ? 'XP' : 'pts'}
          onShare={share}
          onDone={hideToast}
        />
      ) : null}
      {modal === 'invite' ? <InviteDialog community={community} onClose={closeModal} /> : null}
      {modal === 'mentor' ? (
        <MentorDialog community={community} onInvite={mentorInvited} onClose={closeModal} />
      ) : null}
      {modal === 'manage' ? (
        <ManageDialog
          community={community}
          tab={tab}
          onTab={(next) => update({ tab: next })}
          onClose={closeModal}
          actions={manageActions}
        />
      ) : null}
      {modal === 'transfer' ? (
        <TransferDialog
          community={community}
          initialConfirmed={demo}
          onSend={(mod) =>
            setStatus('transfer-pending', {
              transfer: { toId: mod.id, toName: mod.name, sentOn: 'today', expiresOn: '27 Oct' },
            })
          }
          onClose={closeModal}
        />
      ) : null}
      {modal === 'archive' ? (
        <ArchiveDialog
          community={community}
          onArchive={() => setStatus('archived', { archivedOn: '20 Oct 2026' })}
          onClose={closeModal}
        />
      ) : null}
      <CommunityDialogs community={shell} communityName={`#${community.name}`} />
    </CommunityFrame>
  );
};

export default CommunityOwnerPage;
