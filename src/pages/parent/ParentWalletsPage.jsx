import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import WalletsOverview from '../../components/sections/parent/wallets/WalletsOverview.jsx';
import WalletsLayer from '../../components/sections/parent/wallets/WalletsLayer.jsx';
import { useWallets } from '../../components/sections/parent/wallets/walletsStore.js';
import { useParentLiveMode } from '../../components/sections/parent/live/parentLive.js';
import ParentNotYet from '../../components/sections/parent/states/ParentNotYet.jsx';
import { NOT_YET_PAGES } from '../../components/sections/parent/states/notYetCopy.js';

const log = debug('ParentWalletsPage');

/*
 * ParentWalletsPage — /parent/wallets "Ward wallets" (Figma canvas "Parent · 08 Ward wallets" 10057:66889, frames PWa-01 … PWa-08b; the URL table and the flow are in wallets/WalletsLayer.jsx, wiki/parent-wallets.md).
 * The page is wallets/WalletsOverview; the dialogs and toasts are wallets/WalletsLayer, over the store the ward page's Wallet tab shares. Mock data only (Emma Mensah's wards Abena and Elliot).
 * Live (signed-in parent, not a frame URL): no ward-wallet endpoint exists (payment requests, approve / decline, limits, top-up), so the page says so
 * (ParentNotYet) instead of showing Emma's mock wallets, as the live ward page's Wallet tab does.
 */
const ParentWalletsPage = () => {
  const [params, setParams] = useSearchParams();
  const wallets = useWallets();
  const live = useParentLiveMode();
  useDocumentTitle('Ward wallets');
  log('render', { modal: params.get('modal'), live });

  const open = (modal) => {
    const p = new URLSearchParams(params);
    p.set('modal', modal);
    setParams(p, { replace: true });
  };

  if (live) {
    return (
      <ParentFrame active="wallets" sidebar="linked">
        <ParentNotYet {...NOT_YET_PAGES.wallets} />
      </ParentFrame>
    );
  }

  return (
    <ParentFrame active="wallets" sidebar="linked">
      <WalletsOverview
        wards={WARDS}
        wallets={wallets}
        onApprove={() => open('approve')}
        onDecline={() => open('decline')}
        onLimits={() => open('limits')}
        onOpenElliot={() => open('open-wallet')}
      />
      <WalletsLayer ward={WARDS.abena} openWalletFor={WARDS.elliot} />
    </ParentFrame>
  );
};

export default ParentWalletsPage;
