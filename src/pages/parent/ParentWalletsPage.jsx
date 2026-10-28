import { useSearchParams } from 'react-router-dom';
import { debug } from '../../utils/debug.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ParentFrame from '../../components/sections/parent/ParentFrame.jsx';
import { WARDS } from '../../components/sections/parent/wards/data/wardsData.js';
import WalletsOverview from '../../components/sections/parent/wallets/WalletsOverview.jsx';
import WalletsLayer from '../../components/sections/parent/wallets/WalletsLayer.jsx';
import { useWallets } from '../../components/sections/parent/wallets/walletsStore.js';

const log = debug('ParentWalletsPage');

/*
 * ParentWalletsPage — /parent/wallets "Ward wallets" (Figma canvas "Parent · 08 Ward wallets" 10057:66889, frames PWa-01 … PWa-08b; the URL table and the flow are in wallets/WalletsLayer.jsx, wiki/parent-wallets.md).
 * The page is wallets/WalletsOverview; the dialogs and toasts are wallets/WalletsLayer, over the store the ward page's Wallet tab shares. Mock data only (Emma Mensah's wards Abena and Elliot).
 */
const ParentWalletsPage = () => {
  const [params, setParams] = useSearchParams();
  const wallets = useWallets();
  useDocumentTitle('Ward wallets');
  log('render', { modal: params.get('modal') });

  const open = (modal) => {
    const p = new URLSearchParams(params);
    p.set('modal', modal);
    setParams(p, { replace: true });
  };

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
