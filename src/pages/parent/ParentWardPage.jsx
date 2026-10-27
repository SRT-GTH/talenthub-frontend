import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import WardShell from '../../components/sections/parent/wards/WardShell.jsx';
import WardOverview from '../../components/sections/parent/wards/WardOverview.jsx';
import EvaluationsTab from '../../components/sections/parent/wards/tabs/EvaluationsTab.jsx';
import WalletTab from '../../components/sections/parent/wards/tabs/WalletTab.jsx';
import ActivityTab from '../../components/sections/parent/wards/tabs/ActivityTab.jsx';
import CrewTab from '../../components/sections/parent/wards/tabs/CrewTab.jsx';
import VisibilityDialog from '../../components/sections/parent/wards/dialogs/VisibilityDialog.jsx';
import UnlinkDialog from '../../components/sections/parent/wards/dialogs/UnlinkDialog.jsx';
import ParentToast from '../../components/sections/parent/wards/dialogs/ParentToast.jsx';
import { visibilityToast } from '../../components/sections/parent/wards/dialogs/data/dialogsData.js';
import WardFlagsSection from '../../components/sections/parent/flags/WardFlagsSection.jsx';
import { flagsBadge, useWardFlags } from '../../components/sections/parent/flags/flagsStore.js';

const log = debug('ParentWardPage');

/*
 * ParentWardPage — /parent/wards/:wardId (Figma canvas "Parent · 02 My wards and ward page" 10057:560). wardId = abena | elliot.
 *   ?tab=overview (default) PW-02 / PW-02b · evaluations PW-11 · wallet PW-12 · activity PW-13 · crew PW-16
 *   ?tab=profile · flags    Abena only: the Flags and corrections canvas (flags/WardFlagsSection: PW-03 … PW-06c, URL table there, wiki/parent-flags.md); other wards show the overview
 *   ?notice=turning18      PW-10 "Abena turns 18 on 12 March" over the overview (Abena only)
 *   ?modal=visibility      PW-14 "Who can find Abena"; saving closes it and shows the PW-14b toast
 *   ?modal=unlink          PW-15 "Unlink Elliot"; confirming goes to /parent/wards?unlinked=elliot (PW-15b: list without Elliot + toast)
 * Mock data only. ⚠️ ASSUMPTION: the unlink lives only in the URL (mock); Undo only closes the toast.
 */
const TABS = {
  evaluations: EvaluationsTab,
  wallet: WalletTab,
  activity: ActivityTab,
  crew: CrewTab,
};

const ParentWardPage = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [toast, setToast] = useState(null);
  const ward = WARDS[wardId];
  const tab = params.get('tab') || 'overview';
  const notice =
    params.get('notice') === 'turning18' && wardId === 'abena' ? 'turning18' : undefined;
  const modal = params.get('modal');
  const flagsState = useWardFlags();

  useEffect(() => {
    log('mount', { wardId, tab, notice, modal });
  }, [wardId, tab, notice, modal]);

  if (!ward || wardId === 'kwesi') return <Navigate to="/parent/wards" replace />;

  const setModal = (next) => {
    const p = new URLSearchParams(params);
    if (next) p.set('modal', next);
    else p.delete('modal');
    setParams(p, { replace: true });
  };
  const Tab = TABS[tab];
  // The mock holds only Abena's flags (flags/flagsStore): her Flags chip is live, the others keep wardsData.
  const hasFlags = wardId === 'abena';
  const flagsTab = hasFlags && (tab === 'profile' || tab === 'flags');
  const shellWard = hasFlags
    ? { ...ward, tabCounts: { ...ward.tabCounts, flags: flagsBadge(flagsState) } }
    : ward;

  return (
    <ParentFrame active="wards" sidebar="linked">
      <WardShell
        ward={shellWard}
        tab={flagsTab || !['profile', 'flags'].includes(tab) ? tab : 'overview'}
        notice={notice}
        onOpenVisibility={() => setModal('visibility')}
        onOpenUnlink={() => setModal('unlink')}
        reviewProfileTo={hasFlags ? { search: '?tab=profile' } : undefined}
      >
        {flagsTab ? (
          <WardFlagsSection ward={ward} tab={tab} />
        ) : Tab ? (
          <Tab ward={ward} />
        ) : (
          <WardOverview ward={ward} showSide={notice === 'turning18'} />
        )}
      </WardShell>
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
          onUnlink={(reason) => {
            log('unlink', { wardId, reason });
            navigate(`/parent/wards?unlinked=${ward.id}`);
          }}
        />
      ) : null}
      {toast ? <ParentToast {...toast} onClose={() => setToast(null)} /> : null}
    </ParentFrame>
  );
};

export default ParentWardPage;
