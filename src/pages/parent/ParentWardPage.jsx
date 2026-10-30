import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import WardShell from '../../components/sections/parent/wards/WardShell.jsx';
import WardOverview from '../../components/sections/parent/wards/WardOverview.jsx';
import EvaluationsTab from '../../components/sections/parent/wards/tabs/EvaluationsTab.jsx';
import WalletTab from '../../components/sections/parent/wards/tabs/WalletTab.jsx';
import ActivityTab from '../../components/sections/parent/wards/tabs/ActivityTab.jsx';
import CrewTab from '../../components/sections/parent/wards/tabs/CrewTab.jsx';
import TabCard from '../../components/sections/parent/wards/tabs/TabCard.jsx';
import VisibilityDialog from '../../components/sections/parent/wards/dialogs/VisibilityDialog.jsx';
import UnlinkDialog from '../../components/sections/parent/wards/dialogs/UnlinkDialog.jsx';
import ParentToast from '../../components/sections/parent/wards/dialogs/ParentToast.jsx';
import { visibilityToast } from '../../components/sections/parent/wards/dialogs/data/dialogsData.js';
import WardFlagsSection from '../../components/sections/parent/flags/WardFlagsSection.jsx';
import { flagsBadge, useWardFlags } from '../../components/sections/parent/flags/flagsStore.js';
import WalletsLayer from '../../components/sections/parent/wallets/WalletsLayer.jsx';
import WardOptedOut from '../../components/sections/parent/optout/WardOptedOut.jsx';
import WardOptOutLayer from '../../components/sections/parent/optout/WardOptOutLayer.jsx';
import {
  isOptedOut,
  useWardAccess,
} from '../../components/sections/parent/optout/wardAccessStore.js';
import {
  dropParentWard,
  loadParentMe,
  refreshParent,
  useParentMe,
  useParentWard,
} from '../../components/sections/parent/live/parentLive.js';
import {
  accessFromDetail,
  activityTab,
  flagRows,
  optOutPayload,
  profileGroups,
  wardView,
} from '../../components/sections/parent/live/parentLiveView.js';
import {
  approveWardFix,
  flagWardField,
  flagWardFieldAgain,
  optOutWard,
  parentError,
  restoreWard,
  unlinkWard,
} from '../../services/parent.api.js';

const log = debug('ParentWardPage');

/*
 * ParentWardPage — /parent/wards/:wardId (Figma canvas "Parent · 02 My wards and ward page" 10057:560). wardId = abena | elliot.
 *   ?tab=overview (default) PW-02 / PW-02b · evaluations PW-11 · wallet PW-12 · activity PW-13 · crew PW-16
 *   ?tab=profile · flags    Abena only: the Flags and corrections canvas (flags/WardFlagsSection: PW-03 … PW-06c, URL table there, wiki/parent-flags.md); other wards show the overview
 *   ?notice=turning18      PW-10 "Abena turns 18 on 12 March" over the overview (Abena only)
 *   ?tab=wallet&modal=approve | decline | limits | topup …   the Ward wallets dialogs over the Wallet tab (Abena; wallets/WalletsLayer, wiki/parent-wallets.md)
 *   ?modal=visibility      PW-14 "Who can find Abena"; saving closes it and shows the PW-14b toast
 *   ?modal=unlink          PW-15 "Unlink Elliot"; confirming goes to /parent/wards?unlinked=elliot (PW-15b: list without Elliot + toast)
 *   Opt out and restore (canvas "Parent · 05" 10057:1302, parent/optout/WardOptOutLayer, wiki/parent-opt-out.md): ?modal=opt-out PO-01 · ?state=opted-out PO-02 (the paused view, <WardOptedOut>) ·
 *   ?state=opted-out&modal=restore PO-03 · ?toast=access-restored PO-04 · ?modal=report PH-03 · ?modal=report-sent PH-03b
 * Demo (`?state=`/`?demo=1` or signed out): the mock wards above. ⚠️ ASSUMPTION: the unlink lives only in the URL (mock); Undo only closes the toast.
 * Live (signed in): :wardId is the ward's entity id; GET /parent/wards/:id fills the header, KPIs, Profile, Flags and
 * Activity tabs; flags, opt out / restore and unlink write to the API and re-read. Evaluations, Wallet and Crew have no
 * parent backend yet, so they say so instead of showing the mock rows.
 */
// The wards the report dialog (PH-03) can be about: the parent's linked wards (Kwesi is only a pending link).
const LINKED_WARDS = [WARDS.abena, WARDS.elliot];

const TABS = {
  evaluations: EvaluationsTab,
  wallet: WalletTab,
  activity: ActivityTab,
  crew: CrewTab,
};

const NOT_YET = {
  evaluations: (w) =>
    `Evaluations for ${w.firstName} will show here. Use Evaluate in the menu to write one.`,
  wallet: () => 'Ward wallets are not available yet. Nothing has been charged or paid.',
  crew: (w) => `${w.firstName}’s clubs and crew are not shown to parents yet.`,
};

const TAB_TITLES = {
  profile: 'Profile',
  flags: 'Flags',
  evaluations: 'Evaluations',
  wallet: 'Wallet',
  activity: 'Activity',
  crew: 'Crew',
};

const ParentWardPage = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const tab = params.get('tab') || 'overview';
  const modal = params.get('modal');
  const flagsState = useWardFlags();
  const access = useWardAccess();

  // Live data (signed in, not a frame URL).
  const me = useParentMe();
  const detail = useParentWard(wardId);
  const live = detail.live;
  const summary = me.data?.wards?.find((w) => w.id === wardId) || null;
  const liveWard = live
    ? detail.data
      ? wardView(detail.data.ward, detail.data)
      : summary
        ? wardView(summary)
        : null
    : null;

  const ward = live ? liveWard : WARDS[wardId];
  const optedOut = live ? Boolean(liveWard?.optedOut) : isOptedOut(access, wardId);
  const notice =
    params.get('notice') === 'turning18' && (live ? ward?.turning18 : wardId === 'abena')
      ? 'turning18'
      : undefined;

  // Page title (WCAG 2.4.2): the ward, and what is showing for it.
  useDocumentTitle(
    ward
      ? optedOut
        ? `${ward.name} (opted out) · My wards`
        : `${TAB_TITLES[tab] ? `${TAB_TITLES[tab]} · ` : ''}${ward.name} · My wards`
      : null
  );

  useEffect(() => {
    log('mount', { wardId, tab, notice, modal, live });
  }, [wardId, tab, notice, modal, live]);

  if (live) {
    // Not this parent's ward (or unlinked meanwhile): back to the list.
    if (detail.code === 'NOT_YOUR_WARD' || (me.data && !summary && detail.status === 'error')) {
      return <Navigate to="/parent/wards" replace />;
    }
    if (!ward) {
      return (
        <ParentFrame active="wards">
          <p role="status" className="m-0 font-sans text-[15px] text-[#595959]">
            {detail.status === 'error' ? detail.error : 'Loading…'}
          </p>
        </ParentFrame>
      );
    }
  } else if (!ward || wardId === 'kwesi') {
    return <Navigate to="/parent/wards" replace />;
  }

  const setModal = (next) => {
    const p = new URLSearchParams(params);
    if (next) p.set('modal', next);
    else p.delete('modal');
    setParams(p, { replace: true });
  };
  const Tab = TABS[tab];
  // Demo: the mock holds only Abena's flags (flags/flagsStore). Live: every ward has its own flags.
  const hasFlags = live || wardId === 'abena';
  const flagsTab = hasFlags && (tab === 'profile' || tab === 'flags');
  const shellWard =
    !live && hasFlags
      ? { ...ward, tabCounts: { ...ward.tabCounts, flags: flagsBadge(flagsState) } }
      : ward;

  const liveFlags = live
    ? {
        groups: profileGroups(detail.data),
        flags: flagRows(detail.data),
        send: async (fieldKey, values) => {
          await flagWardField(wardId, { fieldKey, ...values });
          await refreshParent(wardId);
        },
        approve: async (flagId) => {
          await approveWardFix(wardId, flagId);
          await refreshParent(wardId);
        },
        again: async (flagId, values) => {
          await flagWardFieldAgain(wardId, flagId, values);
          await refreshParent(wardId);
        },
      }
    : null;

  const liveAccess = live
    ? {
        optedOut,
        optOut: async (values) => {
          await optOutWard(wardId, optOutPayload(values));
          await refreshParent(wardId);
        },
        restore: async () => {
          await restoreWard(wardId);
          await refreshParent(wardId);
        },
      }
    : null;

  const linkedWards = live ? (me.data?.wards || []).map((w) => wardView(w)) : LINKED_WARDS;

  const renderTab = () => {
    if (flagsTab) return <WardFlagsSection ward={ward} tab={tab} live={liveFlags} />;
    if (live && NOT_YET[tab]) {
      return (
        <TabCard title={TAB_TITLES[tab]} variant="label" id={`tab-${tab}`}>
          <p className="m-0 font-sans text-[14px] leading-normal text-[#575755]">
            {NOT_YET[tab](ward)}
          </p>
        </TabCard>
      );
    }
    if (live && tab === 'activity')
      return <ActivityTab ward={ward} data={activityTab(detail.data, ward)} />;
    if (Tab) {
      return (
        <Tab
          ward={ward}
          onDecide={() => setModal('approve')}
          onTopUp={() => setModal('topup')}
          onLimits={() => setModal('limits')}
          onReport={() => setModal('report')}
        />
      );
    }
    return <WardOverview ward={ward} showSide={notice === 'turning18'} />;
  };

  return (
    <ParentFrame active="wards" sidebar="linked">
      {optedOut ? (
        <WardOptedOut
          ward={ward}
          access={live ? accessFromDetail(detail.data) : access[wardId]}
          onRestore={() => setModal('restore')}
          onReport={() => setModal('report')}
        />
      ) : (
        <WardShell
          ward={shellWard}
          tab={flagsTab || !['profile', 'flags'].includes(tab) ? tab : 'overview'}
          notice={notice}
          onOpenVisibility={() => setModal('visibility')}
          onOpenUnlink={() => setModal('unlink')}
          onOpenOptOut={() => setModal('opt-out')}
          reviewProfileTo={hasFlags ? { search: '?tab=profile' } : undefined}
        >
          {renderTab()}
        </WardShell>
      )}
      <WardOptOutLayer ward={ward} linkedWards={linkedWards} live={liveAccess} />
      {modal === 'visibility' ? (
        <VisibilityDialog
          ward={ward}
          onClose={() => setModal(null)}
          onSave={(value) => {
            setModal(null);
            setToast(visibilityToast(ward, value));
          }}
        />
      ) : null}
      {modal === 'unlink' ? (
        <UnlinkDialog
          ward={ward}
          onClose={() => setModal(null)}
          onUnlink={async (reason) => {
            log('unlink', { wardId, reason, live });
            if (!live) {
              navigate(`/parent/wards?unlinked=${ward.id}`);
              return;
            }
            try {
              await unlinkWard(wardId);
              dropParentWard(wardId);
              await loadParentMe(true);
              navigate('/parent/wards', {
                state: { unlinked: { firstName: ward.firstName, pronoun: ward.pronoun } },
              });
            } catch (err) {
              setModal(null);
              setToast({ message: 'That didn’t go through', detail: parentError(err) });
            }
          }}
        />
      ) : null}
      {!live && wardId === 'abena' && !optedOut ? <WalletsLayer ward={ward} /> : null}
      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </ParentFrame>
  );
};

export default ParentWardPage;
