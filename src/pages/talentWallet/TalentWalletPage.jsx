import { useEffect } from 'react';
import { debug } from '../../utils/debug.js';
import WalletFrame from '../../components/sections/talentWallet/WalletFrame.jsx';
import WalletHeader, { WalletTabs } from '../../components/sections/talentWallet/WalletHeader.jsx';
import WalletHome from '../../components/sections/talentWallet/WalletHome.jsx';
import WalletTransactions from '../../components/sections/talentWallet/WalletTransactions.jsx';
import WalletCycles from '../../components/sections/talentWallet/WalletCycles.jsx';
import WalletSavings from '../../components/sections/talentWallet/WalletSavings.jsx';
import WalletUnder18 from '../../components/sections/talentWallet/WalletUnder18.jsx';
import WalletFinancing from '../../components/sections/talentWallet/WalletFinancing.jsx';
import WalletCredit from '../../components/sections/talentWallet/WalletCredit.jsx';
import {
  WalletEscrow,
  WalletSalary,
} from '../../components/sections/talentWallet/WalletPayouts.jsx';
import WalletKyc from '../../components/sections/talentWallet/WalletKyc.jsx';
import {
  WalletChecking,
  WalletNotSetUp,
  WalletRetake,
} from '../../components/sections/talentWallet/WalletOnboarding.jsx';
import { WalletEmptyHome } from '../../components/sections/talentWallet/WalletActivated.jsx';
import WalletDialogs from '../../components/sections/talentWallet/WalletDialogs.jsx';
import { useTalentWalletState } from '../../components/sections/talentWallet/talentWalletState.js';
import {
  getActiveTab,
  getHeader,
  getTabs,
  resolveScreen,
} from '../../components/sections/talentWallet/walletHeaders.js';

const log = debug('TalentWalletPage');

const SCREENS = {
  home: WalletHome,
  transactions: WalletTransactions,
  new: WalletNotSetUp,
  kyc: WalletKyc,
  checking: WalletChecking,
  retake: WalletRetake,
  empty: WalletEmptyHome,
  cycles: WalletCycles,
  savings: WalletSavings,
  under18: WalletUnder18,
  financing: WalletFinancing,
  credit: WalletCredit,
  escrow: WalletEscrow,
  salary: WalletSalary,
};

/*
 * TalentWalletPage — `/wallet`, Figma "Talent Wallet" (8817:693; Playful + Focused, expanded + collapsed sidebar).
 * Which screen shows is chosen from the URL (talentWalletState.js → resolveScreen in walletHeaders.js); the header and tab strip
 * follow the screen. Frame <-> URL table: wiki/talent-wallet.md.
 */
const TalentWalletPage = () => {
  const wallet = useTalentWalletState();
  const screen = resolveScreen(wallet);
  const header = getHeader(wallet);
  const tabs = getTabs(wallet);
  const Body = SCREENS[screen];

  useEffect(() => {
    log('mount', {
      screen,
      view: wallet.view,
      step: wallet.step,
      tab: wallet.tab,
      state: wallet.state,
    });
  }, [screen, wallet.view, wallet.step, wallet.tab, wallet.state]);

  const body = Body ? <Body wallet={wallet} /> : null;

  return (
    <WalletFrame wallet={wallet}>
      <div
        data-wallet-root=""
        className="flex flex-col gap-[24px] pb-[clamp(16px,1.85vw,32px)] pl-[clamp(12px,2.315vw,40px)] pr-[clamp(12px,3.241vw,56px)] pt-[clamp(16px,1.85vw,32px)]"
      >
        <WalletHeader header={header} />
        <div className="flex flex-col gap-[18px]">
          {tabs ? <WalletTabs wallet={wallet} tabs={tabs} active={getActiveTab(wallet)} /> : null}
          {body}
        </div>
      </div>
      <WalletDialogs wallet={wallet} />
    </WalletFrame>
  );
};

export default TalentWalletPage;
