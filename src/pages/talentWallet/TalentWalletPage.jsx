import { useEffect } from 'react';
import { debug } from '../../utils/debug.js';
import { isSampleMode } from '../../utils/sampleMode.js';
import { isLoggedIn } from '../../services/auth.api.js';
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
// Site copy: the texts staff edit are applied to this page's data (copy/copyBind.js).
import '../../copy/portals/talentPagesCopy.js';

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
 * Signed in (ADR-15): no wallet API exists yet (balance, transactions, KYC, Cycles, credit score), so a talent is told the wallet
 * is coming instead of seeing the drawn sample wallet (GHS 1,240.50, "KYC verified", escrow, credit score 712). The design frames
 * stay reachable with `?demo=1`, signed out in demo mode, and in Site copy preview.
 */
const COMING_SOON_HEADER = {
  title: 'Wallet',
  subtitle: 'Get paid for internships and gigs, earn Cycles for learning, and pay for training.',
  sticker: { icon: 'hourglass', label: 'Coming soon' },
  art: {
    linked: 'Coming soon',
    sticker: 'We’ll tell you when it opens',
    week: 'Nothing to set up yet',
  },
};

const WalletComingSoon = () => (
  <section className="flex max-w-[640px] flex-col gap-[10px] rounded-[24px] border border-solid border-[#e1eae2] bg-white p-[24px]">
    <h2 className="m-0 font-sans text-[21px] font-semibold leading-[26px] text-[#1c2a21] playful:font-heading">
      Your wallet isn’t open yet
    </h2>
    <p className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
      Payments, payouts, savings and Cycles aren’t live on Ghana Talent Hub yet, so there is nothing
      to show here and nothing for you to set up. We’ll let you know when your wallet opens.
    </p>
  </section>
);

/*
 * TalentWalletPage — `/wallet`, Figma "Talent Wallet" (8817:693; Playful + Focused, expanded + collapsed sidebar).
 * Which screen shows is chosen from the URL (talentWalletState.js → resolveScreen in walletHeaders.js); the header and tab strip
 * follow the screen. Frame <-> URL table: wiki/talent-wallet.md.
 */
const TalentWalletPage = () => {
  const wallet = useTalentWalletState();
  const comingSoon = isLoggedIn() && !isSampleMode();
  const screen = resolveScreen(wallet);
  const header = comingSoon ? COMING_SOON_HEADER : getHeader(wallet);
  const tabs = comingSoon ? null : getTabs(wallet);
  const Body = comingSoon ? WalletComingSoon : SCREENS[screen];

  useEffect(() => {
    log('mount', {
      screen: comingSoon ? 'coming-soon (signed in, no wallet API)' : screen,
      view: wallet.view,
      step: wallet.step,
      tab: wallet.tab,
      state: wallet.state,
    });
  }, [comingSoon, screen, wallet.view, wallet.step, wallet.tab, wallet.state]);

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
      {comingSoon ? null : <WalletDialogs wallet={wallet} />}
    </WalletFrame>
  );
};

export default TalentWalletPage;
